// Component: Address Container

// Imports
// ---- React Components
import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';
import { globalStyles as global } from '../styles/globalStyles';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

const AddressContainer = ({item, selected, onSelect}) => {
   return (
      <Pressable
      onPress={onSelect}
      style={({pressed}) => [{
         minHeight: 64,
         width: '100%',
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'space-between',
         gap: 8,
         borderRadius: 10,
         padding: 12,
         borderWidth: 2,
         backgroundColor: '#fff',
         borderColor: pressed ? COLORS.lightblue : '#fff'
      }]}>
         <View style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            flexShrink: 1,
         }}>
            <Icons name='map-marker' size={24} color={COLORS.primary}/>

            <Text
            numberOfLines={2}
            style={{
               textAlign: 'left',
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.sm,
               color: COLORS.lettersicons,
               flexShrink: 1,
            }}
            >
               {`${item.block}, ${item.barangay}, ${item.municipal}, ${item.province}`}
            </Text>
         </View>

         <View
         style={{
            height: 24,
            width: 24,
            aspectRatio: 1/1,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.labels,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.secondary
         }}>
            <View 
            style={{
               width: 16,
               height: 16,
               aspectRatio: 1/1,
               borderRadius: 8,
               backgroundColor: selected === item.id ? COLORS.accent : COLORS.secondary
            }}/>
         </View>

      </Pressable>
   )
}

export default AddressContainer

const styles = StyleSheet.create({})