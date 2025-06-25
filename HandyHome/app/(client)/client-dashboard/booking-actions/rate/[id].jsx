import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, StatusBar, Animated, Image, useWindowDimensions } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { KeyboardProvider, KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import Header from '../../../../../components/dashboard/Header'
import BasicMultiline from '../../../../../components/authentication/BasicMultiline'

import Arrows from '@expo/vector-icons/Entypo'
import Stars from '@expo/vector-icons/Octicons'
import {globalStyles as global} from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const IMAGE_HEIGHT = 272;

const RateBookingScreen = () => {
   const {width, height} = useWindowDimensions();
   const router = useRouter();
   const scrollY = useRef(new Animated.Value(0)).current;

   const headerColor = scrollY.interpolate({
      inputRange: [IMAGE_HEIGHT-64-10-StatusBar.currentHeight, IMAGE_HEIGHT-64],
      outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
      extrapolate: 'clamp',
   });

   const headerText = scrollY.interpolate({
      inputRange: [IMAGE_HEIGHT-64-10-StatusBar.currentHeight, IMAGE_HEIGHT-64],
      outputRange: [0, 1],
      extrapolate: 'clamp',
   });

   const ratingValues = [1, 2, 3, 4, 5];
   const [rating, setRating] = useState(0);
   const [review, setReview] = useState("");

   const handleRatingReview = () => {

   }

   return (
      <KeyboardProvider>
         <View style={[global.screenContainer]}>
            <Header 
            background={headerColor}
            left={
               <TouchableOpacity onPress={() => router.back()}>
                  <Arrows name="chevron-left" size={24} color={COLORS.primary} />
               </TouchableOpacity>
            }
            title={
               <Animated.View style={{
                  opacity: headerText,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingLeft: 24
               }}>
                  <Text 
                  numberOfLines={1}
                  style={{
                     fontFamily: FONTS.roboto600,
                     fontSize: FONT_SIZES.xl,
                     color: COLORS.lettersicons,
                     flexShrink: 1
                  }}
                  >
                     {"Service NameDasdasdasdasdadasdasd"}
                  </Text>
                  <View 
                  style={[
                     global.tagContainer, {
                     backgroundColor: COLORS.lightblue
                  }]}>
                     <Text 
                     style={[
                        global.tagText, {
                        color: COLORS.lettersicons
                     }]}>
                        {"Service Category"}
                     </Text>
                  </View>
               </Animated.View>
            }
            headerPosition='absolute'
            />

            <KeyboardAwareScrollView 
            bottomOffset={20}
            style={{flex: 1, backgroundColor: '#fff'}}
            onScroll={Animated.event(
               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
               { useNativeDriver: false }
            )}
            >  
               {/* ------------------------------ Header Image ------------------------------ */}
               <Image 
               source={require('../../../../../assets/placeholder-base.png')}
               style={{
                  width: width,
                  height: IMAGE_HEIGHT,
                  objectFit: 'cover'
               }}
               />

               {/* --------------------------------- Content -------------------------------- */}
               <View
               style={{
                  width: width,
                  minHeight: height - 272+24,
                  flexGrow: 1,
                  padding: 24,
                  borderRadius: 24,
                  marginTop: -24,
                  backgroundColor: '#fff',
                  gap: 24,
                  justifyContent: 'space-between'
               }}
               >
                  <View
                  style={{
                     width: '100%',
                     gap: 24
                  }}
                  >
                     {/* ---------------------------- Content Category ---------------------------- */}
                     <View style={[style.contentBox]}>
                        <View
                        style={{
                           flexDirection: 'row',
                           justifyContent: 'space-between'
                        }}>
                           <Text 
                           style={{
                              fontFamily: FONTS.roboto600,
                              fontSize: FONT_SIZES.xl,
                              color: COLORS.lettersicons
                           }}>
                              {"Service Name"}
                           </Text>
                           <View 
                           style={[
                              global.tagContainer, {
                              backgroundColor: COLORS.lightblue
                           }]}>
                              <Text 
                              style={[
                                 global.tagText, {
                                 color: COLORS.lettersicons
                              }]}>
                                 {"Service Category"}
                              </Text>
                           </View>
                        </View>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.strokes
                        }}
                        >
                           Service Provider: <Text style={{color: COLORS.primary}}>
                              {"Name"}
                           </Text>
                        </Text>
                     </View>

                     {/* -------------------------------- Separator ------------------------------- */}
                     <View style={[style.contentBox, {
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.strokes
                     }]} />
                     
                     {/* --------------------------------- Rating --------------------------------- */}
                     <View style={{
                        gap: 12, 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                     }}>
                        <Text 
                        style={{
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.labels,
                            textAlign: 'center'
                        }}>
                           How would you rate the service?
                        </Text>

                        <View 
                        style={{
                           flexDirection: 'row',
                           gap: 12, 
                           alignItems: 'center',
                           justifyContent: 'center'
                           
                        }}>
                           {ratingValues.map((value, index) => (
                              <TouchableOpacity
                              key={value}
                              activeOpacity={0.6}
                              onPress={() => setRating(value)}>
                                 {(index+1 <= rating) ?
                                    <Stars name='star-fill' size={40} color={COLORS.accent}/> :
                                    <Stars name='star' size={40} color={COLORS.strokes}/> 
                                 }
                              </TouchableOpacity>
                           ))}
                        </View>
                     </View>
                     {/* --------------------------------- Review --------------------------------- */}
                     <View style={{
                        gap: 12,
                        alignItems: 'center', 
                        justifyContent: 'center', 
                     }}>
                        <Text 
                        style={{
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.labels,
                            textAlign: 'center'
                        }}>
                           How about you leave them a review?
                        </Text>
                        <BasicMultiline 
                        placeholder='Add a Detailed Review'
                        value={review}
                        onChangeText={(e) => setReview(e)}
                        numberOfLines={6}
                        />
                     </View>
                  </View>

                  <TouchableHighlight
                  underlayColor={'#0072bc'}
                  onPress={handleRatingReview}
                  style={global.primaryBtn}>
                     <Text style={global.primaryBtnText}>
                        Submit Rating
                     </Text>
                  </TouchableHighlight>
               </View>
            </KeyboardAwareScrollView>
         </View>
      </KeyboardProvider>
   )
}

export default RateBookingScreen

const style = StyleSheet.create({
   contentBox: {
      width: '100%',
      gap: 16
   },
   contentTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons
   }
})