import { StyleSheet, Text, View, FlatList, Image, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../../../../config';

import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const BookingItems = [
  {
    id: 1,
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category ",
    servName: "Service Name (Oldest)",
    clientName: "Worker's Name",
    location: "Sta. Mesa, Manila",
    price: 300
  },
  {
    id: 2,
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category ",
    servName: "Service Name (Oldest)",
    clientName: "Worker's Name",
    location: "Sta. Mesa, Manila",
    price: 300
  },
  {
    id: 3,
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category ",
    servName: "Service Name (Oldest)",
    clientName: "Worker's Name",
    location: "Sta. Mesa, Manila",
    price: 300
  },
  {
    id: 4,
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category ",
    servName: "Service Name (Oldest)",
    clientName: "Worker's Name",
    location: "Sta. Mesa, Manila",
    price: 300
  },
  {
    id: 5,
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category ",
    servName: "Service Name (Oldest)",
    clientName: "Worker's Name",
    location: "Sta. Mesa, Manila",
    price: 300
  },
  {
    id: 6,
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category ",
    servName: "Service Name (Oldest)",
    clientName: "Worker's Name",
    location: "Sta. Mesa, Manila",
    price: 300
  },
]

const UpcomingScreen = () => {
   const router = useRouter();

   const [bookingList, setBookingList] = useState([])
   const [bookingLoading, setBookingLoading] = useState(false);
   const fetchBookingList = async () => {
      try {
         setBookingLoading(true)

         const result = await axios.get()
      } catch (err) {
         console.log(err);
      } finally {
         setBookingLoading(false)
      }
   }

  return (
    <FlatList 
      data={BookingItems}
      renderItem={({item}) => 
        <BookingItem item={item} 
        left={{
          name: "E-Receipt",
          function: () => {}
        }}
        right={{
          name: "Done",
          function: () => {}
        }}/>
      }
      inverted
    />
  )
}
  
export default UpcomingScreen

const BookingItem = ({item, left, right}) => {

  return (
     <View 
     style={{
        width: '100%',
        backgroundColor: '#fff',
        padding: 24,
        gap: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.lettersicons
     }}>
        {/* ------------------------------- Information ------------------------------ */}
        <View 
        style={[
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
           }}/>

           <View 
           style={{
              height: '100%',
              flex: 1,
              alignItems: 'flex-start',
              gap: 8,
           }}>
              <View 
              style={{
                 flexDirection: 'row',
                 justifyContent: 'space-between',
                 alignItems: 'center',
                 width: '100%'
              }}>
                 <View
                 style={[
                    global.tagContainer,
                    global.centerContainer, {
                    backgroundColor: '#F2F2F7'
                 }]}>
                    <Text
                    style={[
                       global.tagText,{
                       color: COLORS.primary
                    }]}>
                       {item.servCategory}
                    </Text>
                 </View>

                 <Text
                 style={[{
                    fontFamily: FONTS.roboto500,
                    fontSize: FONT_SIZES.lg,
                    letterSpacing: 0.2,
                    color: COLORS.accent
                 }]}>
                    {`\u20B1 ${item.price}`}
                 </Text>
              </View>

              {/* ---- Service Name */}
              <Text
              numberOfLines={1}
              style={[{
                 fontFamily: FONTS.roboto700,
                 fontSize: FONT_SIZES.lg,
                 letterSpacing: 0.2,
                 color: 'black',
                 flexShrink: 1
              }]}>
                 {item.servName}
              </Text>

              {/* ---- Client Name */}
              <View style={{
                 display: 'flex',
                 flexDirection: 'row',
                 alignItems: 'center',
                 gap: 4,
              }}>
                 <Icons2 name="person" size={14} color={COLORS.lettersicons} />
                 <Text
                 numberOfLines={1}
                 style={{
                    fontFamily: FONTS.roboto400,
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.lettersicons,
                    flexShrink: 1
                 }}>
                    {item.clientName}
                 </Text>
              </View>

              {/* ---- Location */}
              <View style={{
                 display: 'flex',
                 flexDirection: 'row',
                 alignItems: 'center',
                 gap: 4,
              }}>
                 <Icons2 name="location-on" size={14} color={COLORS.red} />
                 <Text
                 numberOfLines={1}
                 style={{
                    fontFamily: FONTS.roboto400,
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.lettersicons,
                    flexShrink: 1
                 }}>
                    {item.location}
                 </Text>
              </View>
           </View>
        </View>
        
        {/* --------------------------------- Buttons -------------------------------- */}
        {(left || right) &&
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
           (left) &&
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
        }

        {(right) &&
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
        }

     </View>
  )
}