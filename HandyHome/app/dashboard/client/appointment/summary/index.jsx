// Screen: Appointment Summary

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, Pressable, Image, ImageBackground, Modal, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Contexts
import { useAuth } from '../../../../../context/AuthContext';
import { useAppointment } from '../../../../../context/AppointmentContext';
import api from '../../../../../lib/api';
// ---- Other Components
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
import GeneralModal from '../../../../../components/GeneralModal';
// ---- Styles and Icons
import Arrows from '@expo/vector-icons/Entypo';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomIcons from '../../../../../assets/customIcons';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const AppointmentSummaryScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {height, width} = useWindowDimensions();
   const {token} = useAuth();
   const { currentAppointment, clearAppointment, summary, summaryLoading, fetchSummary, rejectAppointment, fetchNewWorker, confirmLoading, setErrorMessage, setErrorType, setErrorModal} = useAppointment();
   const { id } = useLocalSearchParams();

   const [addonExpanded, setAddonExpanded] = useState(false);
   const PREVIEW_COUNT = 3;
   const [addonPrice, setAddonPrice] = useState(0);

   const [buttonLoading, setButtonLoading] = useState(false);
   const [cancelModal, setCancelModal] = useState(false);
   const [cancelLoading, setCancelLoading] = useState(false);

   const [descriptionModal, setDescriptionModal] = useState(false);
   
   // Functions
   const formatBookingDate = (date, time) => {
      if (!date || !time) {
         return "";
      }
      
      try {
         const dateTimeStr = `${date}T${time}`;
         const dateObj = new Date(dateTimeStr);
         
         // Check if the date is valid
         if (isNaN(dateObj.getTime())) {
            return "";
         }
         
         const dateFormatted = dateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
         });
         
         const timeFormatted = dateObj.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
         });
         
         return `${dateFormatted} | ${timeFormatted}`;
      } catch (error) {
         return "";
      }
   };

   const confirmAppointment = async (id) => {
      try {
         console.log("---- [Appointment Context] Confirming Attempt ----");
         setButtonLoading(true);
         console.log("[1] Confirming Booking:", id);
         await api.put(`/user/book/${id}/confirm_booking`, {}, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         })

         console.log("[2] Confirmed Succesfully, Routing to Success Screen");
         router.replace('/dashboard/client/appointment/success');
         await clearAppointment();
      } catch (err) {
         console.log("[0] Confirming Failed");
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred while confirming your booking. Please try again.";
         setErrorMessage(message);
         setErrorType(null);
         setErrorModal(true);
      } finally {
         setButtonLoading(false);
      }
   }

   const handleRejectAppointment = async () => {
      setCancelLoading(true);
      console.log(summary?.booking?.id);
      const appointmentId = id || summary?.booking?.id;

      await rejectAppointment(appointmentId);

      setCancelLoading(false);
   }

   const handleFetchNewWorker = () => {
      setCancelModal(false);
      fetchNewWorker(currentAppointment?.id);
   }

   useEffect(() => {
      const fetch = async () => {
         if (!currentAppointment?.id && summary) return;

         await fetchSummary(currentAppointment?.id);
      }
      
      fetch();
   }, [currentAppointment?.id])

   useEffect(() => {
      const total = summary?.materials?.reduce((acc, item) => acc + item.total_price, 0) || 0;
      setAddonPrice(total);
   }, [summary?.materials])

   return (
   <>
      <GeneralModal
      isAlert={true}
      visible={cancelModal}
      setVisible={setCancelModal}
      title={"Cancel Booking?"}
      message={"Choose how you'd like to proceed with your booking. You can cancel it completely or find a different service provider."}
      secondaryText={"Find Another Worker"}
      secondaryFunction={handleFetchNewWorker}
      primaryText={"Yes, Cancel"}
      primaryFunction={handleRejectAppointment}
      primaryLoading={cancelLoading}
      />

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
               {summary?.booking?.attachment &&
                  <View 
                  style={{
                     borderRadius: 12,
                     overflow: 'hidden',
                     width: '100%'
                  }}>
                     <Image 
                     source={{uri: summary?.booking?.attachment}}
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
                     {summary?.booking?.description}
                  </Text>
               </View>
            </ScrollView>
            
            <MainButton 
            text={'Close'}
            type='secondary'
            onPress={() => setDescriptionModal(false)}
            />
         </View>

         <Pressable 
         style={{width: width, height: height, position: 'absolute', zIndex: 1}}
         onPress={() => {setDescriptionModal(false)}}
         />
      </Modal>

      <View style={{flex: 1, position: 'relative'}}>
         <ScrollView
         stickyHeaderIndices={[0]}
         style={global.screenContainer}
         contentContainerStyle={{
            minHeight: height,
            backgroundColor: COLORS.screenbg,
            paddingBottom: 224 + insets.bottom
         }}>
            <Header
            hasBack={false}
            title={"Review Summary"}
            backgroundColor='#fff'
            />

            <View
            style={{
               paddingHorizontal: 12,
               paddingTop: 24,
               alignItems: 'center',
               gap: 12,
            }}>
               {/* ---- Address and Service Information */}
               <View style={[global.summaryBox, {backgroundColor: '#fff'}]}>

                  {/* ---- Address */}
                  <Pressable
                  style={({pressed}) => [
                     global.summaryBoxPressable, {
                     backgroundColor: pressed ? COLORS.summaryPress : '#fff'
                  }]}
                  onPress={() => {router.push('/dashboard/client/appointment/summary/address')}}
                  >
                     <View style={global.left}>
                        <Icons name='map-marker' size={24} color={COLORS.primary}/>
                        
                        <View style={{ flexShrink: 1, gap: 2 }}>
                           {/* ---- Name and Phone Number */}
                           <View style={{flexDirection: 'row', gap: 6, flexWrap: 'wrap'}}>
                              <Text style={global.righText}>
                                 {summary?.booking?.full_name || ""}
                              </Text>
                              <Text style={global.leftText}>
                                 {summary?.booking?.phone_number ? `(${summary.booking.phone_number})` : ""}
                              </Text>
                           </View>
                           {/* ---- Address */}
                           <Text 
                           style={{
                              flexShrink: 1,
                              flexWrap: 'wrap',
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.labels
                           }}>
                              {summary?.booking ? 
                                 `${summary.booking.block || ''}, ${summary.booking.barangay || ''}, ${summary.booking.municipal || ''}, ${summary.booking.province || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',')
                                 : ""
                              }
                           </Text>
                        </View>
                     </View>
                     <Arrows name="chevron-right" size={24} color={COLORS.accent} />
                  </Pressable>

                  <View style={{padding: 6}}><View style={global.divider}/></View>

                  {/* ---- Service Information */}
                  <View
                  style={[
                     global.summaryBoxView, {
                     backgroundColor: '#fff',
                  }]}>
                     <Text style={global.leftText}>
                        Service
                     </Text>
                     <Text style={global.righText}>
                        {summary?.booking?.service?.name || ""}
                     </Text>
                  </View>

                  <View
                  style={[
                     global.summaryBoxView, {
                     backgroundColor: '#fff',
                  }]}>
                     <Text style={global.leftText}>
                        Category
                     </Text>
                     <Text style={global.righText}>
                        {summary?.booking?.sub_service?.name || ""}
                     </Text>
                  </View>

                  <View
                  style={[
                     global.summaryBoxView, {
                     backgroundColor: '#fff',
                  }]}>
                     <Text style={global.leftText}>
                        Booking Date
                     </Text>
                     <Text style={global.righText}>
                        {formatBookingDate(summary?.booking?.date, summary?.booking?.time)}
                     </Text>
                  </View>

                  <View style={{padding: 6}}><View style={global.divider}/></View>

                  {/* ---- Description and Attachment */}
                  <Text style={[global.leftText, {padding: 6}]}>Description</Text>
                  <Pressable
                  style={({pressed}) => [
                     global.summaryBoxPressable, {
                     backgroundColor: pressed ? COLORS.summaryPress : '#fff'
                  }]}
                  onPress={() => {setDescriptionModal(true)}}
                  >
                     <View style={ global.left }>
                        {summary?.booking?.attachment &&
                           <Image 
                           source={{uri: summary?.booking?.attachment}}
                           style={{
                              height: 48,
                              width: 72,
                              borderRadius: 4,
                              objectFit: 'cover'
                           }}
                           />
                        }
                        <Text
                        numberOfLines={2}
                        style={{
                           flexShrink: 1,
                           flexWrap: 'wrap',
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.labels,
                           overflow: 'hidden',
                           textAlign: 'justify'
                        }}>
                           {summary?.booking?.description || ""}
                        </Text>
                     </View>
                     
                     <Arrows name="chevron-right" size={24} color={COLORS.accent} />
                  </Pressable>
               </View>

               {/* ---- Addons */}
               {summary?.materials?.length !== 0 &&
               <View style={[global.summaryBox, {backgroundColor: '#fff'}]}>
                  <Text style={[global.leftText, {padding: 6}]}>Add-ons</Text>
                  <FlatList 
                  data={addonExpanded ? summary?.materials : summary?.materials?.slice(0, PREVIEW_COUNT)}
                  scrollEnabled={false}
                  renderItem={({item}) => (
                     <View style={{
                        paddingHorizontal: 8,
                        paddingVertical: 6,
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
                           x {item.total_price / item.unit_price}
                        </Text>

                     </View>
                  )}
                  ListFooterComponent={
                     summary?.materials.length > PREVIEW_COUNT &&
                     <TouchableOpacity
                     onPress={() => setAddonExpanded(!addonExpanded)}>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto700,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.accent,
                           textAlign: 'center',
                        }}>
                           {addonExpanded ? 'Show Less' : 'Show More'}
                        </Text>
                     
                     </TouchableOpacity>
                  }
                  />
               </View>
               }


               {/* ----  Worker Information */}
               <View style={[global.summaryBox, {backgroundColor: '#fff'}]}>
                  <Text style={[global.leftText, {padding: 6}]}>Service Provider</Text>
                  <Pressable
                  style={({pressed}) => [
                     global.summaryBoxPressable, {
                     backgroundColor: pressed ? COLORS.summaryPress : '#fff'
                  }]}
                  onPress={() => {router.push('/dashboard/client/appointment/summary/worker')}}
                  >
                     <View style={[ global.left , { alignItems: 'center' }]}>
                        <ImageBackground
                        source={{uri: summary?.worker?.users?.profile_photo_url}}
                        imageStyle={{
                           borderRadius: 36,
                           backgroundColor: COLORS.secondary
                        }}
                        style={{
                           position: 'relative',
                           width: 72,
                           height: 72,
                           aspectRatio: 1/1,
                           justifyContent: 'flex-end',
                           alignItems: 'flex-end', 
                        }}>
                           <View
                           style={{
                              height: 24,
                              width: 24,
                              aspectRatio: 1/1,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#fff',
                              borderRadius: 12,
                              position: 'absolute',
                              right: 0,
                              bottom: 0
                           }}>
                              <Icons name='check-decagram' size={22}  color={COLORS.primary}/>
                           </View>
                        </ImageBackground>

                        <View style={{
                           gap: 6,
                           flexShrink: 1
                        }}>
                           <Text numberOfLines={1}
                           style={{
                              flexShrink: 1,
                              flexWrap: 'wrap',
                              fontFamily: FONTS.roboto600,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.primary
                           }}>
                              {summary?.worker?.users?.full_name}
                           </Text>
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
                           <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                              <Icons name='phone' size={12} color={COLORS.lettersicons}/>
                              <Text numberOfLines={1}
                              style={{
                                 flexShrink: 1,
                                 flexWrap: 'wrap',
                                 fontFamily: FONTS.roboto400,
                                 fontSize: FONT_SIZES.sm,
                                 color: COLORS.lettersicons
                              }}>
                                 {summary?.worker?.users?.phone_number}
                              </Text>
                           </View>
                           
                        </View>
                     </View>
                     
                     <Arrows name="chevron-right" size={24} color={COLORS.accent} />
                  </Pressable>
               </View>

               {/* ---- Payment Method */}
               <View style={[global.summaryBox, {backgroundColor: '#fff'}]}>
                  <Pressable
                  style={({pressed}) => [
                     global.summaryBoxPressable, {
                     backgroundColor: pressed ? COLORS.summaryPress : '#fff'
                  }]}
                  onPress={() => {router.push('/dashboard/client/appointment/summary/payment')}}
                  >
                     <View style={[ global.left , { alignItems: 'center' }]}>
                        {(summary) && summary?.booking?.payment_method === "Cash" ? 
                           <Icons name="cash-multiple" size={24} color={COLORS.labels} /> : 
                           <CustomIcons name="gcash" size={24} color={COLORS.labels}/>
                        } 
                        <Text style={global.leftText}>
                           {summary?.booking?.payment_method || ""}
                        </Text>
                     </View>
                     
                     <Text style={[global.righText, {color: COLORS.accent}]}>
                        Change
                     </Text>
                  </Pressable>

                  <View style={{padding: 6}}><View style={global.divider}/></View>

                  {/* ---- Price/s */}
                  <View
                  style={[
                     global.summaryBoxView, {
                     backgroundColor: '#fff',
                  }]}>
                     <Text style={global.leftText}>
                        Base Labor Fee
                     </Text>
                     <Text style={global.righText}>
                        {`\u20b1 ${summary?.booking?.price}` || ""}
                     </Text>
                  </View>
                  <View
                  style={[
                     global.summaryBoxView, {
                     backgroundColor: '#fff',
                  }]}>
                     <Text style={global.leftText}>
                        Add-ons Fee
                     </Text>
                     <Text style={global.righText}>
                        {`\u20b1 ${addonPrice}` || ""}
                     </Text>
                  </View>
               </View>
            </View>
         </ScrollView>
         
         {/* ---- Buttons */}
         <View
         style={[
            global.shadowBottom, {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            paddingTop: 12,
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: 24,
            backgroundColor: '#fff',
            zIndex: 100,
            borderRadius: 24,
            flexDirection: 'column',
            gap: 16,
            alignItems: 'stretch'
         }]}>
            <View style={{
               flexDirection: 'row', 
               justifyContent: 'space-between',
               alignItems: 'center'
            }}>
               <Text style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.labels
               }}>
                  ESTIMATED TOTAL
               </Text>
               <Text style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.primary
               }}>
                  {`\u20b1 ${summary?.booking?.price + addonPrice}` || ""}
               </Text>
            </View>

            <MainButton 
            type='primary'
            text={"Confirm"}
            onPress={() => confirmAppointment(currentAppointment?.id)}
            loading={buttonLoading}
            />

            <MainButton 
            type='secondary'
            text={"Cancel"}
            onPress={() => setCancelModal(true)}
            loading={buttonLoading}
            />
         </View>
      </View>
   </>
   )
}

export default AppointmentSummaryScreen

const styles = StyleSheet.create({})