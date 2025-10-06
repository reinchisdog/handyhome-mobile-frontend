// Screen: Incoming Request Details

// Imports
// ---- React and Expo Components
import { ScrollView, StyleSheet, Text, View, Image, Pressable, Modal, useWindowDimensions, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import api from '../../../../../lib/api'
import { useAuth } from '../../../../../context/AuthContext'
import { useRequestDetails } from '../../../../../context/RequestDetailsContext'
import { useConvert } from '../../../../../hooks/useConvert';
// ---- Other Components
import Header from '../../../../../components/Header'
import { ServiceCategoryImages } from '../../../../../components/ServiceCategoryMap';
import MainButton from '../../../../../components/MainButton'
import LoadingDots from '../../../../../components/LoadingDots'
// ---- Styles and Icons
import { globalStyles as global} from '../../../../../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants'
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';

const RequestDetailsScreen = () => {
   // Hooks and States
   const {id} = useLocalSearchParams();
   const {token} = useAuth();
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width, height} = useWindowDimensions();
   const {setRequestId, details, detailsLoading, setErrorModal, setErrorMessage, fetchDetails, clearDetails} = useRequestDetails();
   const {convertDateToFormattedDate} = useConvert();

   const [buttonLoading, setButtonLoading] = useState(false);
   const [descriptionModal, setDescriptionModal] = useState(false)

   // Functions
   const handleReject = async (id) => {
      try {
         setButtonLoading(true);

         console.log("---- [Home Screen] Reject Attempt ----");
         console.log('[1] Rejection Request:', id);
         await api.put(`/worker/bookings/${id}/reject_booking`, {}, {
            headers: {'Authorization' : `Bearer ${token}`}
         });

         console.log('[2] Successful Rejection, Fetching New List');
         router.back();
      } catch (err) {
         console.log("[0] Rejection Error:", err);
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when rejecting the request.";
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setButtonLoading(false);
      }
   }

   const handleBack = () => {
      router.back();

      setTimeout(() => {
         clearDetails();
      }, 300)
   }

   // Effects
   useEffect(() => {
      if (!id) return;

      setRequestId(id);
      fetchDetails(id);
   }, [id]);

   // Renders
   const formatDate = (dateString) => {
      if (!dateString) return null;

      const date = new Date(dateString + 'T00:00:00');
      const options = {month: 'short', day: 'numeric'};
      return date.toLocaleDateString('en-US', options);
   }

   const formatTime = (timeString) => {
      if (!timeString) return null;    

      const [hours, minutes, seconds] = timeString.split(':').map(Number);

      const actualHours = hours === 24 ? 0 : hours;
      
      const period = actualHours >= 12 ? 'PM' : 'AM';
      const displayHours = actualHours === 0 ? 12 : actualHours > 12 ? actualHours - 12 : actualHours;
      
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
   }

   return (
      <View style={[global.screenContainer, {position: 'relative'}]}>
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
                        // source={require('../../../../../assets/placeholder-base.png')}
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

         <Header 
         hasBack
         title={'Incoming Request'}
         onBack={handleBack}
         />

         <ScrollView
         contentContainerStyle={{
            gap: 12,
            padding: 12,
            paddingBottom: insets.bottom + 48 + 100
         }}>
            {/* Client */}
            <View style={[styles.container, ]}>
               <View style={[styles.sectionView, {flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 0}]}>
                  <View style={{justifyContent: 'center', alignItems: 'center', width: 40}}>
                     <Icons name='account'  size={24} color={COLORS.primary}/>
                  </View>

                  <Text style={{
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.lettersicons,
                     flexShrink: 1
                  }}>
                     {details?.full_name}
                  </Text>
               </View>  
               <View style={[styles.sectionView, {flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 4}]}>
                  <View style={{justifyContent: 'center', alignItems: 'center', width: 40}}>
                     <Icons name='map-marker'  size={24} color={COLORS.red}/>
                  </View>
                  
                  <Text style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels,
                     flexShrink: 1
                  }}>
                     {`${details?.block}, ${details?.barangay}, ${details?.municipal}, ${details?.province}`}
                  </Text>
               </View>
            </View>

            {/* Service */}
            <View style={[styles.container]}>
               <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                  Service
               </Text>
               <View style={[styles.sectionView, {flexDirection: 'row', gap: 12}]}>
                  <Image 
                  source={ServiceCategoryImages[details?.sub_service_id]}
                  style={{
                     borderRadius: 8,
                     width: 64,
                     height: 64
                  }}/>

                  <View style={{flex: 1, justifyContent: 'space-between'}}>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.labels
                     }}>
                        {`${formatDate(details?.date)}  |  ${formatTime(details?.time)}`}
                     </Text>

                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.primary
                     }}>
                        {`${details?.sub_services?.name}`}
                     </Text>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}>
                        {details?.service?.name}
                     </Text>
                  </View>
               </View>

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
                        // source={require('../../../../../assets/placeholder-base.png')}
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

                  <View style={[{paddingHorizontal: 12}]}>
                     <View style={[global.divider]}/>
                  </View>

                  <View style={[styles.sectionView, {alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}]}>
                     <Text style={[styles.sectionTitle]}>
                        Base Labor Fee:
                     </Text>

                     <Text style={[styles.sectionTitle, {color: COLORS.lettersicons}]}>
                        {`\u20B1 ${details?.price}`}
                     </Text>
                  </View>
               </View>
            </View>
         </ScrollView>

         <View 
         style={[
            global.shadowBottom, {
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 24,
            paddingBottom: insets.bottom + 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            position: 'absolute',
            bottom: 0,
            width: '100%'
         }]}>
            <MainButton 
            type='secondary'
            size='flex'
            text='Reject'
            loading={buttonLoading}
            onPress={() => handleReject(id)}
            />

            <MainButton 
            type='primary'
            size='flex'
            text='Accept'
            loading={buttonLoading}
            onPress={() => router.push({
               pathname: '/dashboard/worker/request/[id]/materials',
               params: {id: id}
            })}
            />
         </View>
      </View>
  )
}

export default RequestDetailsScreen

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