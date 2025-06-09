import { Stack, useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function SignupScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <Stack
    screenOptions={{
        headerShown: false,
        animation:'slide_from_right'
    }} 
    />
    
  );
}
