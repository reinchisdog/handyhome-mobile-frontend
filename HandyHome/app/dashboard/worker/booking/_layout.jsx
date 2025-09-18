// Layout: Booking Layout

// Imports
// ---- React and Expo Components
import {Stack} from 'expo-router'
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { MediaProvider } from '../../../../context/MediaContext';

const BookingLayout = () => {
   return (
      <MediaProvider>
      <KeyboardProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_left'
         }}/>
      </KeyboardProvider>
      </MediaProvider>
   )
}

export default BookingLayout