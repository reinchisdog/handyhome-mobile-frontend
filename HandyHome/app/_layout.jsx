/* --------------------------------- Imports -------------------------------- */
import { Stack } from 'expo-router';
import { UserProvider } from '../context/UserContext';
import { useCustomFonts } from '../assets/fonts/index';


export default RootLayout = () => {
  const [fontsLoaded] = useCustomFonts();

  return (
      <UserProvider>
        <Stack
          screenOptions={{
            headerShown: false
          }}
        />
      </UserProvider>
  );
}