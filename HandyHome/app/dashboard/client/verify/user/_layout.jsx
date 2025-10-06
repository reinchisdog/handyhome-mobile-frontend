// Layout: Appointment Process Layout

// Imports
// React and Expo Components
import { Stack } from "expo-router"
// Contexts
import { MediaProvider } from "../../../../../context/MediaContext"
import { ClientVerificationProvider } from "../../../../../context/ClientVerificationContext"

const AppointmentLayout = () => {
   return (
      <MediaProvider>
      <ClientVerificationProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}
         />
      </ClientVerificationProvider>
      </MediaProvider>
   )
}

export default AppointmentLayout