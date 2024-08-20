import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false, headerShown:false }}/>
      <Stack.Screen name="(login)" options={{ gestureEnabled: false, headerShown:false }}/>
    </Stack>
  );
}
