import { Stack, useNavigation } from 'expo-router';
import { RegisterProvider } from '../../../context/RegisterContext';
import { useEffect } from 'react';

export default function SignupScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <RegisterProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation:'slide_from_right'
        }} 
      />
    </RegisterProvider>
    
  );
}
