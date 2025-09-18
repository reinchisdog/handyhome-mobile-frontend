import { Stack } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false, // Let child layouts handle headers
    }} />
  );
}