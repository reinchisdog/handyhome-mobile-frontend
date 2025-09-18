// Layout: Appointment Process Layout

// Imports
// React and Expo Components
import { Stack } from "expo-router"
// Contexts
import { KeyboardProvider } from "react-native-keyboard-controller"
import { MediaProvider } from "../../../../context/MediaContext"

const AppointmentLayout = () => {
   return (
      <MediaProvider>
      <KeyboardProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}
         />
      </KeyboardProvider>
      </MediaProvider>
   )
}

export default AppointmentLayout