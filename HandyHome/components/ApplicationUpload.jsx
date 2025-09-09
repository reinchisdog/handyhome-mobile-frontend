// Component: Application Upload

// Imports
// ---- React Components
import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
// ---- Contexts
import { useMedia } from '../context/MediaContext';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialIcons';
import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';

const ApplicationUpload = ({
   icon,
   title,
   label,
   onPress,
   maxUpload = 1,
   data,
   renderData,
}) => {
   // Hooks and States

   // Functions
   const getDataLength = () => {
      if (!data) return 0;
      if (Array.isArray(data)) return data.length;
      return 1; // Single object counts as 1 item
   };

   const hasData = () => {
      if (!data) return false;
      if (Array.isArray(data)) return data.length > 0;
      return true; // Single object means we have data
   };

   return (
      <View style={{ gap: 8 }}>
         <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            {icon}
            <Text
            style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons
            }}>
               {title}
            </Text>
         </View>
         
         {/* Rendered Data */}
         {hasData() && renderData}

         {/* Add Button */}
         {(!hasData() || getDataLength() < maxUpload) &&
            <Pressable
            onPress={onPress}
            style={({pressed}) => [{
               backgroundColor: pressed ? COLORS.summaryPress : COLORS.secondary,
               paddingVertical: 4,
               borderRadius: 24,
               borderWidth: 1,
               borderStyle: 'dashed',
               borderColor: COLORS.strokes,
               width: '100%'
            }]}>
               <View 
               style={{
                  marginLeft: -24,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
               }}>
                  <Icons name='add' size={24} color={COLORS.primary}/>
                  <Text 
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.lettersicons,
                     opacity: 0.8
                  }}>
                     {label}
                  </Text>
               </View>
            </Pressable>
         }
      </View>
   )
}

export default ApplicationUpload

const styles = StyleSheet.create({})