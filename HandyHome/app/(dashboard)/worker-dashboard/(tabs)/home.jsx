/* --------------------------------- Imports -------------------------------- */
import { ScrollView, Text, View, TouchableOpacity, TouchableHighlight, FlatList, useWindowDimensions, Animated, Image, Easing, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useAppData } from '../../../../context/AppDataContext';
import { subServiceImages } from '../../../../components/SubServiceMap';
import { API_URL } from '../../../../config';
import axios from 'axios';
/* ------------------------------- Components ------------------------------- */
import Header from '../../../../components/dashboard/Header';
import TextLogo from '../../../../components/logos/TextLogo';
import SmallButton from '../../../../components/SmallButton';
import ErrorModal from '../../../../components/ErrorModal'

/* ---------------------------- Styles and Icons ---------------------------- */
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/Entypo'
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const IncomingItems = [
   {
      id: 1,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
   {
      id: 2,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
   {
      id: 3,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
   {
      id: 4,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
   {
      id: 5,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
]

export default HomeScreen = () => {
   /* ----------------------------- Initialization ----------------------------- */
   const { user, token } = useAuth();
   const skeletonOpacity = useRef(new Animated.Value(0.5)).current;

   /* -------------------------------- Functions ------------------------------- */
   const [incomingRequests, setIncomingRequests] = useState([])

   const [incomingReqLoading, setIncomingReqLoading] = useState(true);
   useEffect(() => {
      const animLoop = Animated.loop(
         Animated.sequence([
            Animated.timing(skeletonOpacity, {
               toValue: 0.5,
               duration: 250,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true
            }),
            Animated.timing(skeletonOpacity, {
               toValue: 0.2,
               duration: 500,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true
            }),
            Animated.timing(skeletonOpacity, {
               toValue: 0.5,
               duration: 250,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true
            }),
         ])
      )

      if (incomingReqLoading) animLoop.start();
      
      return () => animLoop.stop();
   }, [incomingReqLoading])

   const fetchIncomingRequests = async () => {
      try {
         setIncomingReqLoading(true);

         const result = await axios.get(`${API_URL}/worker/bookings/pending`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         setIncomingRequests([...result.data.data]);
         return true;

      } catch (err) {
         console.log(err)
         return false;
      } finally {
         setTimeout(() => {
            setIncomingReqLoading(false);
         }, 1000)
      }
   }

   useFocusEffect(
      React.useCallback(() => {
         let intervalId;
      
         const startPolling = async () => {
            const result = await fetchIncomingRequests(); 
            if (result) {
               intervalId = setInterval(fetchIncomingRequests, 15000); 
            }  
            
         };
      
         startPolling();
      
         return () => {
            clearInterval(intervalId); 
         };
      }, [user, token])
   );

   const [buttonLoading, setButtonLoading] = useState(false);

   const handleReject = async (id) => {
      try {
         setButtonLoading(true);

         const result = await axios.put(`${API_URL}/worker/bookings/${id}/reject_booking`, null, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         const status = result?.data?.status || "error"
         const message = result?.data?.message

         if (status === "success") 
            console.log(result.data)
         else if (status === "failed" || status === "error")
            throw new Error(message)

         
         fetchIncomingRequests();
      } catch (err) {
         const message = err?.message || "An unexpected error has occurred when rejecting the booking request."
         showModal("Booking Rejection Error", message)
      } finally {
         setButtonLoading(false);
      }
   }

   const handleAccept = async (id) => {
      try {
         setButtonLoading(true);

         const result = await axios.put(`${API_URL}/worker/bookings/${id}/confirm_booking`, null, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         const status = result?.data?.status || "error"
         const message = result?.data?.message

         if (status === "success") 
            console.log(result.data)
         else if (status === "failed" || status === "error")
            throw new Error(message)

         
         fetchIncomingRequests();
      } catch (err) {
         const message = err?.message || "An unexpected error has occurred when accepting the booking request."
         showModal("Booking Acceptance Error", message)
      } finally {
         setButtonLoading(false);
      }
   }

   const [showModalError, setShowModalError] = useState(false);
   const [errorTitle, setErrorTitle] = useState(null);
   const [errorMessage, setErrorMessage] = useState(null);

   const showModal = (title, message) => {
      setErrorTitle(title);
      setErrorMessage(message);
      setShowModalError(true);
   }

   return (
      <>
         <ErrorModal 
         visible={showModalError}
         setVisible={setShowModalError}
         title={errorTitle}
         message={errorMessage}
         />

         <ScrollView 
         // showsHorizontalScrollIndicator={true}
         showsVerticalScrollIndicator={true}
         style={[global.screenContainer]}
         contentContainerStyle={{ backgroundColor: COLORS.screenbg }}
         stickyHeaderIndices={[0]}>
            <Header 
            title={<TextLogo width={140}/>}
            titlePosition='absolute'
            right={
            <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {}}>
               <Icons1 name="bell" size={24} color={COLORS.primary}/>
            </TouchableOpacity>
            }/>

            <View 
            style={[{
            width: '100%',
            }]}>
               {/* ------------------------------ Main Content ------------------------------ */}
               <View 
               style={[{
                  paddingVertical: 24,
                  flex: 1,
                  gap: 24,
                  zIndex: 1,
               }]}>

                  {/* ---- User Greeting */}
                  <View 
                  style={[{
                     paddingHorizontal: 24,
                     flexDirection: 'row',
                     height: 42,
                     width: '100%',
                     alignItems: 'center'
                  }]}>
                     <Text 
                     style={[global.headingText, {
                     color: COLORS.lettersicons
                     }]}>
                     Hello, <Text style={[global.headingText, {color: COLORS.primary}]}>{`${user?.full_name || "There"} !`}</Text>
                     </Text>
                  </View>

                  {/* ---- Upcoming Booking(s) */}
                  <View 
                  style={{
                     borderRadius: 20,
                     backgroundColor: '#fff',
                     marginHorizontal: 24,
                  }}>
                     {/* ---- Information */}
                     <View
                     style={{
                        flexDirection: 'row',
                        padding: 18,
                        borderBottomWidth: 1,
                        borderColor: COLORS.strokes,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8
                     }}>
                        <View
                        style={{
                           flex: 1,
                           gap: 12
                        }}>
                           {/* ---- Service */}
                           <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
                              <Icons1 name='pipe-wrench' size={24} color={COLORS.primary}/>
                              <Text numberOfLines={1}
                              style={{
                                 fontFamily: FONTS.roboto500,
                                 fontSize: FONT_SIZES.md,
                                 color: COLORS.lettersicons,
                                 flexShrink: 1
                              }}>
                                 Leak Repair
                              </Text>
                           </View>
                           {/* ---- Location */}
                           <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
                              <Icons2 name='location-on' size={24} color={COLORS.red}/>
                              <Text numberOfLines={1}
                              style={{
                                 fontFamily: FONTS.roboto400,
                                 fontSize: FONT_SIZES.md,
                                 color: COLORS.labels,
                                 flexShrink: 1
                              }}>
                                 Sta. Mesa, Manila
                              </Text>
                           </View>
                        </View>

                        <TouchableOpacity
                        onPress={() => {}}
                        style={{
                           justifyContent: 'center',
                           alignItems: 'flex-end',
                           width: 48,
                        }}
                        >
                           <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                        </TouchableOpacity>
                     </View>

                     {/* ---- Date */}
                     <View
                     style={{
                        flexDirection: 'row',
                        padding: 18,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8
                     }}>
                        <Text numberOfLines={1}
                        style={{
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                           flexShrink: 1
                        }}>
                           Tomorrow
                        </Text>
                        <Text numberOfLines={1}
                        style={{
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                        }}>
                           10:30 AM
                        </Text>
                     </View>
                  </View>

                  {/* ---- Incoming Request(s) */}
                  <View
                  style={{
                     paddingHorizontal: 24,
                     gap: 12
                  }}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.primary,
                        textAlign: 'left'
                     }}>
                        Incoming Requests
                     </Text>

                     {incomingReqLoading ? (
                        <Animated.View
                        style={{
                           borderRadius: 20,
                           width: '100%',
                           backgroundColor: COLORS.strokes,
                           opacity: skeletonOpacity,
                           height: 160
                        }}
                        />

                     ) : (
                        <FlatList 
                        scrollEnabled={false}
                        data={incomingRequests}
                        renderItem={({item}) => (
                           <IncomingItem 
                           item={item}
                           left = {{
                              name: 'Reject',
                              function: () => handleReject(item.id)
                           }}
                           right = {{
                              name: 'Accept',
                              function: () => handleAccept(item.id)
                           }}
                           loading={buttonLoading}/>
                        )}
                        style={{
                           backgroundColor: '#fff',
                           borderRadius: 20
                        }}
                        contentContainerStyle={{
                           gap: 1
                        }}/>
                     )

                     }
                     


                  </View>
               </View>
               {/* Background */}
               <Image 
               source={require('../../../../assets/images/backgrounds/graphic-bg1.png')}
               style={{
                  width: '100%',
                  height: 224,
                  backgroundColor: COLORS.lightblue,
                  overflow: 'hidden',
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                  paddingHorizontal: 24,
                  position: 'absolute',
                  zIndex: 0,
                  elevation: 0,
                  objectFit: 'cover',
                  
               }} />
            </View>
         </ScrollView>
      </>
   )
}

const IncomingItem = ({item, left, right, loading}) => {

   return (
      <View 
      style={{
         width: '100%',
         backgroundColor: '#fff',
         padding: 24,
         gap: 12,
         borderBottomWidth: StyleSheet.hairlineWidth,
         borderColor: COLORS.lettersicons
      }}>
         {/* ------------------------------- Information ------------------------------ */}
         <View 
         style={[
            global.centerContainer, {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: 24,
         }]}>

            <Image 
            source={subServiceImages[item?.sub_services?.id]}
            style={{
               width: 70,
               height: '100%',
               borderRadius: 8,
               objectFit: 'cover',
               resizeMode: 'cover',
               backgroundColor: COLORS.strokes
            }}/>

            <View 
            style={{
               flex: 1,
               alignItems: 'flex-start',
               gap: 8,
            }}>
               {/* ---- Service Name */}
               <View 
               style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  gap: 8
               }}>
                  <View
                  style={[
                     global.tagContainer,
                     global.centerContainer, {
                     backgroundColor: '#F2F2F7',
                     flexShrink: 1,
                     padding: 4
                  }]}>
                     <Text
                     numberOfLines={1}
                     style={[
                        global.tagText,{
                        color: COLORS.primary,
                        flexShrink: 1
                     }]}>
                        {item?.services?.name}
                     </Text>
                  </View>

                  <Text
                  style={[{
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.lg,
                     letterSpacing: 0.2,
                     color: COLORS.accent
                  }]}>
                     {`\u20B1 ${item.price}`}
                  </Text>
               </View>

               {/* ---- SubService Name */}
               <Text
               numberOfLines={1}
               style={[{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.lg,
                  letterSpacing: 0.2,
                  color: COLORS.lettersicons,
                  flexShrink: 1
               }]}>
                  {item?.sub_services?.name}
               </Text>

               {/* ---- Location */}
               <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
               }}>
                  <Icons2 name="location-on" size={14} color={COLORS.red} />
                  <Text
                  numberOfLines={1}
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels,
                     flexShrink: 1
                  }}>
                     {`${item?.municipal}, ${item?.province}`}
                  </Text>
               </View>
            </View>
         </View>
         
         {/* --------------------------------- Buttons -------------------------------- */}
         {(left || right) &&
            <View style={{
            width: '100%',
            height: 32,
            flex: 3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12
         }}>
            <View style={{
               height: '100%',
               maxWidth: '33.33%',
               flex: 1,
            }}></View>

         {
            // ---- First Button (Upcoming / Completed)
            (left) &&
            <SmallButton 
            text={left.name}
            type='secondary'
            onPress={left.function}
            loading={loading}
            />
         }

         {
            // ---- Second Button
            (right) &&
            <SmallButton 
            text={right.name}
            type='primary'
            onPress={right.function}
            loading={loading}
            />
         }
            </View>
         }

      </View>
   )
}