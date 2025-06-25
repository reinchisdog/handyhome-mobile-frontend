import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'

import BookingItem from '../../../../../components/dashboard/booking/BookingItem'
import { useRouter } from 'expo-router'

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

const UpcomingScreen = () => {
  const router = useRouter();
  return (
    <FlatList 
      data={BookingItems}
      renderItem={({item}) => 
        <BookingItem item={item} 
        left = {{
          name: 'Cancel',
          function: () => {
            router.push({
              pathname: '/client-dashboard/booking-actions/cancel/[id]',
              params: {id: 2}
            })
          }
        }}
        right = {{
          name: 'Details',
          function: () => {
            router.push({
              pathname: '/client-dashboard/booking-actions/details/[id]',
              params: {id: 2, status: 'upcoming'}
            })
          }
        }}/>
      }
      inverted
    />
  )
}

export default UpcomingScreen