/* --------------------------------- Imports -------------------------------- */
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { AppDataProvider } from '../context/AppDataContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default RootLayout = () => {
  return (
      <AuthProvider>
        <AppDataProvider>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false
              }}
            />
          </SafeAreaProvider>
        </AppDataProvider>
      </AuthProvider>
  );
}