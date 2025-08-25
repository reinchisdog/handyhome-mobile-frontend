// Layout: Client Layout

import { Stack } from 'expo-router';
import { AppointmentProvider } from '../../../context/AppointmentContext';

const ClientLayout = () => {
   return (
      <AppointmentProvider>
         <Stack
         screenOptions={{
            headerShown: false,
            animation: 'simple_push'
         }}
         />
      </AppointmentProvider>
   )
}

export default ClientLayout;