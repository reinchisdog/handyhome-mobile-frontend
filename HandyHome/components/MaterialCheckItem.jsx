// Component : Material Check Item

// Imports
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native'
import React from 'react'
import InputCheckbox from './InputCheckbox';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

const MaterialCheckItem = ({data, onSelect, onDecrease, onIncrease, onQtyChange}) => {
   return (
      <View style={{
         flexDirection: 'row',
         gap: 16,
         paddingVertical: 12,
         borderBottomWidth: StyleSheet.hairlineWidth,
         borderColor: COLORS.strokes,
         alignItems: 'flex-start'
      }}>
         <Pressable 
         onPress={onSelect}
         style={{flexDirection: 'row', gap: 16, flex: 1}}
         >
            <InputCheckbox onPress={onSelect} value={data.selected}/>
            <View style={{flex: 1, gap: 4}}>
               <Text style={{fontFamily: FONTS.roboto600, fontSize: FONT_SIZES.sm, color: COLORS.lettersicons}}>
                  {data?.name}
               </Text>
               {data?.description && 
               <Text style={{fontFamily: FONTS.roboto400, fontSize: FONT_SIZES.sm, color: COLORS.labels}}>
                  {data?.description}
               </Text>
               }
               <Text style={{fontFamily: FONTS.roboto600, fontSize: FONT_SIZES.sm, color: COLORS.accent}}>
                  {`\u20B1 ${data?.price}`}
               </Text>
            </View>
         </Pressable>

         <View style={{flexDirection: 'row', alignItems: 'stretch', borderRadius: 8, borderWidth: 1, borderColor: COLORS.strokes, overflow: 'hidden'}}>
            <Pressable
            onPress={onDecrease}
            style={({pressed}) => [{
               backgroundColor: pressed ? COLORS.summaryPress : '#fff',
               justifyContent: 'center',
               alignItems: 'center'
            }]}
            >
               <Icons name='minus' size={20} color={COLORS.labels}/>
            </Pressable>

            <TextInput 
            style={{
               width: 24,
               textAlign: 'center',
               backgroundColor: COLORS.secondary,
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons
            }}
            onChangeText={onQtyChange}
            value={data?.quantity.toString()}
            maxLength={2}
            keyboardType='number-pad'
            inputMode='numeric'
            />

            <Pressable
            onPress={onIncrease}
            style={({pressed}) => [{
               backgroundColor: pressed ? COLORS.summaryPress : '#fff',
               justifyContent: 'center',
               alignItems: 'center'
            }]}
            >
               <Icons name='plus' size={20} color={COLORS.labels}/>
            </Pressable>
         </View>
      </View>
   )
}

export default MaterialCheckItem

const styles = StyleSheet.create({})