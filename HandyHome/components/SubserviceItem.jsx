import { Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import {useRouter} from 'expo-router'
import { subServiceImages } from './SubServiceMap'

import { globalStyles as global } from '../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../styles/constants'
import Arrows from '@expo/vector-icons/Entypo';

const SubserviceItem = ({item, serviceName}) => {
   const router = useRouter();

   return (
      <Pressable 
      onPress={() => {
         router.push({
            pathname: '/client-dashboard/appointment/[index]',
            params: { id: item.id, mainName: serviceName, subName: item.name },
         });
      }}
      style={({pressed}) => [{
         width: '100%',
         height: 150,
         backgroundColor: '#fff',
         padding: 12,
         gap: 10,
         borderRadius: 8,
         display: 'flex',
         flexDirection: 'row',
         borderWidth: 2,
         borderColor: pressed ? COLORS.lightblue : '#fff'
      }]}>
            {/* -------------------------------- Left Side ------------------------------- */}
            <Image 
            source={subServiceImages[item.id]}
            style={{
               height: '100%',
               flex: 1,
               objectFit: 'cover',
               borderRadius: 2
            }}/>

            {/* ------------------------------- Right Side ------------------------------- */}
            <View
            style={{
               flex: 2,
               justifyContent: 'space-between'
            }}>
               {/* -------------------------- Title and Description ------------------------- */}
               <View
               style={{
                  gap: 4,
               }}>
                  <Text
                  numberOfLines={1}
                  style={{
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.lg,
                     color: COLORS.lettersicons,
                     flexShrink: 1,
                     textTransform: 'capitalize'
                  }}
                  >{item.name}</Text>
                  <Text
                  numberOfLines={4}
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons,
                     textAlign: 'justify'
                  }}>{item.description}</Text>
               </View>
               {/* ----------------------------- Price and Link ----------------------------- */}
               <View
               style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between'
               }}
               >
                  <View>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}
                     >Starts at</Text>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto700,
                        fontSize: FONT_SIZES.xl,
                        color: COLORS.accent
                     }}
                     >{`\u20B1${item.price}`}</Text>
                  </View>
                  <Arrows name="chevron-right" size={24} color={COLORS.primary} />
               </View>
            </View>
      </Pressable>
   )
}

export default SubserviceItem