import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

interface AppLoaderProps {
  visible: boolean;
  message?: string;
}

const AppLoader: React.FC<AppLoaderProps> = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <ActivityIndicator size="large" color="#FFFFFF" />
      {message && <Text className="text-white mt-4">{message}</Text>}
    </View>
  );
};

export default AppLoader;
