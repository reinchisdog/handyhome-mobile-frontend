import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, Pressable, Image, ImageBackground, Modal, useWindowDimensions, TouchableWithoutFeedback, TouchableHighlight, Platform } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEmergency } from '../../../../../context/EmergencyContext'

import Header from '../../../../../components/dashboard/Header'
import BasicMultiline from '../../../../../components/authentication/BasicMultiline'
import MainButton from '../../../../../components/MainButton';

import { globalStyles as global } from '../../../../../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants'
import Arrow from '@expo/vector-icons/AntDesign';
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

const bookingHistory = [
   {
      status: "completed",
      date: "April 26",
      time: "8 AM"
   },
   {
      status: "ongoing",
      date: "April 26",
      time: "8 AM"
   },
   {
      status: "upcoming",
      date: "April 26",
      time: "8 AM"
   },
   {
      status: "booked",
      date: "April 26",
      time: "8 AM"
   },
]

export default BookingDetails = () => {
   const [showEmergency, setShowEmergency] = useState(false)

   const router = useRouter();
   const {id, status} = useLocalSearchParams();

   const [statusActive, setStatusActive] = useState([])
   useEffect(() => {
      progressMap.map((element, index) => {
         // Change Logic Later
         setStatusActive(prev => [...prev, (index < 3)? true : false]) 
      });
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

   return (
      <>
         <EmergencyModal showModal={showEmergency} setShowModal={setShowEmergency} bookingId={id}/>

         <ScrollView 
         style={global.screenContainer}
         stickyHeaderIndices={[0]}>
            <Header 
               left={
                  <TouchableOpacity onPress={() => router.back()}>
                     <Arrow name="left" size={24} color={COLORS.primary} />
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
            <View style={styles.content}>
               {/* ----------------------------- Booking Status ----------------------------- */}
               <View style={[styles.boxContainer]}>
                  {/* ---- Header */}
                  <View style={{
                     backgroundColor: COLORS.primary,
                     width: '100%',
                     padding: 12,
                     gap: 12
                  }}>
                     <Text style={styles.headingStatus}
                     numberOfLines={1}>
                        {"Your Service Provider is on the way"}
                     </Text>

                     <Text style={styles.descriptionStatus}
                     numberOfLines={2}>
                        {"Booking set on April 28, 2025 at 10 AM"}
                     </Text>
                  </View>
                  {/* ---- Simple Timeline */}
                  <View style={[styles.progressHorizontal, {padding: 24}]}>
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
                  </View>
                  
                  {/* ---- Divider */}
                  <View style={{paddingHorizontal: 12}}>
                     <View style={[global.divider]}/>
                  </View>

                  {/* ---- Detailed Timeline */}
                  <Text style={[styles.boxHeading, {}]}>Booking Status</Text>
                  <View style={styles.boxSection}>
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
                  </View>
                  
                  
               </View>

               {/* --------------------------- Client Information --------------------------- */}
               <View style={[styles.boxContainer, styles.boxSection]}>
                  <View style={{flexDirection: 'row', gap: 8}}>
                     <Icons name="map-marker" size={24} color={COLORS.primary} />
                     <View style={{ flexShrink: 1, gap: 2}}>
                        <View style={{flexDirection: 'row', gap: 6}}>
                           <Text style={styles.righText}>
                           {"John Doe"}
                           </Text>
                           <Text style={styles.leftText}>
                           {`(${"09123456789"})`}
                           </Text>
                        </View>
                        <Text 
                        numberOfLines={2}
                        style={{
                           flexShrink: 1,
                           flexWrap: 'wrap',
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.xs,
                           color: COLORS.labels
                        }}
                        >
                           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam nihil, vel quisquam eveniet eaque quae adipisci molestias quia ab repudiandae numquam, possimus accusantium quo ipsum in. Explicabo vitae tempora minus?
                        </Text>
                     </View>
                  </View>
               </View>

               {/* ----------------------------- Service Details ---------------------------- */}
               <View style={styles.boxContainer}>
                  {/* ---- Service Information */}
                  <Text style={[styles.boxHeading, {}]}>Service</Text>
                  <View style={styles.boxSection}>
                     <View style={{flexDirection: 'row', gap: 8, width: '100%', height: 64}}>
                        <Image source={require('../../../../../assets/placeholder-base.png')}
                        style={{
                           height: '100%',
                           width: 64,
                           aspectRatio: '1/1',
                           borderRadius: 8,
                           objectFit: 'cover'
                        }}/>

                        <View style={{gap: 4}}>
                           <Text style={[styles.righText]}>{"Leak Repair"}</Text>
                           <Text style={[styles.leftText, {fontFamily: FONTS.roboto400}]}>{"Plumbing"}</Text>
                        </View>
                     </View>
                  </View>

                  {/* ---- Divider */}
                  <View style={{paddingHorizontal: 12}}>
                     <View style={[global.divider]}/>
                  </View>

                  {/* ---- Service Fee Details*/}
                  <View style={styles.boxSection}>
                     <View style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.leftText}>Base Labor Fee</Text>
                        <Text style={styles.righText}>{`\u20b1 ${400}`}</Text>
                     </View>
                     <View style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.leftText}>Transportation Fee</Text>
                        <Text style={styles.righText}>{`\u20b1 ${100}`}</Text>
                     </View>
                     <View style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.leftText}>Voucher</Text>
                        <Text style={styles.righText}>{`-\u20b1 ${25}`}</Text>
                     </View>
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
                        <Text style={styles.leftText}>Total:</Text>
                        <Text style={styles.righText}>{`\u20b1 ${400}`}</Text>
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
                  onPress={() => router.push('client-dashboard/worker-details/[id]')}
                  >
                     <View style={[styles.left, {}]}>
                        <ImageBackground
                           source={require('../../../../../assets/placeholder-base.png')}
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
                           }}
                        >
                           <View style={{
                              backgroundColor: '#fff',
                              borderRadius: 12
                           }}>
                              <Icons name="check-decagram" size={24} color={COLORS.primary} />
                           </View>
                           
                        </ImageBackground>
                        <View style={{gap: 6, flexShrink: 1}}>
                           <Text numberOfLines={1}
                           style={{
                              flexShrink: 1,
                              flexWrap: 'wrap',
                              fontFamily: FONTS.roboto600,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.primary
                           }}
                           >
                              {"Worker's Name"}
                           </Text>
                           <Text numberOfLines={1}
                           style={{
                              flexShrink: 1,
                              flexWrap: 'wrap',
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.labels
                           }}>
                              {"Affiliations"}
                           </Text>
                           <Text numberOfLines={1}
                           style={{
                              flexShrink: 1,
                              flexWrap: 'wrap',
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.lettersicons
                           }}>
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos quis voluptatibus, ad dolorem, beatae error maxime, eaque vitae libero quas expedita atque nostrum maiores perspiciatis voluptate aut voluptas laboriosam aliquam?
                           </Text>
                        </View>
                     </View>
                     <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                  </Pressable>
                  {/* ---- Note */}
                  <Pressable 
                     style={({pressed}) => [
                        styles.boxPressable, {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                        marginTop: 0,
                     }]}
                     >
                        <Text style={styles.leftText}>Note</Text>
                        <View style={styles.right}>
                        <Text numberOfLines={1} style={{
                           flexShrink: 1,
                           flexWrap: 'wrap',
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.lettersicons,
                           textAlign: 'right',
                           width: '80%'
                        }}>
                           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero fugiat id dolores! Adipisci debitis dignissimos numquam aperiam, quod et esse autem provident eius! Nulla, assumenda culpa reiciendis molestiae corrupti dolorum?
                        </Text>
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

                  <View style={[styles.boxSection, {flexDirection: 'row'}]}>
                     <View style={styles.left}>
                        <Icons name='cash-multiple' size={24} color={COLORS.primary}/>
                        <Text style={[styles.righText, {fontFamily: FONTS.roboto400}]}>Pay By</Text>
                     </View>
                     <Text style={[styles.righText, {fontFamily: FONTS.roboto400}]}>{"Cash"}</Text>
                  </View>

                  <Pressable 
                  style={({pressed}) => [
                     styles.boxPressable, {
                     backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                     marginTop: 0
                  }]}
                  onPress={() => router.push('client-dashboard/e-receipt/[id]')}
                  >
                     <View style={styles.left}>
                        <Icons name='file-document' size={24} color={COLORS.primary}/>
                        <Text style={[styles.righText, {fontFamily: FONTS.roboto400}]}>E-Receipt</Text>
                     </View>
                     <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                  </Pressable>
               </View>

            </View>

         </ScrollView>
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