// Component: Worker Header

// Imports
// ---- React Components
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
// ---- Styles and Icons
import { globalStyles as global } from '../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants'
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo'

const WorkerHeader = ({
   name,
   number,
   location,
   photo,
   customers,
   rating,
   review,
   route = null
}) => {
   const router = useRouter();

   return (
      <View style={{width: '100%'}}>
         {/* ---- Worker Details */}
         <ImageBackground
         source={require('../assets/images/backgrounds/graphic-bg1.png')}
         style={{
            width: '100%',
            height: 138,
            backgroundColor: '#fff',
            overflow: 'hidden',
            position: 'relative',
         }}
         imageStyle={{
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
         }}
         >
            <View
            style={{
               paddingHorizontal: 24,
               flexDirection: 'row',
               alignItems: 'center',
               gap: 12,
            }}>
               {/* ---- Image */}
               <ImageBackground
               source={{uri: photo}}
               style={{
                  height: 82,
                  width: 82,
                  aspectRatio: 1/1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  position: 'relative',
               }}
               imageStyle={{
                  borderRadius: 41,
                  backgroundColor: COLORS.se
               }}>
                  <View
                  style={{
                     height: 24,
                     width: 24,
                     aspectRatio: 1/1,
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     backgroundColor: '#fff',
                     borderRadius: 12,
                     position: 'absolute',
                     right: 0,
                     bottom: 0
                  }}>
                     <Icons name='check-decagram' size={22}  color={COLORS.primary}/>
                  </View>
               </ImageBackground>

               {/* ---- Details */}
               <View style={{ gap: 6, flexShrink: 1 }}>
                  <Text numberOfLines={1}
                  style={{
                     flexShrink: 1,
                     flexWrap: 'wrap',
                     fontFamily: FONTS.roboto600,
                     fontSize: FONT_SIZES.lg,
                     color: COLORS.primary
                  }}>
                     {name}
                  </Text>
                  <Text numberOfLines={1}
                  style={{
                     flexShrink: 1,
                     flexWrap: 'wrap',
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels
                  }}>
                     {"Freelancer"}
                  </Text>
                  <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                     <Icons name='phone' size={12} color={COLORS.lettersicons}/>
                     <Text numberOfLines={1}
                     style={{
                        flexShrink: 1,
                        flexWrap: 'wrap',
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}>
                        {number}
                     </Text>
                  </View>
                  
               </View>

               {route &&
                  <TouchableOpacity
                  style={{
                     flex: 1,
                     alignItems: 'flex-end'
                  }}
                  onPress={() => router.push(route)}>
                     <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                  </TouchableOpacity>
               }
            </View>
         </ImageBackground>

         {/* ---- Service Details */}
         <View
         style={{
            paddingTop: 24,
            paddingHorizontal: 24,
            height: 154,
            flexDirection: 'row',
            alignItems: 'stretch',
            justifyContent: 'space-around',
            backgroundColor: '#fff'
         }}>
            {/* ---- Customers */}
            <View style={{ alignItems: 'center' }}>
               <View 
               style={[
                  global.centerContainer, styles.icons
               ]}>
                  <Icons 
                  name='account-group'
                  size={28}
                  color={COLORS.primary}
                  />
               </View>
               <Text style={styles.iconCount}>
                  {customers}
               </Text>
               <Text style={styles.iconTitle}>
                  Customers
               </Text>
            </View>
            {/* ---- Rating */}
            <View style={{ alignItems: 'center' }}>
               <View 
               style={[
                  global.centerContainer, styles.icons
               ]}>
                  <Icons 
                  name='star'
                  size={28}
                  color={COLORS.primary}
                  />
               </View>
               <Text style={styles.iconCount}>
                  {rating}
               </Text>
               <Text style={styles.iconTitle}>
                  Rating
               </Text>
            </View>
            {/* ---- Reviews */}
            <View style={{ alignItems: 'center' }}>
               <View 
               style={[
                  global.centerContainer, styles.icons
               ]}>
                  <Icons 
                  name='comment-edit'
                  size={28}
                  color={COLORS.primary}
                  />
               </View>
               <Text style={styles.iconCount}>
                  {review}
               </Text>
               <Text style={styles.iconTitle}>
                  Reviews
               </Text>
            </View>
         </View>
      </View>
   )
}

export default WorkerHeader

const styles = StyleSheet.create({
   icons: {
      width: 56,
      height: 56,
      aspectRatio: 1/1,
      borderRadius: 28,
      backgroundColor: COLORS.secondary,
      marginBottom: 10,
   },
   iconCount: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
      textAlign: 'center',
      marginBottom: 2,
   },
   iconTitle: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.labels,
      textAlign: 'center'
   },
})