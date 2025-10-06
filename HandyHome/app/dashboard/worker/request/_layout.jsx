// Layout: Request Layout

// Imports
// ---- React and Expo Components
import {Stack} from 'expo-router';
import { RequestDetailsProvider } from '../../../../context/RequestDetailsContext';

const BookingLayout = () => {
   return (
      <RequestDetailsProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}/>
      </RequestDetailsProvider>
   )
}

export default BookingLayout