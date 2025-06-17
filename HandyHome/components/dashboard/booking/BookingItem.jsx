import { StyleSheet, Text, View, Image, TouchableHighlight,  } from 'react-native'
import React from 'react'

import { globalStyles as global} from '../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../styles/constants'
import Icons from '@expo/vector-icons/MaterialIcons';

const BookingItem = ({item, left, right}) => {

   return (
      <View style={{
         width: '100%',
         backgroundColor: '#fff',
         padding: 24,
         gap: 12,
         borderBottomWidth: StyleSheet.hairlineWidth,
         borderColor: COLORS.lettersicons
      }}>
         {/* ------------------------------- Information ------------------------------ */}
         <View style={[
            global.centerContainer, {
            height: 100,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 24
         }]}>

            <Image 
               source={item.image}
               style={{
                  height: 100,
                  width: 100,
                  aspectRatio: '1/1',
                  borderRadius: 8,
                  objectFit: 'cover',
                  resizeMode: 'cover'
               }}
            />
            <View 
            style={{
               height: '100%',
               flex: 1,
               alignItems: 'flex-start',
               gap: 8,
            }}>
               <View
                  style={[
                  global.tagContainer,
                  global.centerContainer, {
                  backgroundColor: '#F2F2F7'
                  }]}
               >
                  <Text
                     style={[
                     global.tagText,{
                     color: COLORS.primary
                     }]}
                  >
                  {item.servCategory}
                  </Text>
               </View>
               <Text
               numberOfLines={1}
                  style={[{
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.lg,
                     letterSpacing: 0.2,
                     color: 'black'
                  }]}
               >{item.servName}</Text>
               <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
               }}>
                  <Icons name="person" size={14} color={COLORS.lettersicons} />
                  <Text
                  numberOfLines={1}
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons,
                  }}>
                     {item.workName}
                  </Text>
               </View>
               <Text
                  style={[{
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.lg,
                     letterSpacing: 0.2,
                     color: COLORS.accent
                  }]}
               >{`\u20B1 ${item.price}`}</Text>
            </View>
         </View>
         
         {/* --------------------------------- Buttons -------------------------------- */}
         <View style={{
            width: '100%',
            height: 32,
            flex: 3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12
         }}>
            <View style={{
               height: '100%',
               maxWidth: '33.33%',
               flex: 1,
            }}></View>

         {
            // ---- First Button (Upcoming / Completed)
            (left) ? 
            <TouchableHighlight
               underlayColor="#d8d8d8"
               style={[
                  global.centerContainer, {
                  height: '100%',
                  maxWidth: '33.33%',
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: COLORS.strokes,
               }]}
               onPress={left.function}
            >
               <Text
                  style={[{
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons
                  }]}
               >
                  {left.name}
               </Text>
            </TouchableHighlight>
            :
            <></>
         }

         {
            // ---- Second Button
            <TouchableHighlight
               style={[
                  global.centerContainer, {
                  height: '100%',
                  maxWidth: '33.33%',
                  flex: 1,
                  backgroundColor: COLORS.primary,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
               }]}
               underlayColor={'#035082'}
               onPress={right.function}   
            >
               <Text
                  style={[{
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.sm,
                     color: '#fff'
                  }]}
               >
                  {right.name}
               </Text>
            </TouchableHighlight>
         }
         </View>

      </View>
   )
}

export default BookingItem