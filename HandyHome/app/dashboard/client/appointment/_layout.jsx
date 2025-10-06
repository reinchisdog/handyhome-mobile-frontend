// Layout: Appointment Process Layout

// Imports
// React and Expo Components
import { Stack } from "expo-router"
// Contexts
import { MediaProvider } from "../../../../context/MediaContext"

const AppointmentLayout = () => {
   return (
      <MediaProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}
         />
      </MediaProvider>
   )
}

export default AppointmentLayout