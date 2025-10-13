// Components: Bookings Empty

// Imports
// ---- React Components
import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
// ---- Styles and Icons
import { launchStyles as launch } from '../styles/launchStyles'

const BookingsEmpty = ({title, description}) => {
   return (
      <View
      style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 24
      }}>
         <Image
         source={require('../assets/images/illustrations/EmptyBookings.png')}
         style={{
            height: 200,
            width: 200,
            aspectRatio: 1/1
         }}
         />

         <Text 
         style={[
            launch.title, {
            marginBottom: 0, 
            marginTop: 4,
         }]}>
            {title}
         </Text>
         <Text style={[launch.description, {paddingHorizontal: 0}]}>
            {description}
         </Text>
      </View>
   )
}

export default BookingsEmpty

const styles = StyleSheet.create({})