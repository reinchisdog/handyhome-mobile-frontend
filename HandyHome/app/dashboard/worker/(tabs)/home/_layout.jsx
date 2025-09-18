// Layout: Home Layout

// Imports
import { Stack, useSegments, useNavigation } from 'expo-router';
import { useEffect } from 'react';

const HomeLayout = () => {
   const segments = useSegments();
   const navigation = useNavigation();

   return (
      <Stack
      screenOptions={{
         animation: 'fade_from_bottom',
         headerShown: false, 
      }}
      >
         
      </Stack>
   )
}

export default HomeLayout
