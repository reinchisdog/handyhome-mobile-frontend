// Layout: Booking Layout

// Imports
// ---- React and Expo Components
import {Stack} from 'expo-router'
import { MediaProvider } from '../../../../context/MediaContext';

const BookingLayout = () => {
   return (
      <MediaProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_left'
         }}/>
      </MediaProvider>
   )
}

export default BookingLayout