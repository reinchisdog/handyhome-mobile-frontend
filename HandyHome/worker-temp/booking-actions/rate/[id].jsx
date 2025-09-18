// import { StyleSheet, Text, View, TouchableOpacity, Easing, StatusBar, Animated, Image, useWindowDimensions } from 'react-native'
// import React, { useState, useRef, useEffect } from 'react'
// import { useRouter, useLocalSearchParams } from 'expo-router'
// import { KeyboardProvider, KeyboardAwareScrollView } from 'react-native-keyboard-controller'
// import { useSafeAreaInsets } from 'react-native-safe-area-context'
// import axios from 'axios'
// import { API_URL } from '../../../../../config'
// import { useAuth } from '../../../../../context/AuthContext'

// import Header from '../../../../../components/dashboard/Header'
// import MainButton from '../../../../../components/MainButton'
// import ErrorModal from '../../../../../components/ErrorModal'
// import BasicMultiline from '../../../../../components/authentication/BasicMultiline'
// import { subServiceImages } from '../../../../../components/SubServiceMap'

// import Arrows from '@expo/vector-icons/Entypo'
// import Stars from '@expo/vector-icons/Octicons'
// import {globalStyles as global} from '../../../../../styles/globalStyles';
// import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

// const IMAGE_HEIGHT = 272;

// const RateBookingScreen = () => {
//    const {token} = useAuth();
//    const {id} = useLocalSearchParams();
//    const {width, height} = useWindowDimensions();
//    const inets = useSafeAreaInsets();
//    const router = useRouter();
//    const scrollY = useRef(new Animated.Value(0)).current;
//    const skeletonOpacity = useRef(new Animated.Value(0.5)).current;
//    const headerColor = scrollY.interpolate({
//       inputRange: [IMAGE_HEIGHT-64-10-StatusBar.currentHeight, IMAGE_HEIGHT-64],
//       outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
//       extrapolate: 'clamp',
//    });

//    const headerText = scrollY.interpolate({
//       inputRange: [IMAGE_HEIGHT-64-10-StatusBar.currentHeight, IMAGE_HEIGHT-64],
//       outputRange: [0, 1],
//       extrapolate: 'clamp',
//    });

//    const [details, setDetails] = useState(null);
//    const [detailsLoading, setDetailsLoading] = useState(true);
//    useEffect(() => {
//       const animLoop = Animated.loop(
//          Animated.sequence([
//             Animated.timing(skeletonOpacity, {
//                toValue: 0.5,
//                duration: 250,
//                easing: Easing.inOut(Easing.ease),
//                useNativeDriver: true
//             }),
//             Animated.timing(skeletonOpacity, {
//                toValue: 0.2,
//                duration: 500,
//                easing: Easing.inOut(Easing.ease),
//                useNativeDriver: true
//             }),
//             Animated.timing(skeletonOpacity, {
//                toValue: 0.5,
//                duration: 250,
//                easing: Easing.inOut(Easing.ease),
//                useNativeDriver: true
//             }),
//          ])
//       )
  
//       if (detailsLoading) animLoop.start();
      
//       return () => animLoop.stop();
//    }, [detailsLoading])
//    const fetchBookingDetails = async () => {
//       try {
//          setDetailsLoading(true);

//          const result = await axios.get(`${API_URL}/user/book/${id}/fetch_booking`, {
//             headers: {
//                'Authorization' : `Bearer ${token}`
//             }
//          })

//          const status = result?.data?.status || "error";
//          const message = result?.data?.message;

//          if (status === "success") {
//             setDetails(result.data.data);
//             setDetailsLoading(false);
//          } else if (status === "failed" || status === "error") {
//             throw new Error(message);
//          }

//       } catch (err) {
//          const message = err?.message || "An unknown error has occured when getting the booking details."
//          showError("Booking Details Error", message);
//       }
//    }

//    const ratingValues = [1, 2, 3, 4, 5];
//    const [rating, setRating] = useState(0);
//    const [review, setReview] = useState("");

//    useEffect(() => {
//       console.log(id)
//       fetchBookingDetails();
//    }, [id])


//    const handleRatingReview = async () => {
//       try {
//          setRatingLoading(true);

//          const body = {
//             review: review,
//             rating: rating,
//          }

//          const result = await axios.post(`${API_URL}/user/book/${id}/review`, body, {
//             headers: {
//                'Authorization' : `Bearer ${token}`
//             }
//          } )

//          const status = result?.data?.status || "error";
//          const message = result?.data?.message;

//          if (status === "success") {
//             router.back();
//          } else if (status === "failed" || status === "error") {
//             throw new Error(message);
//          }
//       } catch (err) {
//          const message = err?.message || "An unknown error has occured when trying to submit the rating";
//          showError('Booking Rating Error', message);
//       } finally {
//          setRatingLoading(false);
//       }
//    }

//    const [ratingLoading, setRatingLoading] = useState(false);
//    const [ratingDisabled, setRatingDisabled] = useState(true);
//    useEffect(() => {
//       if (rating !== 0) setRatingDisabled(false);
//       else setRatingDisabled(true);
//    }, [rating])

//    const [modalError, setModalError] = useState(false);
//    const [modalTitle, setModalTitle] = useState(null);
//    const [modalMessage, setModalMessage] = useState(null);
//    const showError = (title, message) => {
//       setModalTitle(title);
//       setModalMessage(message);
//       setModalError(true);
//    }

//    return (
//       <>
//          <ErrorModal 
//          visible={modalError}
//          setVisible={setModalError}
//          title={modalTitle}
//          message={modalMessage}
//          onExit={() => router.back()}
//          />
      
//          <KeyboardProvider>
//             <View style={[global.screenContainer, {paddingBottom: inets.bottom}]}>
//                <Header 
//                background={headerColor}
//                left={
//                   <TouchableOpacity onPress={() => router.back()}>
//                      <Arrows name="chevron-left" size={24} color={COLORS.primary} />
//                   </TouchableOpacity>
//                }
//                title={
//                   <Animated.View style={{
//                      opacity: headerText,
//                      flexDirection: 'row',
//                      justifyContent: 'space-between',
//                      width: '100%',
//                      paddingLeft: 24
//                   }}>
//                      <Text 
//                      numberOfLines={1}
//                      style={{
//                         fontFamily: FONTS.roboto600,
//                         fontSize: FONT_SIZES.xl,
//                         color: COLORS.lettersicons,
//                         flexShrink: 1
//                      }}
//                      >
//                         {"Service NameDasdasdasdasdadasdasd"}
//                      </Text>
//                      <View 
//                      style={[
//                         global.tagContainer, {
//                         backgroundColor: COLORS.lightblue
//                      }]}>
//                         <Text 
//                         style={[
//                            global.tagText, {
//                            color: COLORS.lettersicons
//                         }]}>
//                            {"Service Category"}
//                         </Text>
//                      </View>
//                   </Animated.View>
//                }
//                headerPosition='absolute'
//                />

//                <KeyboardAwareScrollView 
//                bottomOffset={20}
//                style={{flex: 1, backgroundColor: '#fff'}}
//                onScroll={Animated.event(
//                   [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//                   { useNativeDriver: false }
//                )}>  
//                   {/* ------------------------------ Header Image ------------------------------ */}
//                   <Image 
//                   source={subServiceImages[id]}
//                   style={{
//                      width: width,
//                      height: IMAGE_HEIGHT,
//                      objectFit: 'cover'
//                   }}/>

//                   {/* --------------------------------- Content -------------------------------- */}
//                   <View
//                   style={{
//                      width: width,
//                      minHeight: height - 272+24,
//                      flexGrow: 1,
//                      padding: 24,
//                      borderRadius: 24,
//                      marginTop: -24,
//                      backgroundColor: '#fff',
//                      gap: 24,
//                      justifyContent: 'space-between'
//                   }}>
//                      <View
//                      style={{
//                         width: '100%',
//                         gap: 24
//                      }}>
//                         {/* ---------------------------- Content Category ---------------------------- */}
//                         <View style={[style.contentBox]}>
//                            <View
//                            style={{
//                               flexDirection: 'row',
//                               justifyContent: 'space-between',
//                               alignItems: 'stretch'
//                            }}>
//                               {detailsLoading ? (
//                                  <Animated.View 
//                                  style={{
//                                     backgroundColor: COLORS.strokes,
//                                     borderRadius: 8,
//                                     height: 24,
//                                     opacity: skeletonOpacity,
//                                     width: '100%' 
//                                  }}/>
//                               ) : (
//                                  <>
//                                     <Text 
//                                     style={{
//                                        fontFamily: FONTS.roboto600,
//                                        fontSize: FONT_SIZES.xl,
//                                        color: COLORS.lettersicons
//                                     }}>
//                                        {details?.serviceName}
//                                     </Text>
//                                     <View 
//                                     style={[
//                                        global.tagContainer, {
//                                        backgroundColor: COLORS.lightblue
//                                     }]}>
//                                        <Text 
//                                        style={[
//                                           global.tagText, {
//                                           color: COLORS.lettersicons
//                                        }]}>
//                                           {details?.serviceCategory}
//                                        </Text>
//                                     </View>
//                                  </>
//                               )}
                              
//                            </View>
//                            {detailsLoading ? (
//                                  <Animated.View 
//                                  style={{
//                                     backgroundColor: COLORS.strokes,
//                                     borderRadius: 8,
//                                     height: 14,
//                                     opacity: skeletonOpacity,
//                                     width: '50%' 
//                                  }}/>
//                               ) : (
//                                  <>
//                                     <Text
//                                     style={{
//                                        fontFamily: FONTS.roboto500,
//                                        fontSize: FONT_SIZES.sm,
//                                        color: COLORS.strokes
//                                     }}>
//                                        Service Provider: <Text style={{color: COLORS.primary}}>
//                                           {details?.worker?.name}
//                                        </Text>
//                                     </Text>
//                                  </>
//                               )}
                           
//                         </View>

//                         {/* -------------------------------- Separator ------------------------------- */}
//                         <View style={[style.contentBox, {
//                            borderBottomWidth: 1,
//                            borderBottomColor: COLORS.strokes
//                         }]} />
                        
//                         {/* --------------------------------- Rating --------------------------------- */}
//                         <View style={{
//                            gap: 12, 
//                            alignItems: 'center', 
//                            justifyContent: 'center', 
//                         }}>
//                            <Text 
//                            style={{
//                               fontFamily: FONTS.roboto500,
//                               fontSize: FONT_SIZES.md,
//                               color: COLORS.labels,
//                               textAlign: 'center'
//                            }}>
//                               How would you rate the service?
//                            </Text>

//                            <View 
//                            style={{
//                               flexDirection: 'row',
//                               gap: 12, 
//                               alignItems: 'center',
//                               justifyContent: 'center'
                              
//                            }}>
//                               {ratingValues.map((value, index) => (
//                                  <TouchableOpacity
//                                  key={value}
//                                  activeOpacity={0.6}
//                                  onPress={() => setRating(value)}>
//                                     {(index+1 <= rating) ?
//                                        <Stars name='star-fill' size={40} color={COLORS.accent}/> :
//                                        <Stars name='star' size={40} color={COLORS.strokes}/> 
//                                     }
//                                  </TouchableOpacity>
//                               ))}
//                            </View>
//                         </View>
//                         {/* --------------------------------- Review --------------------------------- */}
//                         <View style={{
//                            gap: 12,
//                            alignItems: 'center', 
//                            justifyContent: 'center', 
//                         }}>
//                            <Text 
//                            style={{
//                               fontFamily: FONTS.roboto500,
//                               fontSize: FONT_SIZES.md,
//                               color: COLORS.labels,
//                               textAlign: 'center'
//                            }}>
//                               How about you leave them a review?
//                            </Text>
//                            <BasicMultiline 
//                            placeholder='Add a Detailed Review'
//                            value={review}
//                            onChangeText={(e) => setReview(e)}
//                            numberOfLines={6}
//                            />
//                         </View>
//                      </View>

//                      <MainButton 
//                      text="Submit Rating"
//                      type="primary"
//                      onPress={handleRatingReview}
//                      loading={ratingLoading}
//                      disabled={ratingDisabled}
//                      />
//                   </View>
//                </KeyboardAwareScrollView>
//             </View>
//          </KeyboardProvider>
//       </>
//    )
// }

// export default RateBookingScreen

// const style = StyleSheet.create({
//    contentBox: {
//       width: '100%',
//       gap: 16
//    },
//    contentTitle: {
//       fontFamily: FONTS.roboto700,
//       fontSize: FONT_SIZES.md,
//       color: COLORS.lettersicons
//    }
// })