// Layout: Booking Layout

// Imports
// ---- React and Expo Components
import {Stack} from 'expo-router'
import { MediaProvider } from '../../../../context/MediaContext';
import { BookingDetailsProvider } from "../../../../context/BookingDetailsContext";

const BookingLayout = () => {
   return (
      <BookingDetailsProvider>
      <MediaProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_left'
         }}/>
      </MediaProvider>
      </BookingDetailsProvider>
   )
}

export default BookingLayout