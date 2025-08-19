// Layout: Appointment Process Layout

// Imports
// React and Expo Components
import { Stack } from "expo-router"
// Contexts
import { AppointmentProvider } from "../../../../context/AppointmentContext"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { CameraProvider } from "../../../../context/CameraContext"

const AppointmentLayout = () => {
   return (
      <CameraProvider>
      <KeyboardProvider>
      <AppointmentProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}
         />
      </AppointmentProvider>
      </KeyboardProvider>
      </CameraProvider>
   )
}

export default AppointmentLayout