import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Pressable, Image, ImageBackground, Modal, useWindowDimensions, Animated, Easing, RefreshControl } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEmergency } from '../../../../../context/EmergencyContext';
import axios from 'axios';
import { API_URL } from '../../../../../config';
import { useAuth } from '../../../../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '../../../../../components/dashboard/Header'
import BasicMultiline from '../../../../../components/authentication/BasicMultiline'
import MainButton from '../../../../../components/MainButton';
import ErrorModal from '../../../../../components/ErrorModal';
import {subServiceImages} from '../../../../../components/SubServiceMap'

import { globalStyles as global } from '../../../../../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants'
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons'
import Arrows from '@expo/vector-icons/Entypo';

const progressMap = [
   {
      icon: "calendar-check",
      name: "Booked",
   },
   {
      icon: "directions",
      name: "On The Way",
   },
   {
      icon: "tools",
      name: "Arrived",
   },
   {
      icon: "check-circle",
      name: "Finished",
   },
]

export default BookingDetails = () => {
   const {token} = useAuth();
   const insets = useSafeAreaInsets();
   const [showEmergency, setShowEmergency] = useState(false)
   const skeletonOpacity = useRef(new Animated.Value(0.5)).current;
   const router = useRouter();
   const {id, status} = useLocalSearchParams();

   const [detailsLoading, setDetailsLoading] = useState(true);
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

      if (detailsLoading) animLoop.start();
      
      return () => animLoop.stop();
   }, [detailsLoading])
   const [details, setDetails] = useState(null);

   const fetchDetails = async () => {
      try {
         setDetailsLoading(true);

         const result = await axios.get(`${API_URL}/user/book/${id}/fetch_booking`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         const status = result?.data?.status || "error"
         const message = result?.data?.message
         
         if(status === "success") {
            console.log('[DETAILS CLIENT]', result.data.data);
            setDetails(result.data.data);
            setTimeout(() => {
               setDetailsLoading(false);
            }, 1000)
         } else if (status === "failed" || status === "error") {
            throw new Error(message)
         }
      } catch (err) {
         
      }
   }

   useEffect(() => {
      fetchDetails();
   }, [])

   const handleEmergencyShow = () => {
      setShowEmergency(true);
   }

   const statusRender = (status) => {
      switch(status) {
         case 'completed': 
            return "Service has been completed"
         case 'ongoing': 
            return "Service Provider has arrived at the location"
         case 'upcoming':
            return "Service Provider is on the way"
         case 'booked':
            return "Appointment Booked"
         default: null
      }
   }

   const [noteModal, setNoteModal] = useState(false)

   const [confirmLoading, setConfirmLoading] = useState(false);
   const handleConfirm = async () => {
      try {
         setConfirmLoading(true)

         const result = await axios.put(`${API_URL}/user/book/${id}/mark_as_completed`, null, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         const status = result?.data?.status || "error";
         const message = result?.data?.message;

         if (status === "success") {
            console.log(result?.data);
            router.back();
         } else if (status === "failed" || status === "error") {
            throw new Error(message)
         }

      } catch (err) {
         const message = err?.message || "An unknown error has occured when trying to complete the booking"
         setErrorMessage(message);
         setErrorModal(true);

      } finally {
         setConfirmLoading(false);
      }  
   }

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState(null);

   const [refreshing, setRefreshing] = useState(false);
   const handleRefresh = async () => {
      setRefreshing(true);

      try {
        await Promise.all([
          fetchDetails(),
        ]);
      } catch (err) {
        console.log(err.message);
        router.back();
      } finally {
        setRefreshing(false);
      }
   }

   return (
      <>
         <EmergencyModal showModal={showEmergency} setShowModal={setShowEmergency} bookingId={id}/>
         <NoteModal visible={noteModal} setVisible={setNoteModal} note={details?.description}/>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Booking Completion Error"}
         message={errorMessage}
         />
         <View style={{flex: 1}}>
            <ScrollView 
            style={[global.screenContainer]}
            stickyHeaderIndices={[0]}
            refreshControl={
               <RefreshControl
               refreshing={refreshing}
               onRefresh={handleRefresh}
               tintColor={COLORS.accent}
               colors={[COLORS.accent]}
               />
            }>
               <Header 
                  left={
                     <TouchableOpacity onPress={() => router.back()}>
                        <Arrows name="chevron-left" size={24} color={COLORS.primary} />
                     </TouchableOpacity>
                  }
                  right={
                     (status === "Ongoing") ?
                     <TouchableOpacity onPress={handleEmergencyShow}>
                        <Icons name="alarm-light" size={24} color={COLORS.red} />
                     </TouchableOpacity> : null
                  }
                  title={
                     <Text style={[global.headingText, {color: COLORS.primary}]}> 
                     Booking Details
                     </Text>
                  }
                  titlePosition={(status === "Ongoing") ? "relative" : "absolute"}
               />
               <View style={[styles.content, {paddingBottom: insets.bottom}]}>

                  {/* ----------------------------- Booking Status ----------------------------- */}
                  <View style={[styles.boxContainer, ]}>
                     {/* ---- Header */}
                     <View style={{
                        backgroundColor: COLORS.primary,
                        width: '100%',
                        padding: 12,
                        gap: 12
                     }}>
                        {detailsLoading ? (
                           <Animated.View 
                           style={{
                           backgroundColor: COLORS.strokes,
                           borderRadius: 8,
                           width: '100%',
                           opacity: skeletonOpacity,
                           height: 25
                           }}/>
                        ) : (
                           <Text style={styles.headingStatus}
                           numberOfLines={1}>
                              {details && details.status === "Ongoing" ? 
                              "This appointment is Ongoing" : 
                              "This appointment is Upcoming"}
                           </Text>
                        )}
                        
                        {detailsLoading ? (
                           <Animated.View 
                           style={{
                           backgroundColor: COLORS.strokes,
                           borderRadius: 8,
                           width: '60%',
                           opacity: skeletonOpacity,
                           height: 15
                           }}/>
                        ) : (
                           <Text style={styles.descriptionStatus}
                           numberOfLines={2}>
                              {`Booking set on ${details.date} at ${details.time.slice(0, 5)}`}
                           </Text>
                        )}
                        
                     </View>
                     {/* ---- Simple Timeline */}
                     {/* <View style={[styles.progressHorizontal, {padding: 24}]}>
                        {progressMap.map((item, index) => (
                           <React.Fragment key={index}>
                              {index !== 0 && (
                                 <View 
                                 style={[
                                    styles.progressBarHorizontal, {
                                    backgroundColor: (statusActive[index]) ? COLORS.lightblue : COLORS.strokes,
                                    marginTop: 12
                                 }]}/>
                              )} 

                              <View 
                              style={{
                                 alignItems: 'center',
                                 gap: 8,
                                 width: 32,
                                 minHeight: 48, 
                                 position: 'relative',
                              }}>
                                 <Icons name={item.icon} size={24} color={(statusActive[index]) ? COLORS.primary : COLORS.lettersicons} />
                                 <View style={{position: 'absolute', bottom: 0, minWidth: 80}}>
                                    <Text style={[styles.progressTitle]}>
                                       {item.name}
                                    </Text>
                                 </View>
                                 
                              </View>
                           </React.Fragment>
                           
                        ))}
                     </View> */}
                     
                     {/* ---- Divider */}
                     {/* <View style={{paddingHorizontal: 12}}>
                        <View style={[global.divider]}/>
                     </View>

                     {/* ---- Detailed Timeline */}
                     {/* <Text style={[styles.boxHeading, {}]}>Booking Status</Text> */}

                     {/* <View style={styles.boxSection}>
                        <View style={styles.progressVertical}>
                           {bookingHistory.map((item, index) => (
                              <React.Fragment key={index}>
                                 {index !== 0 && (
                                    <View 
                                    style={[
                                       styles.progressBarVertical, {
                                       backgroundColor: COLORS.strokes,
                                       marginLeft: 4.5,
                                    }]}/>
                                 )} 

                                 <View 
                                 style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    position: 'relative',
                                    gap: 8,
                                    paddingRight: 12
                                    // backgroundColor: 'blue'
                                 }}>
                                    <View style={{
                                       height: 12, 
                                       aspectRatio: '1/1', 
                                       borderRadius: 6, 
                                       backgroundColor: (index === 0) ? COLORS.primary : COLORS.labels,
                                       marginTop: 2
                                    }}
                                    />
                                    <View style={{gap: 4}}>
                                       <Text 
                                       numberOfLines={1}
                                       style={{
                                          fontFamily: FONTS.roboto500,
                                          fontSize: FONT_SIZES.sm,
                                          color: (index === 0) ? COLORS.lettersicons : COLORS.labels,
                                          flexShrink: 1,
                                       }}>
                                          {statusRender(item.status)}
                                       </Text>
                                       <Text style={{
                                          fontFamily: FONTS.roboto400,
                                          fontSize: FONT_SIZES.xs,
                                          color: COLORS.labels
                                       }}>
                                          {`${item.date} | ${item.time}`}
                                       </Text>
                                    </View>
                                    
                                 </View>
                              </React.Fragment>
                           ))}
                        </View>
                     </View> */}
                     <View style={[styles.boxContainer, styles.boxSection]}>
                        <View style={{flexDirection: 'row', gap: 8,}}>
                           <Icons name="map-marker" size={24} color={COLORS.primary} />
                           <View style={{ flexShrink: 1, gap: 2}}>
                              <View style={{flexDirection: 'row', gap: 6,  flexWrap: 'wrap'}}>
                              {detailsLoading ? (
                                 <Animated.View 
                                 style={{
                                 backgroundColor: COLORS.strokes,
                                 borderRadius: 8,
                                 width: '80%',
                                 opacity: skeletonOpacity,
                                 height: 17
                                 }}/>
                              ) : (
                                 <>
                                    <Text style={styles.righText}>
                                    {details.user.name}
                                    </Text>
                                    <Text style={styles.leftText}>
                                    {`(${details.user.phone_number})`}
                                    </Text>
                                 </>
                              )}
                                 
                              </View>
                              {detailsLoading ? (
                                 <Animated.View 
                                 style={{
                                 backgroundColor: COLORS.strokes,
                                 borderRadius: 8,
                                 width: '100%',
                                 opacity: skeletonOpacity,
                                 height: 25
                                 }}/>
                              ) : (
                                 <Text 
                                 numberOfLines={2}
                                 style={{
                                    flexShrink: 1,
                                    flexWrap: 'wrap',
                                    fontFamily: FONTS.roboto400,
                                    fontSize: FONT_SIZES.xs,
                                    color: COLORS.labels
                                 }}>
                                    {details.user.full_address}
                                 </Text>
                              )}
                              
                           </View>
                        </View>
                     </View>
                  </View>

                  {/* --------------------------- Client Information --------------------------- */}
                  

                  {/* ----------------------------- Service Details ---------------------------- */}
                  <View style={styles.boxContainer}>
                     {/* ---- Service Information */}
                     <Text style={[styles.boxHeading, {}]}>Service</Text>
                     <View style={styles.boxSection}>
                        <View style={{flexDirection: 'row', gap: 8, width: '100%', height: 64}}>
                           <Image source={subServiceImages[details?.subServiceId]}
                           style={{
                              height: '100%',
                              width: 64,
                              aspectRatio: '1/1',
                              borderRadius: 8,
                              objectFit: 'cover'
                           }}/>

                           <View style={{gap: 4, flexGrow: 1}}>
                              {detailsLoading ? (
                                 <Animated.View 
                                 style={{
                                 backgroundColor: COLORS.strokes,
                                 borderRadius: 8,
                                 width: '100%',
                                 opacity: skeletonOpacity,
                                 height: 17
                                 }}/>
                              ) : (
                                 <Text style={[styles.righText]}>{details.serviceName}</Text>
                              )}
                              {detailsLoading ? (
                                 <Animated.View 
                                 style={{
                                 backgroundColor: COLORS.strokes,
                                 borderRadius: 8,
                                 width: '100%',
                                 opacity: skeletonOpacity,
                                 height: 17
                                 }}/>
                              ) : (
                                 <Text style={[styles.leftText, {fontFamily: FONTS.roboto400}]}>{details.serviceCategory}</Text>
                              )}
                           
                           </View>
                        </View>
                     </View>

                     {/* ---- Divider */}
                     <View style={{paddingHorizontal: 12}}>
                        <View style={[global.divider]}/>
                     </View>

                     {/* ---- Service Fee Details*/}
                     <View style={styles.boxSection}>
                        <View style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', alignItems: 'stretch'}}>
                           <Text style={styles.leftText}>Base Labor Fee</Text>
                           {detailsLoading ? (
                              <Animated.View 
                              style={{
                              backgroundColor: COLORS.strokes,
                              borderRadius: 8,
                              width: '10%',
                              opacity: skeletonOpacity,
                              height: '100%'
                              }}/>
                           ) : (
                              <Text style={styles.righText}>{`\u20b1 ${400}`}</Text>
                           )}
                           
                        </View>
                        {/* <View style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', alignItems: 'center'}}>
                           <Text style={styles.leftText}>Transportation Fee</Text>
                           <Text style={styles.righText}>{`\u20b1 ${100}`}</Text>
                        </View>
                        <View style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', alignItems: 'center'}}>
                           <Text style={styles.leftText}>Voucher</Text>
                           <Text style={styles.righText}>{`-\u20b1 ${25}`}</Text>
                        </View> */}
                     </View>

                     {/* ---- Divider */}
                     <View style={{paddingHorizontal: 12}}>
                        <View style={[global.divider]}/>
                     </View>

                     {/* ---- Total Fee*/}

                     <Pressable 
                     style={({pressed}) => [
                        styles.boxPressable, {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                        margin: 6
                        }
                     ]}>
                        <View 
                        style={{
                           flexDirection: 'row',
                           gap: 12,
                           width: '100%',
                           justifyContent: 'flex-end',
                           alignItems: 'center'
                        }}>
                           {detailsLoading ? (
                              <Animated.View 
                              style={{
                              backgroundColor: COLORS.strokes,
                              borderRadius: 8,
                              width: '10%',
                              opacity: skeletonOpacity,
                              height: 17 
                              }}/>
                           ) : (
                              <>
                                 <Text style={styles.leftText}>Total:</Text>
                                 <Text style={styles.righText}>{`\u20b1 ${400}`}</Text>
                              </>
                           )}
                           
                        </View>
                     </Pressable>
                  </View>
                  
                  {/* ------------------------- Worker Details and Note ------------------------ */}
                  <View style={styles.boxContainer}>
                     {/* ---- Worker Details */}
                     <Text style={[styles.boxHeading]}>Service Provider</Text>
                     <Pressable 
                     style={({pressed}) => [
                        styles.boxPressable, {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                        marginBottom: 0
                     }]}
                     // onPress={() => router.push('client-dashboard/worker-details/[id]')}
                     >
                        <View style={[styles.left, {}]}>
                           <ImageBackground
                           src={details?.worker?.profilePhoto}
                           style={{
                              aspectRatio: '1/1',
                              height: 82,
                              width: 82,
                              position: 'relative',
                              justifyContent: 'flex-end',
                              alignItems: 'flex-end'
                           }}
                           imageStyle={{
                              borderRadius: 41
                           }}>
                              <View style={{
                                 backgroundColor: '#fff',
                                 borderRadius: 12
                              }}>
                                 <Icons name="check-decagram" size={24} color={COLORS.primary} />
                              </View>
                              
                           </ImageBackground>
                           <View style={{flex: 1}}>
                              <View style={{gap: 6, flexShrink: 1}}>
                              {detailsLoading ? (
                                 <Animated.View 
                                 style={{
                                 backgroundColor: COLORS.strokes,
                                 borderRadius: 8,
                                 width: '100%',
                                 opacity: skeletonOpacity,
                                 height: 17
                                 }}/>
                              ) : (
                                 <Text numberOfLines={1}
                                 style={{
                                    flexShrink: 1,
                                    flexWrap: 'wrap',
                                    fontFamily: FONTS.roboto600,
                                    fontSize: FONT_SIZES.md,
                                    color: COLORS.primary
                                 }}>
                                    {details.worker.name}
                                 </Text>
                              )}
                              {detailsLoading ? (
                                 <Animated.View 
                                 style={{
                                 backgroundColor: COLORS.strokes,
                                 borderRadius: 8,
                                 width: '100%',
                                 opacity: skeletonOpacity,
                                 height: 15
                                 }}/>
                              ) : (
                                 <Text numberOfLines={1}
                                 style={{
                                    flexShrink: 1,
                                    flexWrap: 'wrap',
                                    fontFamily: FONTS.roboto400,
                                    fontSize: FONT_SIZES.sm,
                                    color: COLORS.labels
                                 }}>
                                    {"Freelancer"}
                                 </Text>
                              )}
                              {detailsLoading ? (
                                 <Animated.View 
                                 style={{
                                 backgroundColor: COLORS.strokes,
                                 borderRadius: 8,
                                 width: '100%',
                                 opacity: skeletonOpacity,
                                 height: 29
                                 }}/>
                              ) : (
                                 <Text numberOfLines={2}
                                 style={{
                                    flexShrink: 1,
                                    flexWrap: 'wrap',
                                    fontFamily: FONTS.roboto400,
                                    fontSize: FONT_SIZES.sm,
                                    color: COLORS.lettersicons
                                 }}>
                                    {details.worker.address}
                                 </Text>
                              )}  
                              </View>
                           
                           </View>
                        </View>
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>
                     {/* ---- Note */}
                     <Pressable 
                     onPress={(details?.description) ? () => setNoteModal(true) : undefined}
                     style={({pressed}) => [
                        styles.boxPressable, {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                        marginTop: 0,
                     }]}>
                        <Text style={styles.leftText}>Note</Text>
                        <View style={styles.right}>
                           {detailsLoading ? (
                              <Animated.View 
                              style={{
                              backgroundColor: COLORS.strokes,
                              borderRadius: 8,
                              width: '80%',
                              opacity: skeletonOpacity,
                              height: 24
                              }}/>
                           ) : (
                              <Text numberOfLines={1} style={{
                                 flexShrink: 1,
                                 flexWrap: 'wrap',
                                 fontFamily: FONTS.roboto400,
                                 fontSize: FONT_SIZES.sm,
                                 color: details?.description ? COLORS.lettersicons : COLORS.strokes,
                                 textAlign: 'right',
                                 width: '80%'
                              }}>
                                 {details?.description || '[Empty]'}
                              </Text>
                           )}
                           
                           <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                        </View>
                           
                     </Pressable>
                     
                  </View>

                  {/* ----------------------------- Service Support ---------------------------- */}
                  <View style={styles.boxContainer}>
                     <Text style={[styles.boxHeading]}>Service Support</Text>

                     <Pressable 
                     style={({pressed}) => [
                        styles.boxPressable, {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                        marginBottom: 0
                     }]}
                     >
                        <View style={styles.left}>
                           <Icons2 name='chat' size={24} color={COLORS.primary}/>
                           <Text style={[styles.righText, {fontFamily: FONTS.roboto400}]}>Message Service Provider</Text>
                        </View>
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>

                     <Pressable 
                     style={({pressed}) => [
                        styles.boxPressable, {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                        marginTop: 0
                     }]}
                     >
                        <View style={styles.left}>
                           <Icons name='help-circle' size={24} color={COLORS.primary}/>
                           <Text style={[styles.righText, {fontFamily: FONTS.roboto400}]}>FAQs</Text>
                        </View>
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>
                  </View>

                  {/* -------------------------- More Booking Details -------------------------- */}
                  <View style={styles.boxContainer}>
                     <Text style={[styles.boxHeading]}>Booking ID</Text>

                     <View style={[styles.boxSection, {flexDirection: 'row', alignItems: 'stretch'}]}>
                        <View style={styles.left}>
                           <Icons name='cash-multiple' size={24} color={COLORS.primary}/>
                           <Text style={[styles.righText, {fontFamily: FONTS.roboto400}]}>Pay By</Text>
                        </View>
                        {detailsLoading ? (
                           <Animated.View
                           style={{
                              backgroundColor: COLORS.strokes,
                              opacity: skeletonOpacity,
                              borderRadius: 8,
                              height: '100%',
                              width: '20%'
                           }}
                           />
                        ) : (
                           <Text style={[styles.righText, {fontFamily: FONTS.roboto400}]}>{details.payment_method}</Text>
                        )
                        }
                        
                     </View>

                     <Pressable 
                     style={({pressed}) => [
                        styles.boxPressable, {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                        marginTop: 0
                     }]}
                     onPress={() => router.push({
                        pathname: 'client-dashboard/e-receipt/[id]',
                        params: {id: details?.id}
                     })}>
                        <View style={styles.left}>
                           <Icons name='file-document' size={24} color={COLORS.primary}/>
                           <Text style={[styles.righText, {fontFamily: FONTS.roboto400}]}>E-Receipt</Text>
                        </View>
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>
                  </View>

               </View>

            </ScrollView>

            {status === "Ongoing" && details?.worker_status === "Completed" &&
               <View style={[global.buttonsContainer, {paddingBottom: insets.bottom, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24}]} >
               <MainButton 
               text="Confirm Completion"
               type="primary"
               onPress={handleConfirm}
               loading={confirmLoading}
               />
            </View>}
         </View>
      </>
   )
}

const EmergencyModal = ({showModal, setShowModal, bookingId}) => {
   const router = useRouter();
   const {clearEmergency, emergencyInfo, setEmergencyInfo} = useEmergency();

   const {width, height} = useWindowDimensions()

   const handleCloseModal = () => {
      clearEmergency();
      setShowModal(false);
   }

   const goToEmergencyScreen = () => {
      setShowModal(false);
      router.push({
         pathname: 'client-dashboard/booking-actions/details/emergency/[id]',
         params: {id: bookingId}
      });
   }

   return (
      <Modal 
      animationType='slide'
      visible={showModal}
      backdropColor={'rgba(0, 0, 0, 0.2)'}
      statusBarTranslucent={true}
      > 
         <KeyboardAvoidingView 
         behavior='padding'
         keyboardVerticalOffset={0}
         style={{
            width: width,
            height: height,
            position: 'relative'
         }}>
            <Pressable 
            style={{flex: 1}}
            onPress={handleCloseModal}
            />
            <View style={global.bottomModal}>
               <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                  <Icons name="alarm-light" size={32} color={COLORS.red} /> 
                  <Text style={{
                     fontFamily: FONTS.roboto600,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.red,
                     textAlign: 'left',
                  }}>
                     Service Not Going Well?
                  </Text>
               </View>
               
               <View style={global.divider}/>

               <Text style={{
                  textAlign: 'center',
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.lettersicons
               }}>
                  Tap report to notify admin and emergency contacts.
               </Text>

               <BasicMultiline 
                  placeholder = "I feel uncomfortable during service. Please send help immediately"
                  onChangeText = {(e) => {
                     setEmergencyInfo(prev => ({
                        ...prev,
                        message: e
                     }))
                  }}
                  value = {emergencyInfo}
                  numberOfLines = {5}
                  height = {56}
               />

               <MainButton 
               text="Report"
               type="primary"
               onPress={goToEmergencyScreen}
               />
            </View>
         </KeyboardAvoidingView>  

      </Modal>
   )
}

const NoteModal = ({visible, setVisible, note}) => {
   return (
     <Modal
     visible={visible}
     statusBarTranslucent={true}
     backdropColor={COLORS.modalbg}>
       <View style={{flex: 1, position: 'relative', alignItems: 'center', justifyContent: 'center'}}>
 
         <Pressable
         style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
         onPress={() => setVisible(false)}
         />
 
         <View style={global.centerModal}>
           <Text style={{
             fontFamily: FONTS.roboto700,
             fontSize: FONT_SIZES.md,
             color: COLORS.primary,
             textAlign: 'center',
           }}>
             Appointment Note
           </Text>
 
           <View style={global.divider}/>
 
           <Text style={{
             fontFamily: FONTS.roboto400,
             fontSize: FONT_SIZES.sm,
             color: COLORS.lettersicons,
             textAlign: 'center'
           }}>{note}</Text>
 
           <MainButton 
           text="Close"
           type="secondary"
           onPress={() => setVisible(false)}/>
         </View>
 
       </View>
     </Modal>
   )
 }

const styles = StyleSheet.create({
   content: {
      paddingVertical: 24,
      paddingHorizontal: 12,
      gap: 12
   },
   boxContainer: {
      width: '100%',
      borderRadius: 12,
      backgroundColor: '#fff',
      overflow: 'hidden'
   },
   headingStatus: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.xl,
      color: '#fff',
      flexShrink: 1
   },
   descriptionStatus: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: '#fff',
      flexShrink: 1
   },
   boxHeading: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.labels,
      padding: 0,
      // backgroundColor: 'green',
      paddingTop: 12,
      paddingLeft: 12
   },
   boxSection: {
      padding: 12,
      gap: 12
   },
   boxPressable: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      padding: 6,
      margin: 6
   },
   progressHorizontal: {
      flexDirection: 'row',
      // minHeight: 64, 
      maxWidth: '100%',
      justifyContent: 'center',
      alignItems: 'flex-start',
      // backgroundColor: 'blue'
   },
   progressVertical: {
      maxWidth: '100%',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 4
      // backgroundColor: 'blue'
   },
   progressBarHorizontal: {
      flex: 1,
      // width: 10,
      height: 1.5,
      borderRadius: 0.75,
      backgroundColor: COLORS.strokes,
      alignItems: 'flex-start'
   },
   progressBarVertical: {
      height: 24,
      // width: 10,
      width: 1.5,
      borderRadius: 0.75,
      backgroundColor: COLORS.strokes,
      alignItems: 'flex-start',
      marginTop: -16,
   },
   progressTitle: {
      textAlign: 'center',
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
   },
   left: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8,
      // backgroundColor: 'red',
      height: '100%',
      flexGrow: 1,
      flexShrink: 1
   },
   right: {
   flexDirection: 'row',
   justifyContent: 'flex-end',
   alignItems: 'center',
   gap: 4,
   // backgroundColor: 'blue',
   height: '100%',
   flexGrow: 1,
   flexShrink: 1
   },
   leftText: {
   fontFamily: FONTS.roboto600,
   fontSize: FONT_SIZES.md,
   color: COLORS.labels
   },
   righText: {
   fontFamily: FONTS.roboto600,
   fontSize: FONT_SIZES.md,
   color: COLORS.lettersicons
   },

})