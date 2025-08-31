// Layout: Home Layout

// Imports
import { Stack, useSegments, useNavigation } from 'expo-router';
import { DiyProvider } from '../../../../../context/DiyContext';

const DiyLayout = () => {
   return (
      <DiyProvider>
         <Stack
            screenOptions={{
            animation: 'fade_from_bottom',
            headerShown: false, 
            }}
         />
      </DiyProvider>
   )
}

export default DiyLayout
