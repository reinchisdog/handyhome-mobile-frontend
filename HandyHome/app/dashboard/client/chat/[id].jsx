// Screen: Chat Screen

// Imports
// ---- React Native and Expo Components
import { FlatList, Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, ImageBackground } from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
// ---- Other Components
import Header from '../../../../components/Header';
import LoadingDots from '../../../../components/LoadingDots'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ErrorModal from '../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';
import Icons1 from '@expo/vector-icons/MaterialIcons';
import Icons2 from '@expo/vector-icons/MaterialCommunityIcons';
// ---- Other Libs
import { useAuth } from '../../../../context/AuthContext';
import { useInbox } from '../../../../context/InboxContext';
import api from '../../../../lib/api';
import supabase from '../../../../lib/supabase';
import {useMedia} from '../../../../context/MediaContext';
import { useConvert } from '../../../../hooks/useConvert';

const ClientChatScreen = () => {
   // Hooks and States
   const {id} = useLocalSearchParams();
   const insets = useSafeAreaInsets();
   const {currentChatSession, clearCurrentChat, refreshInboxItem} = useInbox();
   const {token, user} = useAuth();
   const {openCamera, returnedImage, clearImage} = useMedia();
   const {convertUriToFile} = useConvert();

   const [initializing, setInitializing] = useState(true);
   const [messages, setMessages] = useState([]);
   const [tempMessages, setTempMessages] = useState([]);
   const [hasMore, setHasMore] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [isLoadingMore, setIsLoadingMore] = useState(false);

   const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36)}`;
   const [message, setMessage] = useState({
      message_text: "",
      attachment: null,
   })

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');

   // Functions
   const markAsRead = async () => {
      try {
         // console.log(`Marking Chat (${currentChatSession.id}) as Read`);
         await api.put(`/messages/reads/${currentChatSession.id}`, {}, {
            headers: {'Authorization': `Bearer ${token}`}
         })
         await refreshInboxItem(currentChatSession.id);
      } catch (err) {   
         console.log(err);
      }
      
   }
   const fetchMessages = async (page = 1, limit = 20, append = false) => {
      try {
         console.log("Fetching Messages for Booking", id, "Page:", page, "with Limit:", limit);
         const messageResult = await api.get(`/messages/chats/${id}?page=${page}&limit=${limit}`, {
            headers: {'Authorization': `Bearer ${token}`},
         });
         
         const messageData = messageResult?.data?.message?.messages || [];
         const hasMore = messageData.length === limit;

         if (append) {
            setMessages(prev => {
               const existingIds = new Set(prev.map(msg => msg.id));
               const newMessages = messageData.filter(msg => !existingIds.has(msg.id));
               return [...prev, ...newMessages];
            });
         } else {
            setMessages(messageData);
         }

         setHasMore(hasMore);
         return messageData.length;
      } catch (err) {
         console.log(err);
         setHasMore(true);
         return 0;
      }
   }

   const fetchMoreMessages = async () => {
      if (!hasMore || isLoadingMore) return;

      console.log("Fetching More");

      setIsLoadingMore(true);

      try {
         const nextPage = currentPage + 1;

         const fetchedCount = await fetchMessages(nextPage, 20, true);

         if (fetchedCount > 0) {
            setCurrentPage(nextPage);
         } else {
            setHasMore(false);
         }
      } catch(err) {

      } finally {
         setIsLoadingMore(false);
      }
   }

   const sendMessage = async () => {
      // console.log(message.attachment);
      console.log("---- Sending Message [Client-Side] ----");
      if (!message.message_text.trim() && !message.attachment) return;

      const tempId = generateTempId();
      const tempMessage = {
         id: tempId,
         message_text: message.message_text,
         attachment: message.attachment,
         sender_id: user.user_id,
         receiver_id: currentChatSession.user_info.user_id,
         created_at: new Date().toISOString(),
         status: 'sending',
         isTemporary: true
      };

      console.log("Generating Temp Message:", tempMessage);

      setTempMessages(prev => [tempMessage, ...prev]);

      const messageToSend = {...message};
      setMessage({
         message_text: "",
         attachment: null
      })

      try {
         const body = new FormData();
         body.append("booking_id", currentChatSession.booking_info.id);
         body.append("receiver_id", currentChatSession.user_info.user_id);
         body.append("message_text", messageToSend.message_text);
         if (messageToSend.attachment) body.append("attachment", convertUriToFile(messageToSend.attachment));

         for (let [key, value] of body.entries()) {
            if (typeof value === 'object' && value.uri) {
               console.log(`${key}:`);
               console.log(`   uri: ${value.uri}`);   
               console.log(`   name: ${value.name}`);
               console.log(`   type: ${value.type}`);
            } else {
               console.log(`${key}: ${value}`);
            }
         }

         const sendResponse = await api.post(`/messages/send/${currentChatSession.id}`, body, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'multipart/form-data'
            }
         });

         setTempMessages(prev =>
            prev.map(msg =>
               msg.id === tempId ? { ...msg, status: 'sent'} : msg
            )
         )
      } catch (err) {
         const message =  err?.response?.data?.message || err?.message;
         // console.error(message);
         setTempMessages(prev => 
            prev.map(msg => 
               msg.id === tempId 
                  ? { ...msg, status: 'failed' }
                  : msg
            )
         );
      } 
   }

   const retryMessage = async (tempId) => {
      const failedMessage = tempMessages.find(msg => msg.id === tempId);
      if (!failedMessage) return;

      setTempMessages(prev =>
         prev.map(msg =>
            msg.id === tempId ? {...msg, status: 'sending'} : msg
         )
      );

      try {
         const body = new FormData();
         body.append("booking_id", currentChatSession.booking_info.id);
         body.append("receiver_id", currentChatSession.user_info.user_id);
         body.append("message_text", failedMessage.message_text);
         if (failedMessage.attachment) body.append("attachment", convertUriToFile(failedMessage.attachment));

         const sendResponse = await api.post(`/messages/send/${currentChatSession.id}`, body, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'multipart/form-data'
            }
         });

         setTempMessages(prev =>
            prev.map(msg =>
               msg.id === tempId ? { ...msg, status: 'sent'} : msg
            )
         )

      } catch (err) {
         const message =  err?.response?.data?.message || err?.response;
         // console.error(message);
         setTempMessages(prev => 
            prev.map(msg => 
               msg.id === tempId 
                  ? { ...msg, status: 'failed' }
                  : msg
            )
         );
      }
   }

   // Effects
   // ---- Initialization
   useFocusEffect(useCallback(() => {
      const init = async () => {
         setInitializing(true);
         setCurrentPage(1);
         setTempMessages([]);
         setHasMore(true);

         await fetchMessages(1, 20, false);
         setInitializing(false);
         await markAsRead();
      };
      
      init();
   }, [id]))

   // ---- Image Handling
   const hasProcessedImage = useRef(false);

   useEffect(() => {
      if (!returnedImage) {
         hasProcessedImage.current = false;
         return;
      }

      if (hasProcessedImage.current) return;

      console.log(returnedImage);

      if (returnedImage.endsWith('jpg') || returnedImage.endsWith('jpeg')) {
         setMessage(prev => ({
            ...prev,
            attachment: returnedImage  
         }));
      } else {
         setMessage(prev => ({
            ...prev,
            attachment: null  
         }));
         setErrorMessage('The image should be in the jpg/jpeg format. Please try again.');
         setErrorModal(true);
      }

      hasProcessedImage.current = true;
      clearImage();
   }, [returnedImage, clearImage])

   // Realtime
   const subscriptionRef = useRef(null);
   
   const cleanupSubscription = () => {
      if (subscriptionRef.current) {
         subscriptionRef.current.unsubscribe();
         subscriptionRef.current = null;
      }
   }

   // ---- Listener
   useEffect(() => {
      if (initializing) {
         cleanupSubscription();
         return;
      }

      cleanupSubscription();

      const changes = supabase
         .channel ('chat-messages')
         .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `session_id=eq.${currentChatSession.id}`
         }, async (payload) => {
            const newMessage = payload.new;
            
            setTempMessages(prev => {
               const matchIndex = prev.findIndex(msg =>
                  msg.isTemporary &&
                  msg.sender_id === newMessage.sender_id &&
                  msg.message_text === newMessage.message_text
               )

               if (matchIndex !== -1) {
                  const updated = [...prev];
                  updated.splice(matchIndex, 1);
                  return updated;
               }

               return prev;
            });

            setMessages(prev => [newMessage, ...prev]);

            await markAsRead();
         }).subscribe();

      subscriptionRef.current = changes;

      return () => {
         cleanupSubscription();
      };
   }, [initializing])

   const allMessages = React.useMemo(() => {
      const combined = [...tempMessages, ...messages];

      const uniqueMap = new Map();
      combined.forEach(msg => {
         uniqueMap.set(msg.id, msg);
      })

      return Array.from(uniqueMap.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
   }, [messages, tempMessages]);

   // Renders
   const renderMessage = ({item, index}) => {
      // console.log(item.sender_id, user.user_id);
      const isSender = item.sender_id === user.user_id;
      const isTemporary = item.isTemporary;

      const nextMessage = index > 0 ? allMessages[index - 1] : null;
      const showFooter = isFooterShown(item, nextMessage)

      const isLatestSenderMessage = () => {
         const senderMessages = allMessages.filter(msg => msg.sender_id === user.user_id);
         return senderMessages.length > 0 && senderMessages[0].id === item.id;
      };

      const showStatus = isSender && isLatestSenderMessage() && (isTemporary || item.status);

      const getStatusText = () => {
         if (isTemporary) {
            switch (item.status) {
               case 'sending': return 'Sending';
               case 'sent': return 'Sent';
               case 'failed': return 'Failed, tap to resend';
               default: return '';
            }
         }
         return '';
      };

      const handleStatusPress = () => {
         if (item.status === 'failed' && isTemporary) {
            retryMessage(item.id);
         }
      }

      const handleAttachmentPress = () => {

      }

      return (
         <View style={[
            styles.messageRow,
            isSender ? styles.senderRow : styles.receiverRow
         ]}>
            <View style={[
               styles.messageBubble,
               isSender ? styles.senderBubble : styles.receiverBubble,
               isTemporary && item.status === 'failed' && styles.failedBubble, {
               gap: 8,
            }]}>
               {/* ---- Text */}
               {item.message_text && (
                  <Text style={[ 
                     styles.messageText,
                     isTemporary && item.status === 'sending' && styles.sendingText
                  ]}>
                     {item.message_text}
                  </Text>
               )}
               {/* ---- Attachment */}
               {item.attachment && (
                  <Pressable
                  onPress={handleAttachmentPress}
                  style={{
                     minWidth: '100%',
                  }}
                  >
                     <Image 
                     source={{uri: item.attachment}}
                     style={{
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: COLORS.labels,
                        width: '100%',
                        height: 200, // Define explicit height
                        resizeMode: 'cover',
                     }}
                     />
                  </Pressable>
               )}
            </View>
            
            {showFooter && (
               <Pressable
               onPress={item.status === 'failed' ? handleStatusPress : undefined}
               disabled={item.status !== 'failed'}
               >
                  <Text style={[
                     styles.footerText, {
                     color: item.status === 'failed' ? COLORS.red : COLORS.labels
                  }]}>
                     {showStatus ? `${getStatusText()} • ${formatTime(item.created_at)}` : formatTime(item.created_at)}
                  </Text>
               </Pressable>
            )} 
         </View>
      )
   }

   const isFooterShown = (current, next) => {
      // Case 1: last message (no next one)
      if (!next) { return true; }

      // Case 2: different senders
      if (current.sender_id !== next.sender_id) { return true; }

      // Case 3: time gap between messages
      const timeDiff = new Date(next.created_at) - new Date(current.created_at);
      if (timeDiff > 5 * 60 * 1000) { return true; }

      return false;
   };

   const renderFooter = () => (
      <View style={{
         width: '100%',
         paddingHorizontal: 24,
         paddingVertical: 48,
         justifyContent: 'center',
         alignItems: 'center'
      }}>
         {(isLoadingMore || (initializing && messages.length === 0)) && (
            <LoadingDots size={10} slide={false}/>
         )}

         {(!hasMore && !isLoadingMore && !initializing) && (
         <Text style={{
            fontFamily: FONTS.roboto400,
            fontSize: FONT_SIZES.sm,
            color: COLORS.labels
         }}>
            You are now able to message each other.
         </Text>
         )}
      </View> 
   )

   const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.abs(now - date) / 36e5;
      
      if (diffInHours < 24) {
         // Today - show time only
         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 168) {
         // This week - show day and time
         return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
      } else {
         // Older - show date and time
         return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
   };

   return (
      <View style={[global.screenContainer, {backgroundColor: COLORS.primary}]}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={'Something went wrong!'}
         message={errorMessage}
         />

         <Header 
         hasBack
         backColor='#fff'
         backgroundColor={COLORS.primary}
         customTitle={
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', paddingLeft: 48, paddingRight: 24}}>
               <Image 
               source={{uri: currentChatSession.user_info.profile_photo_url}}
               style={{
                  height: 42,
                  width: 42,
                  borderRadius: 21,
                  resizeMode: 'cover',
                  objectFit: 'cover'
               }}/>

               <View style={{gap: 2, flex: 1}}>
                  <Text
                  numberOfLines={1}
                  style={{
                     flexShrink: 1,
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.md,
                     color: '#fff'
                  }}
                  >
                     {currentChatSession.user_info.full_name}
                  </Text>
                  <Text
                  numberOfLines={1}
                  style={{
                     flexShrink: 1,
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: '#fff',
                     opacity: 0.6
                  }}
                  >
                     {`(${currentChatSession.booking_info.status}) ${currentChatSession.booking_info.sub_service.name}`}
                  </Text>
               </View>
            </View>
         }/>

         <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={-insets.bottom}>
            <FlatList 
            inverted
            data={allMessages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => `${item.isTemporary ? 'temp' : 'msg'}_${item.id}_${index}`}
            style={{flex: 1, backgroundColor: COLORS.screenbg}}
            contentContainerStyle={{paddingTop: 24}}
            ListFooterComponent={renderFooter}
            onEndReached={() => {   
               if (!initializing && allMessages.length > 0) {
                  console.log("Reached Top");
                  setTimeout(() => fetchMoreMessages(), 100);
               }
            }}
            onEndReachedThreshold={0.3}
            // removeClippedSubviews={false}
            />

            <View
            style={[
               global.shadowBottom, 
               styles.inputContainer, {
               paddingBottom: insets.bottom,
            }]}>
               {message.attachment &&
                  <View
                  style={{
                     paddingHorizontal: 12,
                     paddingTop: 12,
                  }}>
                     <ImageBackground
                     source={{uri: message.attachment}}
                     style={styles.imageContainer}
                     imageStyle={styles.imageUpload}>
                        <TouchableOpacity
                        style={styles.imageDelete}
                        onPress={() => {setMessage(prev => ({
                           ...prev,
                           attachment: null
                        }))}}>
                           <Icons2 name='window-close' size={12} color={'#fff'}/>
                        </TouchableOpacity>
                     </ImageBackground>
                  </View>
               }

               <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
               }}>
                  <Pressable
                  onPress={() => {openCamera(true, true, 'back')}}
                  style={({pressed}) => [{
                     height: 64,
                     paddingHorizontal: 8,
                     justifyContent: 'center',
                     alignItems: 'flex-end',
                     opacity: pressed ? 0.6 : 1,
                  }]}>
                     <Icons1 name='image' size={32} color={COLORS.primary}/>
                  </Pressable>

                  <TextInput 
                  value={message.message_text}
                  onChangeText={(text) => setMessage(prev => ({
                     ...prev,
                     message_text: text,
                  }))}
                  placeholder='Send Message'
                  placeholderTextColor={COLORS.labels}
                  style={styles.textInput}
                  multiline
                  maxLength={500}
                  />

                  <Pressable
                  onPress={sendMessage}
                  disabled={!message.message_text.trim() && !message.attachment}
                  style={({pressed}) => [
                     styles.sendButton, {
                     opacity: pressed ? 0.6 : 1
                  }]}>
                     <Icons1 name='send'  size={30} color={COLORS.primary}/>
                  </Pressable>
               </View>
               
            </View>
         </KeyboardAvoidingView>
      </View>
   )
}

export default ClientChatScreen

const styles = StyleSheet.create({
   messageRow: {
      marginVertical: 1,
      paddingHorizontal: 16,
   },
   senderRow: {
      alignItems: 'flex-end',
   },
   receiverRow: {
      alignItems: 'flex-start'
   },
   messageBubble: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 16,
      maxWidth: '85%',
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 1,
   },
   senderBubble: {
      backgroundColor: COLORS.lightblue
   },
   receiverBubble: {
      backgroundColor: '#fff'
   },
   failedBubble: {
      borderWidth: 1,
      borderColor: COLORS.red,
      opacity: 0.8
   },
   messageText: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons,
      textAlign: 'justify'
   },
   sendingText: {
      opacity: 0.7
   },
   footerText: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      marginBottom: 12,
      marginTop: 4
   },
   listFooter: {
      paddingHorizontal: 24,
      paddingVertical: 48,
      justifyContent: 'center',
      alignItems: 'center'
   },
   footerInfoText: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.labels
   },
   loadMoreButton: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      alignItems: 'center'
   },
   loadMoreText: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      color: COLORS.primary
   },
   inputContainer: {
      backgroundColor: '#fff',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: COLORS.strokes,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
   },
   attachButton: {
      height: 64,
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'flex-end',
   },
   textInput: {
      backgroundColor: COLORS.secondary,
      flex: 1,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: COLORS.strokes,
      minHeight: 40,
      maxHeight: 120,
      paddingHorizontal: 12,
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons,
      marginVertical: 12,
   },
   sendButton: {
      height: 64,
      paddingHorizontal: 13,
      justifyContent: 'center',
      alignItems: 'flex-end',
   },
   imageContainer: {
      height: 72,
      width: 72,
      aspectRatio: '1/1',
      backgroundColor: COLORS.secondary,
      borderColor: COLORS.labels,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
   },
   imageUpload: {
      objectFit: 'cover'
   },
   imageDelete: {
      position: 'absolute',
      top: 6,
      right: 6,
      opacity: 0.5,
      width: 16,
      height: 16,
      borderRadius: 4,
      backgroundColor: COLORS.lettersicons,
      justifyContent: 'center',
      alignItems: 'center'
   },
})