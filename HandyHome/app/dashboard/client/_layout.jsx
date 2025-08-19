// Layout: Client Layout

import { Stack } from 'expo-router';

const ClientLayout = () => {
   return (
      <Stack
        screenOptions={{
        headerShown: false,
        animation: 'simple_push'
        }}
      />
   )
}

export default ClientLayout;