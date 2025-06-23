/* --------------------------------- Imports -------------------------------- */
import { Stack } from 'expo-router';
import { ClientVerificationProvider } from '../../../../context/ClientVerificationContext';

export default ClientVerifyLayout = () => {

  return (
    <ClientVerificationProvider>
      <Stack
        screenOptions={{
        headerShown: false
        }}
      />
    </ClientVerificationProvider>
  );
}