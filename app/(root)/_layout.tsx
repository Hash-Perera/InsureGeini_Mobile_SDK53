import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{ headerShown: false, headerTitle: "Home" }}
      />

      <Stack.Screen
        name="camera"
        options={{ headerShown: true, headerTitle: "Camera" }}
      />
      <Stack.Screen
        name="support"
        options={{ headerShown: true, headerTitle: "Support" }}
      />

      <Stack.Screen
        name="info"
        options={{ headerShown: true, headerTitle: "Info" }}
      />

      <Stack.Screen name="(claim)" options={{ headerShown: false }} />
    </Stack>
  );
}
