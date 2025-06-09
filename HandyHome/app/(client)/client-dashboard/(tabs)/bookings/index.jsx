import { StyleSheet, Text, View, FlatList } from 'react-native'
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

const UpcomingScreen = () => {
  return (
    <FlatList 
      data={BookingItems}
      renderItem={({item}) => <BookingItem item={item} status="Upcoming" />}
      inverted
    />
  )
}

export default UpcomingScreen