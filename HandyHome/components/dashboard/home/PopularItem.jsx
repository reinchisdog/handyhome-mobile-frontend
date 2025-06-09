import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native'
import React from 'react'

import Icons from '@expo/vector-icons/MaterialIcons';
import { globalStyles as global } from '../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../styles/constants';

const PopularItem = ({item}) => {
   return (
      <TouchableHighlight
         underlayColor={'#F2F2F7'}
         onPress={() => {}}
      >
         <View style={{
            borderRadius: 8,
            backgroundColor: '#fff',
            height: 180,
            width: 150,
            overflow: 'hidden',

            shadowColor: "#000",
            shadowOffset: {
               width: 0,
               height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,

            elevation: 2,
         }}
         
         >
            {/* -------------------------------- Top Half -------------------------------- */}
            <View style={{
               width: '100%',
               height: 100,
            }}>
               <Image 
                  source={require('../../../assets/placeholder-base.png')}
                  style={{
                     width: '100%',
                     height: '100%',
                     objectFit: 'cover'
                  }}
               />
            </View>

            {/* ------------------------------- Bottom Half ------------------------------ */}
            <View
               style={{
                  padding: 8,
                  height: 80,
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
               }}
            >
               <Text 
               numberOfLines={1}
               style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.lg,
                  color: COLORS.lettersicons,
               }}>
                  Plumber
               </Text>

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
                     fontSize: FONT_SIZES.xs,
                     color: COLORS.lettersicons,
                  }}>
                     Worker's Name
                  </Text>
               </View>
               
               <Text
               style={{
                  fontFamily: FONTS.roboto500,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.primary,
                  alignSelf: 'flex-end'
               }}>
                  {`\u20B1${"2000"}`}
               </Text>
            </View>
         </View>
      </TouchableHighlight>
   )
}

export default PopularItem