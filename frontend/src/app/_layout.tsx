import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false, // Hides the default ugly top header
        contentStyle: { backgroundColor: '#f3f4f6' }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="dashboard" />
      {/* We use a 'modal' presentation for the checkin screen for a polished UX */}
      <Stack.Screen name="checkin" options={{ presentation: 'modal' }} />
    </Stack>
  );
}