// Layout: Appointment Process Layout

// Imports
// React and Expo Components
import { Stack } from "expo-router"
// Contexts
import { KeyboardProvider } from "react-native-keyboard-controller"
import { MediaProvider } from "../../../../../context/MediaContext"
import { ClientVerificationProvider } from "../../../../../context/ClientVerificationContext"

const AppointmentLayout = () => {
   return (
      <MediaProvider>
      <KeyboardProvider>
      <ClientVerificationProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}
         />
      </ClientVerificationProvider>
      </KeyboardProvider>
      </MediaProvider>
   )
}

export default AppointmentLayout