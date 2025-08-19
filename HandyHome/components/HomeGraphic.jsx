// Component: Home Graphic - For Background Styling

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Image } from 'react-native'
// ---- Styles and Icons
import { COLORS } from '../styles/constants'

const HomeGraphic = () => {
  return (
   <Image 
   source={
      require('../assets/images/backgrounds/graphic-bg1.png')
   }
   style={{
      width: '100%',
      height: 214,
      backgroundColor: COLORS.lightblue,
      overflow: 'hidden',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingHorizontal: 24,
      position: 'absolute',
      zIndex: 0,
      elevation: 0,
      objectFit: 'cover',
   }} />
  )
}

export default HomeGraphic