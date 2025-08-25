// Layout: Appointment Process Layout

// Imports
// React and Expo Components
import { Stack } from "expo-router"
// Contexts
import { KeyboardProvider } from "react-native-keyboard-controller"
import { CameraProvider } from "../../../../context/CameraContext"

const AppointmentLayout = () => {
   return (
      <CameraProvider>
      <KeyboardProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}
         />
      </KeyboardProvider>
      </CameraProvider>
   )
}

export default AppointmentLayout