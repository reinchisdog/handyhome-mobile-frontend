// Component: Booking Item

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Image, TouchableHighlight,  } from 'react-native'
import React from 'react'
// ---- Other Components
import { ServiceCategoryImages } from './ServiceCategoryMap';
import SmallButton from './SmallButton'
// ---- Styles and Icons
import { globalStyles as global} from '../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../styles/constants'
import Icons from '@expo/vector-icons/MaterialIcons';

const BookingItem = ({data, left, right}) => {

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
            source={ServiceCategoryImages[data?.serviceId]}
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
               {/* ---- Category */}
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
                  {data?.serviceCategory}
               </Text> 
               {/* ---- Name */}
               <Text
               numberOfLines={1}
               style={{
                  fontFamily: FONTS.roboto600,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.lettersicons,
                  paddingLeft: 8,
               }}>
                  {data?.serviceName}
               </Text>
               {/* ---- Worker */}
               <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', paddingLeft: 6}}>
                  <Icons name='person' size={14} color={COLORS.labels}/>
                  <Text
                  numberOfLines={1}
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels,
                     flexShrink: 1
                  }}>
                     {data?.worker?.name}
                  </Text>
               </View>
               {/* ---- Price */}
               <Text
               style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.accent,
                  paddingLeft: 8
               }}>
                  {`\u20B1 ${data.price}`}
               </Text>
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

               <View style={{maxWidth: '33%', minWidth: '33%', flexGrow: 1}}/>
            </View>
         }

      </View>
   )
}

export default BookingItem