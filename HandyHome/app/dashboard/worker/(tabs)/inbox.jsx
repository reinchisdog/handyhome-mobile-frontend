// Screen: Client Inbox

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, FlatList, Pressable, Image, TextInput, RefreshControl } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'expo-router';
// ---- Other Components
import Header from '../../../../components/Header';
import LoadingDots from '../../../../components/LoadingDots';
import {useInbox} from '../../../../context/InboxContext';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
// ---- Styles and Icons
import { launchStyles as launch } from '../../../../styles/launchStyles'
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';
import Icons from '@expo/vector-icons/MaterialIcons';

const WorkerInbox = () => {
   // Hooks and States
   const router = useRouter();
   const {inbox, page, setPage, loading, loadingMore, refreshing, hasMore, setHasMore, fetchInbox, setCurrentChat} = useInbox();

   const [search, setSearch] = useState("")

   // Functions
   const fetchMore = useCallback(async () => {
      if (!hasMore || loadingMore || loading) return;

      await fetchInbox(page + 1, false);
   }, [inbox, loadingMore, loading, page])

   const fetchRefresh = async () => {
      console.log(loading, loadingMore);
      setSearch("")
      setPage(1);
      setHasMore(true);
      await fetchInbox(1, true);
   }

   // Effects
   useEffect(() => {
      if (search.trim() === "") return;

      const handleSearch = setTimeout(() => {
         setPage(1);
         setHasMore(true);
         fetchInbox(1, true, search);
      }, 500)

      return () => clearTimeout(handleSearch);
   }, [search])

   // Renders
   const renderFooter = () => (
      <View style={{
         width: '100%',
         paddingVertical: 32,
         // backgroundColor: COLORS.accent
         alignItems: 'center',
         justifyContent: 'center'
      }}>
         {(loadingMore || (loading && inbox.length === 0)) && (
               <LoadingDots size={12} />
         )}
      </View>
   )

   const formatMessageTime = (timestamp) => {
      const now = new Date();
      const messageTime = new Date(timestamp);
      const diffInHours = Math.abs(now - messageTime) / 36e5;
      
      if (diffInHours < 24) {
         return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 168) { // Less than a week
         return messageTime.toLocaleDateString([], { weekday: 'short' });
      } else {
         return messageTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
   };

   return (
      <View style={[global.screenContainer, {backgroundColor: '#fff'}]}>
         <Header 
         hasBack={false}
         title={"Inbox"}
         backgroundColor={COLORS.primary}
         textColor='#fff'
         />

         <View style={{paddingHorizontal: 24, paddingBottom: 12, backgroundColor: COLORS.primary, position: 'relative', zIndex: 999}}>
            <View style={{
               flexDirection: 'row',
               backgroundColor: '#fff',
               borderRadius: 12,
               alignItems: 'center',
               paddingRight: 12
            }}>
               <TextInput 
               value={search}
               onChangeText={(text) => setSearch(text)}
               placeholder='Search Inbox'
               placeholderTextColor={COLORS.labels}
               style={{
                  flex: 1,
                  paddingHorizontal: 12,
                  fontFamily: FONTS.roboto500,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.lettersicons
               }}
               />
               <Icons name='search' size={24} color={COLORS.labels}/>
            </View>

            
         </View>

         <FlatList 
         data={inbox}
         renderItem={({item}) => (
            <Pressable
            onPress={() => {setCurrentChat(item)}}
            style={({pressed}) => [{
               padding: 24,
               flexDirection: 'row',
               borderBottomWidth: StyleSheet.hairlineWidth,
               borderBottomColor: COLORS.strokes,
               alignItems: 'center',
               gap: 12,
               backgroundColor: pressed ? COLORS.summaryPress : item.has_unread ? '#ebf7ff' : '#fff'
            }]}>
               <Image 
               source={{uri: item.user_info.profile_photo_url}}
               style={{
                  aspectRatio: 1/1,
                  height: 48,
                  width: 48,
                  borderRadius: 24,
                  resizeMode: 'cover',
                  objectFit: 'cover'
               }}/>

               <View style={{justifyContent: 'space-between', flexShrink: 1}}>
                  <Text style={{
                     fontFamily: item.has_unread ? FONTS.roboto700 : FONTS.roboto500,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.lettersicons
                  }}>
                     {item.user_info.full_name}
                  </Text>
                  <View style={{flexDirection: 'row', gap: 4,}}>
                     <Text 
                     numberOfLines={1}
                     style={{
                        fontFamily: item.has_unread ? FONTS.roboto700 : FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: item.has_unread ? COLORS.lettersicons : COLORS.labels,
                        flexShrink: 1,
                     }}>
                        {item.last_message || "You are now able to message each other."}
                     </Text>
                     <Text 
                     numberOfLines={1}
                     style={{
                        fontFamily: item.has_unread ? FONTS.roboto700 : FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: item.has_unread ? COLORS.lettersicons : COLORS.labels,
                     }}>
                        •  {formatMessageTime(item.last_message_time)}
                     </Text>

                  </View>
                  
               </View>

               {item.has_unread &&
               <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <View 
                  style={{
                     backgroundColor: COLORS.primary,
                     height:  12,
                     width: 12,
                     aspectRatio: 1/1,
                     borderRadius: 6,
                     marginLeft: 12
                  }}/>
               </View>
               }
            </Pressable>
         )}
         onEndReachedThreshold={0.5}
         onEndReached={fetchMore}
         refreshing={refreshing}
         onRefresh={fetchRefresh}
         refreshControl={
            <RefreshControl 
            refreshing={refreshing}
            colors={[COLORS.lightblue, COLORS.primary]}
            onRefresh={fetchRefresh}
            />
         }
         showsVerticalScrollIndicator={false}
         ListFooterComponent={renderFooter}
         ListEmptyComponent={() => (
            !loading &&
               <View
               style={{
               alignItems: 'center',
               justifyContent: 'center',
               gap: 12,
               paddingHorizontal: 24,
               flex: 1,
               }}>
                  <Image
                  source={require('../../../../assets/images/illustrations/EmptyBookings.png')}
                  style={{
                     height: 200,
                     width: 200,
                     aspectRatio: 1/1
                  }}
                  />
         
                  <Text 
                  style={[
                     launch.title, {
                     marginBottom: 0, 
                     marginTop: 4,
                  }]}>
                     No Messages yet
                  </Text>
                  <Text style={[launch.description, {paddingHorizontal: 0}]}>
                     Book an appointment to connect and communicate with a service provider.
                  </Text>
               </View>
         )}
         contentContainerStyle={{
            flexGrow: 1
         }}
         />
      </View>
   )
}

export default WorkerInbox

const styles = StyleSheet.create({})