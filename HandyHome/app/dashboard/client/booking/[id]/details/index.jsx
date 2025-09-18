// Screen: Booking Details

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Pressable, ImageBackground, Animated, useWindowDimensions, Modal, StatusBar } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
// ---- Other Components
import Header from '../../../../../../components/Header';
import Multiline from '../../../../../../components/Multiline';
import MainButton from '../../../../../../components/MainButton';
import {ServiceCategoryImages} from '../../../../../../components/ServiceCategoryMap'
// Styles and Icons
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/Entypo';
// Other Libraries
import api from '../../../../../../lib/api';
// import { useAuth } from '../../../../../../context/AuthContext';
import { useBookingDetails } from '../../../../../../context/BookingDetailsContext';

const BookingDetails = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const { width, height } = useWindowDimensions();
   const { id, status } = useLocalSearchParams();
   const { details, detailsLoading, fetchDetails, fetchWorker, emergency, setEmergency, clearEmergency, handleComplete, completeLoading } = useBookingDetails();

   const [descriptionModal, setDescriptionModal] = useState(false);
   const [emergencyModal, setEmergencyModal] = useState(false);

   // Renders
   const renderHeaderText = () => {
      switch (status) {
         case 'upcoming': return "Get ready! Your appointment is coming up.";
         case 'ongoing': return "Service is underway.";
         case 'completed': return "All done! Don't forget to rate your experience.";
         default: return null
      }
   }
   
   const renderSubHeaderText = () => {
      switch (status) {
         case 'upcoming':
            return `Scheduled for ${details?.date} at ${details?.time}.`;
         case 'ongoing':
            return `Need help? Contact us anytime by using the Emergency Button.`;
         case 'completed':
            return `Leaving a review helps us improve our services.`;
         default:
            return '';
      }
   }

   // Animation
   const scrollY = useRef(new Animated.Value(0)).current;
   const scrollViewRef = useRef(null);
   const qrWidth = useRef(new Animated.Value(60)).current;

   const handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      {
         useNativeDriver: false,
         listener: (event) => {
            const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
            const scrollPosition = contentOffset.y;
            const scrollViewHeight = layoutMeasurement.height;
            const contentHeight = contentSize.height;

            const isNearButton = scrollPosition + scrollViewHeight >= contentHeight;

            if (isNearButton) {
               Animated.spring(qrWidth, {
                  toValue: width - 24,
                  useNativeDriver: false,
                  tension: 24,
                  // friction: 24
               }).start();
            } else {
               Animated.spring(qrWidth, {
                  toValue: 60,
                  useNativeDriver: false,
                  tension: 24,
                  friction: 6
               }).start();
            }
         }
      }
   )

   const buttonY = useRef(new Animated.Value(0)).current;
   const buttonTranslate = buttonY.interpolate({
      inputRange: [0, 1],
      outputRange: [insets.bottom + 100 , 0],
      extrapolate: 'clamp'
   })

   const buttonAppear = () => {
      Animated.timing(buttonY, {
         toValue: 1,
         duration: 300,
         useNativeDriver: true
      }).start();
   }

   // Effects
   useEffect(() => {
      if (!id) return;

      fetchDetails(id, 'user');
   }, [id])

   useEffect(() => {
      if (!details || !details?.worker?.id) return;

      fetchWorker(details?.worker?.id)
      buttonAppear();
   }, [details])

   return (
      <>
         {/* Note Modal */}
         <Modal
         visible={descriptionModal}
         statusBarTranslucent={true}
         animationType='slide'
         backdropColor={COLORS.modalbg}
         onRequestClose={() => setDescriptionModal(false)}
         style={{flex: 1}}
         >
            <View
            style={{
               paddingBottom: insets.bottom + 24,
               paddingHorizontal: 24,
               maxHeight: height - StatusBar.currentHeight - 24,
               width: width,
               borderRadius: 20,
               backgroundColor: '#fff',
               position: 'absolute',
               bottom: 0,
               zIndex: 2
            }}>
               <Text
               style={{
                  padding: 24,
                  textAlign: 'center',
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.primary
               }}>
                  Service Description
               </Text>
   
               <View style={global.divider}/>

               <ScrollView 
               style={{flexShrink: 1, width: '100%'}} 
               contentContainerStyle={{flexGrow: 1, paddingVertical: 24, gap: 12}}
               >
                  {details?.attachment &&
                     <View 
                     style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        width: '100%'
                     }}>
                        <Image 
                        source={{uri: details?.attachment}}
                        style={{
                           width: '100%',
                           height: undefined,
                           aspectRatio: 1/1,
                        }}
                        resizeMode='cover'
                        />
                     </View>
                  }
                  
                  <View
                  style={{
                     borderRadius: 12,
                     padding: 12,
                     borderWidth: 1.5,
                     borderColor: COLORS.strokes,
                     backgroundColor: COLORS.secondary
                  }}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        textAlign: 'justify'
                     }}>
                        {details?.description}
                     </Text>
                  </View>
               </ScrollView>
            
               <MainButton 
               text={'Close'}
               type='secondary'
               onPress={() => setDescriptionModal(false)}
               />

            </View>
         </Modal>
         
         {/* Emergency Modal */}
         <Modal
         visible={emergencyModal}
         statusBarTranslucent={true}
         animationType='slide'
         backdropColor={COLORS.modalbg}
         onRequestClose={() => setEmergencyModal(false)}
         style={{flex: 1}}
         >
            <KeyboardAvoidingView
            behavior='padding'
            // keyboardVerticalOffset={12}
            style={{
               width: '100%',
               height: '100%',
               position: 'relative'
            }}>
               <Pressable
               onPress={() => {
                  clearEmergency();
                  setEmergencyModal(false);
               }}
               style={{flex: 1}}>
                  <View
                  style={{
                     paddingBottom: insets.bottom + 24,
                     paddingHorizontal: 24,
                     maxHeight: height - StatusBar.currentHeight - 24,
                     width: width,
                     borderTopRightRadius: 20,
                     borderTopLeftRadius: 20,
                     backgroundColor: '#fff',
                     position: 'absolute',
                     bottom: 0,
                     zIndex: 2,
                     gap: 24
                  }}>
                     <View 
                     style={{
                        flexDirection: 'row',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 8,
                        padding: 24,
                        paddingBottom: 0
                     }}>
                        <Icons1 name="alarm-light" size={24} color={COLORS.red} /> 
                        <Text style={{
                           fontFamily: FONTS.roboto700,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.red,
                           textAlign: 'left',
                        }}>
                           Service Not Going Well?
                        </Text>
                     </View>

                     <View style={global.divider}/>

                     <Multiline 
                     placeholder='I feel uncomfortable during service. Please send help immediately'
                     value={emergency}
                     onChangeText={(e) => {
                        setEmergency(prev => ({
                           ...prev,
                           message: e
                        }))
                     }}
                     numberOfLines={5}
                     />

                     <MainButton 
                     text={"Report"}
                     type="alert"
                     onPress={() => {
                        router.push(`/dashboard/client/booking/${id}/details/emergency`);
                        setEmergencyModal(false);
                     }}
                     />
                  </View>
               </Pressable>

            </KeyboardAvoidingView>
         </Modal>

         <View 
         style={[
            global.screenContainer, {
            backgroundColor: COLORS.screenbg, 
            position: 'relative'
         }]}>
            <Header 
            hasBack
            title='Booking Details'
            backgroundColor='#fff'
            rightIcon={status === 'ongoing' && (
               <TouchableOpacity onPress={() => {setEmergencyModal(true)}}>
                  <Icons1 name='alarm-light' size={24} color={COLORS.red}/>
               </TouchableOpacity>
            )}/>

            <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            style={[global.screenContainer]}
            contentContainerStyle={{
               paddingHorizontal: 12,
               paddingTop: 24,
               paddingBottom: insets.bottom + 36 + 60,
               gap: 12
            }}>

               {/* ---- Status and Address */}
               <View style={[styles.container]}>
                  {/* ---- Status */}
                  <View style={[styles.sectionView, {backgroundColor: COLORS.primary}]}>
                     <Text style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.lg,
                        color: '#fff'
                     }}>
                        {renderHeaderText()}
                     </Text>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: '#fff'
                     }}>
                        {renderSubHeaderText()}
                     </Text>
                  </View>
                  {/* ---- Address */}
                  <View style={[styles.sectionView, {flexDirection: 'row'}]}>
                     <Icons1 name='map-marker' size={24} color={COLORS.primary}/>
                     <View style={{flexShrink: 1, gap: 4}}>
                        <Text
                           style={{
                              fontFamily: FONTS.roboto700,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.lettersicons
                           }}>
                              {details?.user?.name} <Text style={{
                                 fontFamily: FONTS.roboto400,
                                 color: COLORS.labels
                              }}>
                                 {`(${details?.user?.phone_number.replace('+63', '0')})`}
                              </Text>
                           </Text>

                           <Text
                           style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.labels,
                              // flexShrink: 1
                           }}>
                              {details?.user?.full_address}
                           </Text>
                     </View>
                  </View>
               </View>

               {/* ---- Service */}
               <View style={[styles.container]}>
                  {/* ---- Details */}
                  <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                     Service
                  </Text>
                  <View style={[styles.sectionView, {flexDirection: 'row', gap: 12}]}>
                     <Image 
                     source={ServiceCategoryImages[details?.subServiceId]}
                     style={{
                        borderRadius: 8,
                        width: 64,
                        height: 64
                     }}/>
                     <View style={{flex: 1}}>
                        <Text style={{
                           fontFamily: FONTS.roboto600,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.primary
                        }}>
                           {details?.serviceCategory}
                        </Text>
                        <Text style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.labels
                        }}>
                           {details?.serviceName}
                        </Text>
                     </View>
                  </View>

                  {/* ---- Instructions */}
                  <Text style={[styles.sectionTitle, {paddingHorizontal: 12, paddingBottom: 0}]}>
                     Instructions
                  </Text>
                  <View style={[styles.sectionPressable]}>
                     <Pressable 
                     onPress={() => {setDescriptionModal(true)}}
                     style={({pressed}) => [
                        styles.sectionPressable, {
                           flexDirection: 'row', 
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           gap: 12,
                           backgroundColor: pressed ? COLORS.summaryPress : 'transparent'
                     }]}>
                        {details?.attachment &&
                           <Image 
                           source={{uri: details?.attachment}}
                           style={{
                              borderRadius: 8,
                              width: 64,
                              height: 64
                           }}/>
                        }
                        <Text
                        numberOfLines={3}
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.lettersicons,
                           flexShrink: 1,
                           textAlign: 'justify'
                        }}>   
                           {details?.description}
                        </Text>
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>
                     
                  </View>
                  
                  <View style={[{paddingHorizontal: 12}]}>
                     <View style={[global.divider]}/>
                  </View>
                  
                  {/* ---- Price */}
                  <Text style={[styles.sectionView, styles.sectionTitle, {textAlign: 'right'}]}>
                     Total: <Text style={{color: COLORS.lettersicons}}>
                        {`\u20B1 ${details?.price}`}
                     </Text>
                  </Text>
                  
               </View>

               {/* ---- Worker */}
               <View style={[styles.container]}>
                  <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                     Service Provider
                  </Text>
                  <View style={[styles.sectionPressable]}>
                     <Pressable 
                     onPress={() => {router.push(`/dashboard/client/booking/${id}/details/worker`)}}
                     style={({pressed}) => [
                        styles.sectionPressable, {
                           flexDirection: 'row', 
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           gap: 12,
                           backgroundColor: pressed ? COLORS.summaryPress : 'transparent'
                     }]}>
                        <ImageBackground 
                        source={{uri: details?.worker?.profilePhoto}}
                        style={{
                           width: 64,
                           height: 64,
                           justifyContent: 'flex-end',
                           alignItems: 'flex-end'
                        }}
                        imageStyle={{
                           borderRadius: 32
                        }}> 
                           <View style={{
                              backgroundColor: '#fff',
                              padding: 1,
                              borderRadius: '50%'
                           }}>
                              <Icons1 name='check-decagram' size={22} color={COLORS.primary}/>
                           </View>
                        </ImageBackground>

                        <View style={{flex: 1}}>
                           <Text 
                           numberOfLines={1}
                           style={{
                              fontFamily: FONTS.roboto600,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.primary,
                              flexShrink: 1
                           }}>
                              {details?.worker?.name}
                           </Text>
                           <Text 
                           numberOfLines={1}
                           style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.labels,
                              flexShrink: 1
                           }}>
                              {'Freelancer'}
                           </Text>
                           <View style={{
                              marginTop: 4,
                              flexDirection: 'row', 
                              alignItems: 'center', 
                              gap: 4,
                              flexShrink: 1,
                              paddingRight: 12
                           }}>
                              <Icons1 name='map-marker' size={14} color={COLORS.lettersicons}/>
                              <Text
                              numberOfLines={1}
                              style={{
                                 fontFamily: FONTS.roboto400,
                                 fontSize: FONT_SIZES.sm,
                                 color: COLORS.lettersicons,
                              }}>
                                 {details?.worker?.address}
                              </Text>
                           </View>
                           
                        </View>

                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>
                     
                  </View>
               </View>

               {/* ---- Service Support */}
               <View style={[styles.container]}>
                  <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                     Service Support
                  </Text>
                  <View style={styles.sectionPressable}>
                     {/* ---- Chat Message */}
                     <Pressable 
                     onPress={() => {}}
                     style={({pressed}) => [
                        styles.sectionPressable, {
                           flexDirection: 'row', 
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           gap: 12,
                           backgroundColor: pressed ? COLORS.summaryPress : 'transparent'
                     }]}>
                        <Icons2 name='chat' size={24} color={COLORS.primary}/>
                        <Text style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                           flex: 1
                        }}>
                           Message Service Provider
                        </Text>
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>
                     {/* ---- FAQs */}
                     <Pressable 
                     onPress={() => {}}
                     style={({pressed}) => [
                        styles.sectionPressable, {
                           flexDirection: 'row', 
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           gap: 12,
                           backgroundColor: pressed ? COLORS.summaryPress : 'transparent'
                     }]}>
                        <Icons1 name='help-circle' size={24} color={COLORS.primary}/>
                        <Text style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                           flex: 1
                        }}>
                           FAQs
                        </Text>
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>
                  </View>
               </View>

               {/* ---- Other Details */}
               <View style={[styles.container]}>
                  <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                     More Service Details
                  </Text>
                  <View style={styles.sectionView}>
                     {/* ---- Payment Method */}
                     <View 
                     style={[
                        styles.sectionPressable, {
                           flexDirection: 'row', 
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           gap: 12,
                     }]}>
                        <Icons1 name='cash-multiple' size={24} color={COLORS.primary}/>
                        <Text style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                           flex: 1
                        }}>
                           Pay By
                        </Text>
                        <Text style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                        }}>
                           {details?.payment_method}
                        </Text>
                     </View>
                     {/* ---- E-Receipt */}
                     <Pressable 
                     onPress={() => {router.push(`/dashboard/client/booking/${id}/details/receipt`)}}
                     style={({pressed}) => [
                        styles.sectionPressable, {
                           flexDirection: 'row', 
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           gap: 12,
                           backgroundColor: pressed ? COLORS.summaryPress : 'transparent'
                     }]}>
                        <Icons1 name='file-document' size={24} color={COLORS.primary}/>
                        <Text style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                           flex: 1
                        }}>
                           E-Receipt
                        </Text>
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>
                  </View>
               </View>

            </ScrollView>
            
            {(details?.status === 'Upcoming' || details?.status === 'Ongoing') &&
               <Animated.View
               style={{
                  height: 60,
                  width: qrWidth,
                  position: 'absolute',
                  bottom: insets.bottom + 24,
                  right: 12,
               }}>
               <Pressable
               onPress={() => {router.push(`/dashboard/client/booking/${id}/details/qrcode`)}}
               style={({pressed}) => [
                  global.shadowTop, {
                  height: '100%',
                  width: '100%',
                  borderRadius: 60,
                  backgroundColor: pressed ? COLORS.primaryPress : COLORS.primary,
                  justifyContent: 'center',
                  alignItems: 'center'
               }]}
               >
                  <Icons1 name='qrcode' size={32} color={'#fff'}/>
               </Pressable>
               </Animated.View>
            }
            {details?.status === 'Pending' &&
               <Animated.View
               style={[
                  global.shadowBottom, {
                  position: 'absolute',
                  paddingBottom: insets.bottom + 24,
                  paddingHorizontal: 24, 
                  paddingTop: 12,
                  backgroundColor: '#fff',
                  width: '100%',
                  bottom: 0,
                  borderRadius: 24,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: COLORS.strokes,
                  transform: [{translateY: buttonTranslate}]
               }]}>
                  <MainButton 
                  text={"Mark as Complete"}
                  loading={completeLoading}
                  onPress={() => handleComplete(id)}
                  />
               </Animated.View>
            }
               
         </View>
      </>
   )
}

export default BookingDetails

const styles = StyleSheet.create({
   container: {
      borderRadius: 12,
      backgroundColor: '#fff',
      overflow: 'hidden'
   },
   sectionView: {
      padding: 12,
      gap: 6
   },
   sectionPressable: {
      padding: 6,
      gap: 6,
      borderRadius: 6
   },
   content : {
      gap: 6,
      padding: 6,
      flexShrink: 1
   },
   sectionTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.labels
   }
})