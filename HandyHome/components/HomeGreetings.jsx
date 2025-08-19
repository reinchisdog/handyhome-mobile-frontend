// Component: User Greeting

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
// ---- Custom Components
// ---- Styles and Icons
import { globalStyles as global } from '../styles/globalStyles'
import { COLORS } from '../styles/constants'

const HomeGreetings = ({name}) => {
   return (
      <View 
      style={[{
         paddingHorizontal: 24,
         flexDirection: 'row',
         minHeight: 42,
         width: '100%',
         alignItems: 'center',
         gap: 16
      }]}>
         <Image 
         source={
            require(`../assets/images/logos/square-logo-1.png`)
         }
         style={{
            width: 42,
            aspectRatio: 1/1
         }}
         />

         <Text 
         style={[
            global.headingText, {
            color: COLORS.lettersicons
         }]}>
            Hello, <Text style={[{ color: COLORS.primary }]}>
               {name.trim() || "there"}!
            </Text>
         </Text>
      </View>
   )
}

export default HomeGreetings

const styles = StyleSheet.create({})