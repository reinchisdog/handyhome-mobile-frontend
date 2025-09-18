// Layout: Booking Details

// Imports
import { Stack } from "expo-router";
import { BookingDetailsProvider } from "../../../../../../context/BookingDetailsContext";

const BookingDetailsLayout = () => {
   return (
      <BookingDetailsProvider>
         <Stack 
         screenOptions={{
            headerShown: false
         }}
         />
      </BookingDetailsProvider>
   )
}

export default BookingDetailsLayout