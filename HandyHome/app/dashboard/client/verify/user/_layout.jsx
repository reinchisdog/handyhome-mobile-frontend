// Layout: Appointment Process Layout

// Imports
// React and Expo Components
import { Stack } from "expo-router"
// Contexts
import { KeyboardProvider } from "react-native-keyboard-controller"
import { CameraProvider } from "../../../../../context/CameraContext"
import { ClientVerificationProvider } from "../../../../../context/ClientVerificationContext"

const AppointmentLayout = () => {
   return (
      <CameraProvider>
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
      </CameraProvider>
   )
}

export default AppointmentLayout