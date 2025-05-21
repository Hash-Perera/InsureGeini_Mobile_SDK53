import { Stack } from "expo-router";

export default function ClaimLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="claim"
        options={{ headerShown: true, headerTitle: "New Claim" }}
      />
      <Stack.Screen
        name="my-claims"
        options={{ headerShown: true, headerTitle: "My Claims" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ headerShown: true, headerTitle: "Claim Details" }}
      />
    </Stack>
  );
}
