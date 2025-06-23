import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

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
  const router = useRouter();

  return (
    <FlatList 
      data={BookingItems}
      renderItem={({item}) => (
        <BookingItem item={item} 
        left = {{
          name: 'Message',
          function: () => {router.push({
            pathname: 'client-dashboard/inbox'
          })}
        }}
        right = {{
          name: 'Details',
          function: () => {router.push({
            pathname: 'client-dashboard/booking-actions/details/[id]',
            params: {id: 2, status: 'ongoing'}
          })}
        }}
        />
      )
      }
      inverted
    />
  )
}

export default OngoingScreen