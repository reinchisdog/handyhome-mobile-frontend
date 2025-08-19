// Component: Input Date Timer

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';
import Icons from '@expo/vector-icons/MaterialIcons'

const InputDateTime = ({
   type,
   placeholder,
   value,
   onPress
}) => {
  return (
      <Pressable 
      onPress={onPress}
      style={styles.modalInputBox}
      >
      {!value ?
         <Text 
         style={[
            styles.modalInputText, {
            paddingHorizontal: 16, 
            color: COLORS.strokes
         }]}>
            {placeholder}
         </Text> 
            :
         <Text 
         style={[
            styles.modalInputText, {
            paddingHorizontal: 16
         }]}>
            {value}
         </Text> 
      }
         <Icons 
         name={type === "date" ? "calendar-month" : 
               type === "time" ? "access-time" : 
               null}
         size={24} 
         color={COLORS.lettersicons} />
      </Pressable>
   )
}

export default InputDateTime

const styles = StyleSheet.create({
   modalInputBox: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: 48,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: COLORS.strokes,
      borderRadius: 8,
      position: 'relative',
      backgroundColor: 'white',
      paddingHorizontal: 12
   },
   modalInputText: {
      flex: 1,
      paddingVertical: 12,
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      letterSpacing: 0.2,
      color: '#3D3D3D',
      lineHeight: FONT_SIZES.sm*1.2
   },
})