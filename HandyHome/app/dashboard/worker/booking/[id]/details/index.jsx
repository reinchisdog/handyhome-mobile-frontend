// Screen: Booking Details

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Pressable, ImageBackground, Animated, useWindowDimensions, Modal, StatusBar, Linking, FlatList } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { CameraView, useCameraPermissions } from 'expo-camera';
// ---- Other Components
import Header from '../../../../../../components/Header';
import LoadingDots from '../../../../../../components/LoadingDots'
import MainButton from '../../../../../../components/MainButton';
import {ServiceCategoryImages} from '../../../../../../components/ServiceCategoryMap'
import ErrorModal from '../../../../../../components/ErrorModal';
// Styles and Icons
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/Entypo';
// Other Libraries
import api from '../../../../../../lib/api';
import { useAuth } from '../../../../../../context/AuthContext';
// import { useAuth } from '../../../../../../context/AuthContext';
import { useBookingDetails } from '../../../../../../context/BookingDetailsContext';

const WorkerBookingDetails = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const { width, height } = useWindowDimensions();
   const { token } = useAuth();
   const { id } = useLocalSearchParams();
   const { details, detailsLoading, fetchDetails, fetchChatSession, onQrScanned, qrLoading, cameraModal, setCameraModal, materials } = useBookingDetails();

   const [descriptionModal, setDescriptionModal] = useState(false);

   const [addonExpanded, setAddonExpanded] = useState(false);
   const PREVIEW_COUNT = 3;

   const [addonPrice, setAddonPrice] = useState(0);

   const [permission, requestPermission] = useCameraPermissions();

   //Ref
   const cameraRef = useRef(null);

   // Functions
   const openQrScanner = useCallback(async () => { 
      if (!permission?.granted) {
         const granted = await requestPermission();
         if (!granted.granted) {
            Linking.openSettings();
            return;
         }
      }

      setCameraModal(true);
   }, [permission, requestPermission])

   // Renders
   const renderHeaderText = () => {
      const status = details?.status?.toLowerCase();
      switch (status) {
         case 'upcoming': return "You have an upcoming appointment.";
         case 'ongoing': return "Work is currently in progress.";
         case 'pending': return "Work is currently in progress.";
         case 'completed': return "Job has been completed successfully.";
         default: return null
      }
   }
   
   const renderSubHeaderText = () => {
      const status = details?.status?.toLowerCase();
      switch (status) {
         case 'upcoming':
            return `You're scheduled to work on ${details?.date} at ${details?.time}.`;
         case 'ongoing':
            return `Currently working. Contact support if you need assistance.`;
         case 'pending':
            return `Currently working. Contact support if you need assistance.`;
         case 'completed':
            return `You are now able to preview the feedback of your work.`;
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

   // Effects
   useEffect(() => {
      if (!id) return;

      fetchDetails(id, 'worker');
   }, [id])

   useEffect(() => {
      const total = materials
         .filter(material => material.selected)
         .reduce((sum, material) => sum + (material.price * material.quantity), 0);
      
      setAddonPrice(total);
   }, [materials])

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

         {/* Camera Modal */}
         <Modal
         visible={cameraModal}
         statusBarTranslucent={true}
         animationType='slide'
         backdropColor={COLORS.modalbg}
         onRequestClose={!qrLoading ? () => setCameraModal(false) : () => {}}
         style={{flex: 1, position: 'relative'}}
         >  
            {qrLoading &&
               <View
               style={{
                  width: width,
                  height: height,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  zIndex: 999,
                  backgroundColor: '#000000b8',
               }}>
                  <LoadingDots slide={false}/>
               </View>
            }
            

            <Header 
            hasBack
            onBack={!qrLoading ? () => setCameraModal(false) : () => {}}
            backColor='#fff'
            backgroundColor='#000'
            />
            <View style={{flex: 1, position: 'relative'}}>
               {!qrLoading &&
                  <View 
                  style={{
                     width: '100%', 
                     position: 'absolute', 
                     zIndex: 1,
                     gap: 24,
                     paddingHorizontal: 24,
                     alignItems: 'center',
                     top: '50%',
                     transform: [{ translateY: '-50%'}],
                     marginTop: -(StatusBar.currentHeight || 0) - 40
                  }}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: '#fff',
                        textAlign: 'center'
                     }}>
                        Scan the QR Code to Proceed
                     </Text>

                     <View 
                     style={{
                        aspectRatio: 1/1,
                        width: '80%',
                        maxWidth: 360,
                        maxHeight: 360,
                        borderWidth: 1,
                        borderColor: COLORS.labels,
                        borderRadius: 12
                     }}
                     />
                  </View>
               }
               

               <CameraView 
               ref={cameraRef}
               style={{flex: 1}}
               barcodeScannerSettings={{
                  barcodeTypes: ["qr"]
               }}
               onBarcodeScanned={({data}) => {
                  if (qrLoading) return;
                  onQrScanned(id, data)
               }}/>
            </View>
         </Modal>

         <View 
         style={[
            global.screenContainer, {
            backgroundColor: COLORS.screenbg, 
            position: 'relative'
         }]}>
            {detailsLoading &&
               <View style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: 0,
                  left: 0,
                  width: width,
                  height: height,
                  backgroundColor: '#fff',
                  zIndex: 999999
               }}>
                  <LoadingDots slide={false}/>
               </View>
            }

            <Header 
            hasBack
            title='Booking Details'
            backgroundColor='#fff'
            />

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
                           flex: 1,
                           textAlign: 'justify'
                        }}>   
                           {details?.description}
                        </Text>
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </Pressable>
                     
                  </View>
                  
                  {/* ---- Add-ons */}
                  <View style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     paddingHorizontal: 12, 
                     paddingBottom: 6
                  }}>
                     <Text style={[styles.sectionTitle]}>
                        Add-ons
                     </Text>
                     {details?.status === 'Ongoing' &&
                        <TouchableOpacity
                        onPress={() => router.push('/dashboard/worker/booking/[id]/details/materials')}
                        style={{
                           flexDirection: 'row',
                           alignItems: 'center',
                           gap: 4
                        }}>
                           <Text style={[styles.sectionTitle, {color: COLORS.accent}]}>
                              Edit
                           </Text>
                           <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                        </TouchableOpacity>
                        }
                  </View>
                  
                  <FlatList 
                  data={addonExpanded ? materials : materials.slice(0, PREVIEW_COUNT)}
                  scrollEnabled={false}
                  renderItem={({item}) => (
                        <View style={{
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        gap: 8, 
                        justifyContent: 'space-between'
                     }}>
                        <Text 
                        numberOfLines={1}
                        style={{
                           fontFamily: FONTS.roboto600,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                           flexShrink: 1,
                        }}>
                           {item.name}
                        </Text>

                        <Text 
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                        }}>
                           x {item.quantity}
                        </Text>

                     </View>
                  )}
                  ListFooterComponent={
                     materials.length > PREVIEW_COUNT &&
                     <TouchableOpacity
                     onPress={() => setAddonExpanded(!addonExpanded)}style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        paddingTop: 4,
                        paddingBottom: 12,
                        paddingHorizontal: 12,
                     }}>
                        <Text style={[styles.sectionTitle, {color: COLORS.accent}]}>
                           {addonExpanded ? 'Show Less' : 'Show More'}
                        </Text>
                        <Arrows name={addonExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={COLORS.accent}/>
                     </TouchableOpacity>
                  }
                  contentContainerStyle={{
                     paddingBottom: materials.length > PREVIEW_COUNT ? 0 : 12
                  }}/>

                  <View style={[{paddingHorizontal: 12}]}>
                     <View style={[global.divider]}/>
                  </View>
                  
                  {/* ---- Price */}
                  <View style={{
                     gap: 8, 
                     marginHorizontal: 12, 
                     paddingVertical: 16,
                     borderBottomWidth: 1,
                     borderColor: COLORS.strokes
                  }}>
                     <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8
                     }}>
                        <Text style={[styles.sectionTitle]}>
                           Base Labor Fee:
                        </Text>
                        <Text style={[styles.sectionTitle, {color: COLORS.lettersicons}]}>
                           {`\u20B1 ${details?.price}`}
                        </Text>
                     </View>
                     <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8
                     }}>
                        <Text style={[styles.sectionTitle]}>
                           Add-ons Fee:
                        </Text>
                        <Text style={[styles.sectionTitle, {color: COLORS.lettersicons}]}>
                           {`\u20B1 ${addonPrice}`}
                        </Text>
                     </View>
                  </View>

                  <View style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     gap: 8,
                     padding : 12
                  }}>
                     <Text style={[styles.sectionTitle]}>
                        Estimated Total:
                     </Text>
                     <Text style={[styles.sectionTitle, {color: COLORS.lettersicons}]}>
                        {`\u20B1 ${addonPrice + details?.price}`}
                     </Text>
                  </View>
                  
               </View>

               {/* ---- Service Support */}
               <View style={[styles.container]}>
                  <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                     Service Support
                  </Text>
                  <View style={styles.sectionPressable}>
                     {/* ---- Chat Message */}
                     {details?.status !== "Completed" &&
                        <Pressable 
                        onPress={() => {fetchChatSession(details?.session)}}
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
                              Message Your Client
                           </Text>
                           <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                        </Pressable>
                     }  
                     {/* ---- FAQs */}
                     <Pressable 
                     onPress={() => {router.push('/dashboard/worker/settings/faqs')}}
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
                           Paid By
                        </Text>
                        <Text style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                        }}>
                           {details?.payment_method}
                        </Text>
                     </View>
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
               onPress={openQrScanner}
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
                  <Icons1 name='qrcode-scan' size={32} color={'#fff'}/>
               </Pressable>
               </Animated.View>
            }
               
         </View>
      </>
   )
}

export default WorkerBookingDetails

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