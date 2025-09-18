// Screen: Booking Rating

// Imports
// ---- React and Expo Components
import { Animated, StyleSheet, Text, View, useWindowDimensions, StatusBar, Image, Pressable, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useRef, useEffect} from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
import Multiline from '../../../../../components/Multiline';
import MediaUpload from '../../../../../components/MediaUpload';
import ErrorModal from '../../../../../components/ErrorModal';
import {ServiceCategoryImages} from '../../../../../components/ServiceCategoryMap';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import Stars from '@expo/vector-icons/Octicons';
// ---- Other Libraries
import { useAuth } from '../../../../../context/AuthContext';
import { useConvert } from '../../../../../hooks/useConvert';
import api from '../../../../../lib/api';

const IMAGE_HEIGHT = 272;

const BookingRating = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const { height } = useWindowDimensions();
   const { id } = useLocalSearchParams();
   const { token } = useAuth();
   const { convertUriToFile } = useConvert();

   const [details, setDetails] = useState(null);
   const [detailsLoading, setDetailsLoading] = useState(true);

   const ratingValues = [1, 2, 3, 4, 5];
   const [feedback, setFeedback] = useState({
      rating: 0,
      review: '',
      attachment: null
   })
   const [feedbackLoading, setFeedbackLoading] = useState(false);
   const [feedbackDisabled, setFeedbackDisabled] = useState(true);

   const [errorModal, setErrorModal] = useState(false);
   const [errorTitle, setErrorTitle] = useState(null);
   const [errorMessage, setErrorMessage] = useState(null);

   const [successModal, setSuccessModal] = useState(false)

   // Animations
   const scrollY = useRef(new Animated.Value(0)).current;

   const headerColor = scrollY.interpolate({
      inputRange: [IMAGE_HEIGHT-64-10-StatusBar.currentHeight, IMAGE_HEIGHT-64],
      outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
      extrapolate: 'clamp',
   })
   
   // Functions
   const fetchDetails = async () => {
      try {
         setDetailsLoading(true);
         
         console.log("---- [Booking] Rating Details Fetch Attempt----");
         console.log("[1] Fetching Details");
         const detailsResult = await api.get(`/user/book/${id}/view`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         console.log("[2] Fetching Succesful");
         setDetails(detailsResult?.data?.data);
         setDetailsLoading(false);
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occured when fetching the booking details.";
         setErrorTitle("Booking Details Error");
         setErrorMessage(message);
         setErrorModal(true);
      }
   }  

   const appendFormData = (formData, data, parentKey = '') => {
      for (const key in data) {
         if (data.hasOwnProperty(key)) {
            const formKey = parentKey ? `${parentKey}[${key}]` : key;
            const value = data[key];

            if (value && typeof value === 'object' && value.uri && value.type) {
               console.log(`📎 Appending file: ${key} -> ${value.name} (${value.type})`);
               formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
               appendFormData(formData, value, formKey);
            } else {
               console.log(`📝 Appending field: ${formKey} -> ${value}`);
               formData.append(formKey, value);
            }
         }
      }
   }

   const handleFeedback = async () => {
      try {
         setFeedbackLoading(true);

         console.log("---- [Booking] Submit Feedback Attempt----");
         console.log("[1] Converting Data");
         const converted = {
            ...feedback,
            attachment: convertUriToFile(feedback.attachment)
         }

         const formData = new FormData();
         appendFormData(formData, converted);
         
         console.log("[2] Submitting Feedback");
         await api.post(`/user/book/${id}/review`, formData, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         console.log('[3] Rated Succesfully, Showing Modal');
         setSuccessModal(true);
         
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occured when submitting your feedback.";
         setErrorTitle("Booking Rating Error");
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setFeedbackLoading(false);
      }
   }

   // Effects
   useEffect(() => {
      if (!id) return;

      fetchDetails();
   }, [id])

   useEffect(() => {
      if (feedback.rating !== 0) {
         setFeedbackDisabled(false);
      } else {
         setFeedbackDisabled(true);
      }
   }, [feedback])

   return (
      <>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={errorTitle}
         message={errorMessage}
         />

         <Modal 
         visible={successModal}
         statusBarTranslucent={true}
         animationType='fade'
         backdropColor={COLORS.modalbg}
         onRequestClose={() => router.replace('/dashboard/client/bookings/completed')}
         >
            <View
            style={{
               flex: 1,
               justifyContent: 'center',
               alignItems: 'center'
            }}>
               <View style={global.centerModal}>
                  <Text 
                  style={{
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.primary,
                     textAlign: 'center'
                  }}>
                     Rating Submitted
                  </Text>

                  <View style={global.divider}/>

                  <Text 
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons,
                     textAlign: 'center'
                  }}>
                     Thank you for feedback. We will immediately let the service provider know about their performance.
                  </Text>

                  <MainButton 
                  type={'secondary'}
                  text={"View my Bookings"}
                  onPress={() => router.replace('/dashboard/client/bookings/completed')}
                  />
               </View>
            </View>
         </Modal>

         <View style={[global.screenContainer, {position: 'relative'}]}>
            <Header 
            hasBack
            backgroundColor={headerColor}
            position='absolute'
            />

            <KeyboardAwareScrollView
            bottomOffset={12}
            style={[
               global.screenContainer, {
               backgroundColor: COLORS.screenbg
            }]}
            onScroll={Animated.event(
               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
               { useNativeDriver: false }
            )}>
               {/* ---- Header */}
               <Image 
               source={ServiceCategoryImages[details?.subServiceId]}
               style={{
                  width: '100%',
                  height: IMAGE_HEIGHT,
                  objectFit: 'cover'
               }}/>

               {/* ---- Content */}
               <View 
               style={{
                  width: '100%',
                  minHeight: height - 272+24,
                  flexGrow: 1,
                  borderRadius: 24,
                  marginTop: -24,
                  backgroundColor: '#fff',
                  gap: 24,
                  justifyContent: 'space-between',
                  padding: 24,
                  paddingBottom: insets.bottom + 24
               }}>
                  <View style={{width: '100%', gap: 24}}>
                     {/* ---- Information */}
                     <View style={{gap: 12}}>
                        {/* ---- Service */}
                        <View 
                        style= {{
                           flexDirection: 'row',
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           gap: 8
                        }}>
                           <Text
                           style={{
                              fontFamily: FONTS.roboto600,
                              fontSize: FONT_SIZES.lg,
                              color: COLORS.lettersicons,
                              flexShrink: 1
                           }}>
                              {details?.serviceName}
                           </Text>

                           <Text
                           style={{
                              fontFamily: FONTS.roboto600,
                              fontSize: FONT_SIZES.sm,
                              paddingHorizontal: 10,
                              paddingVertical: 4,
                              borderRadius: 8,
                              backgroundColor: COLORS.lightblue,
                              justifyContent: 'center',
                              alignItems: 'center'
                           }}>
                              {details?.serviceCategory}
                           </Text>
                        </View>  
                        {/* ---- Worker and Date*/}
                        <View style={{gap: 4}}>
                           <Text 
                           style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.labels
                           }}>
                              Service Provider: <Text style={{color: COLORS.primary}}>
                                 {details?.worker?.name}
                              </Text>
                           </Text>

                           <Text 
                           style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.labels
                           }}>
                              Service Date: <Text style={{color: COLORS.accent}}>
                                 {details?.date}
                              </Text>
                           </Text>
                        </View>
                        
                     </View>

                     <View style={global.divider}/>

                     {/* ---- Rating */}
                     <View 
                     style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                     }}>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                        }}>
                           Rating
                        </Text>

                        <View 
                        style={{
                           flexDirection: 'row',
                           gap: 8, 
                           alignItems: 'center',
                           justifyContent: 'center'
                        }}>
                           {ratingValues.map((value, index) => (
                              <TouchableOpacity
                              key={value}
                              onPress={() => setFeedback(prev => ({
                                 ...prev,
                                 rating: value
                              }))}
                              >
                                 {(index + 1 <= feedback.rating) ?
                                    <Stars name='star-fill' size={36} color={COLORS.accent}/> :
                                    <Stars name='star' size={36} color={COLORS.strokes}/> 
                                 }
                              </TouchableOpacity>
                           ))}
                        </View>
                     </View>
                     
                     {/* ---- Review */}
                     <View
                     style={{
                        gap: 12
                     }}>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                        }}>
                           Review
                        </Text>

                        <Multiline 
                        placeholder='Write your review here'
                        onChangeText={(e) => setFeedback(prev => ({
                           ...prev,
                           review: e
                        }))}
                        value={feedback.review}
                        numberOfLines={6}
                        />

                     </View>

                     {/* ---- Attachment */}
                     <MediaUpload 
                     maxMedia={1}
                     data={feedback.attachment}
                     dataName={"attachment"}
                     setData={setFeedback}
                     />
                  </View>

                  <MainButton
                  type='primary'
                  text='Submit Rating'
                  onPress={handleFeedback}
                  loading={feedbackLoading}
                  disabled={feedbackDisabled}
                  />
               </View>
            </KeyboardAwareScrollView>
         </View>
      </>
   )
}

export default BookingRating

const styles = StyleSheet.create({})