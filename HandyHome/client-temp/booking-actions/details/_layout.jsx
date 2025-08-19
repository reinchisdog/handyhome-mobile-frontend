import { Stack } from 'expo-router'
import {EmergencyProvider} from '../../../../../context/EmergencyContext'
import { KeyboardProvider } from 'react-native-keyboard-controller';

const BookingDetailsLayout = () => {
   return (
      <KeyboardProvider>
         <EmergencyProvider>
            <Stack 
            screenOptions={{
               headerShown: false
            }}
            />
         </EmergencyProvider>
      </KeyboardProvider>
      
   )
}

export default BookingDetailsLayout