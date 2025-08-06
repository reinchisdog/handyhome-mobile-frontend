import { Stack, useNavigation } from 'expo-router';
import { SignupProvider } from '../../../context/SignupContext';
import { useEffect } from 'react';

export default function SignupScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <SignupProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation:'slide_from_right'
        }} 
      />
    </SignupProvider>
    
  );
}
