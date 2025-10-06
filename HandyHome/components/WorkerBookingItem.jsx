// Component: User Booking Item

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Image, TouchableHighlight, Pressable,  } from 'react-native'
import React from 'react'
// ---- Other Components
import { ServiceCategoryImages } from './ServiceCategoryMap';
import SmallButton from './SmallButton';
// ---- Styles and Icons
import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';
import Icons from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/Entypo';

const WorkerBookingItem = ({request, booking, left, right}) => {
   return (
      <View 
      style={{
         backgroundColor: '#fff',
         padding: 12,
         gap: 12,
         borderRadius: 12
      }}>
         {/* ---- Information */}
         <View
         style={{
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: 12,
            // backgroundColor: 'green'
         }}>
            <Image 
            source={ServiceCategoryImages[request?.sub_services?.id || booking?.service_info?.subServiceId]}
            style={{
               width: '33%',
               height: '100%',
               borderRadius: 8,
               objectFit: 'cover'
            }}/>

            <View 
            style={{
               flexShrink: 1,
               gap: 8,
               alignItems: 'flex-start',
            }}>
               <View
               style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%'
               }}>
                  <Text 
                  numberOfLines={1}
                  style= {{
                     paddingHorizontal: 8,
                     paddingVertical: 4,
                     borderRadius: 6,
                     backgroundColor: COLORS.secondary,
                     flexShrink: 1,
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.xs,
                     color: COLORS.primary,
                     textAlign: 'center',
                  }}>
                     {request?.services?.name || booking?.service_info?.serviceCategory}
                  </Text> 

                  <Text 
                  numberOfLines={1}
                  style= {{
                     flexShrink: 1,
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.accent,
                     textAlign: 'right',
                  }}>
                     {`\u20B1 ${request?.price || booking?.service_info?.price}`}
                  </Text> 
               </View>

               <Text
               numberOfLines={1}
               style={{
                  fontFamily: FONTS.roboto600,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.lettersicons,
                  paddingLeft: 8,
               }}>
                  {request?.sub_services?.name || booking?.service_info?.serviceName}
               </Text>

               <View style={{gap: 4}}>
                  {booking &&
                     <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', paddingLeft: 6}}>
                        <Icons name='person' size={16} color={COLORS.labels}/>
                        <Text
                        numberOfLines={1}
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.labels,
                           flexShrink: 1
                        }}>
                           {booking?.user?.name}
                        </Text>
                     </View>
                  }

                  <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', paddingLeft: 6}}>
                     <Icons name='location-pin' size={14} color={COLORS.red}/>
                     <Text
                     numberOfLines={1}
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.labels,
                        flexShrink: 1
                     }}>
                        {
                           request ? `${request?.municipal}, ${request?.province}` : 
                           booking ? `${booking?.service_info?.address}` :
                           null
                        }
                     </Text>
                  </View>
               </View>
               
            </View>
         </View>

         {/* ---- Buttons */}
         {(left || right) &&
            <View
            style={{
               flexDirection: 'row-reverse',
               gap: 12,
               alignItems: 'center',
               height: 30
            }}>
               {right &&
                  <SmallButton 
                  type={right?.type || "primary"}
                  text={right?.text}
                  onPress={right?.function}
                  loading={right?.loading || false}
                  disabled={right?.disabled || false}
                  />
               }
               
               {left &&
                  <SmallButton 
                  type={left?.type || "secondary"}
                  text={left?.text}
                  onPress={left?.function}
                  loading={left?.loading || false}
                  disabled={left?.disabled || false}
                  />
               }

               <View style={{flex: 1}}/>
            </View>
         }
      </View>
   )
}

export default WorkerBookingItem

const styles = StyleSheet.create({})