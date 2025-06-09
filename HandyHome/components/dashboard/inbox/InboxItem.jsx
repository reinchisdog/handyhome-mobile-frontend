import { StyleSheet, Text, TouchableHighlight, View, Image } from 'react-native'
import React from 'react'

import { globalStyles as global } from '../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../styles/constants';



export default InboxItem = ({item}) => {
   return (
      <TouchableHighlight
         underlayColor={COLORS.lightblue}
         onPress={() => {console.log("short")}}
         onLongPress={() => {console.log("long")}}
      >
         <View
            style={{
               display: 'flex',
               flexDirection: 'row',
               padding: 24,
               gap: 12,
               justifyContent: 'center',
               alignItems: 'center',
               borderBottomWidth: StyleSheet.hairlineWidth,
               borderBottomColor: COLORS.strokes,
               backgroundColor: (item.isUnread)? '#e1eef7' : '#fff'
            }}
         >
            {/* ----------------------------- Profile Picture ---------------------------- */}
            <Image 
               source={item.senderProfile}
               style={{
                  height: 50,
                  width: 50,
                  aspectRatio: '1/1',
                  borderRadius: 25,
                  objectFit: 'cover'
               }}
            />
            {/* ---------------------------- Name and Message ---------------------------- */}
            <View
               style={{
                  flex: 1
               }}
            >
               <Text
                  style={{
                     fontFamily: (item.isUnread) ? FONTS.roboto700 : FONTS.roboto500,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.lettersicons
                  }}
               >
                  {item.senderName}
               </Text>

               <Text
                  numberOfLines={1}
                  style={{
                     fontFamily: (item.isUnread) ? FONTS.roboto700 : FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons,
                  }}
               >
                  {item.latestMessage}
               </Text>
            </View>
            {/* ---------------------------- Badges and Icons ---------------------------- */}
            {(item.isUnread) ?
               <View
                  style={{
                     height: 12,
                     width: 12,
                     aspectRatio: '1/1',
                     borderRadius: 6,
                     backgroundColor: COLORS.primary
                  }}
               >
                  {/* If there is Text
                  <Text></Text> 
                  */}
               </View> :
               <></>
            }

            

         </View>
      </TouchableHighlight>
   )
}