import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'

import BookingItem from '../../../../../components/dashboard/booking/BookingItem'

const BookingItems = [
  {
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category ",
    servName: "Service Name (Oldest)",
    workName: "Worker's Name",
    price: 300
  },
  {
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category",
    servName: "Service Name",
    workName: "Worker's Name",
    price: 300
  },
  {
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category",
    servName: "Service Name",
    workName: "Worker's Name",
    price: 300
  },
  {
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category",
    servName: "Service Name",
    workName: "Worker's Name",
    price: 300
  },
  {
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category",
    servName: "Service Name",
    workName: "Worker's Name",
    price: 300
  },
  {
    image: require('../../../../../assets/placeholder-base.png'),
    servCategory: "Service Category",
    servName: "Service Name (Latest)",
    workName: "Worker's Name",
    price: 300
  },
]

const OngoingScreen = () => {
  

  return (
    <FlatList 
      data={BookingItems}
      renderItem={({item}) => (
        <TouchableOpacity
          activeOpacity={0.6}
          onLongPress={() => {console.log("Long Pressed")}}
          onPress={() => {console.log("Pressed")}}
        >
          <BookingItem item={item} 
          left = {{
            name: 'Message',
            function: () => {console.log("Message")}
          }}
          right = {{
            name: 'Track',
            function: () => {console.log("Track")}
          }}
          />
        </TouchableOpacity>
        
      )
      }
      inverted
    />
  )
}

export default OngoingScreen