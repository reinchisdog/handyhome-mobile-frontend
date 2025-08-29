// Layout: Booking Layout

// Imports
// ---- React and Expo Components
import {Stack} from 'expo-router'
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { CameraProvider } from '../../../../context/CameraContext';

const BookingLayout = () => {
   return (
      <CameraProvider>
      <KeyboardProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_left'
         }}/>
      </KeyboardProvider>
      </CameraProvider>
   )
}

export default BookingLayout