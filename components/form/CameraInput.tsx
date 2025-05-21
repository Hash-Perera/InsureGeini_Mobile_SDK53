import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CameraInputProps {
  label: string;
  imageUri: string;
  onPress: () => void;
  onPressFile?: () => void;
  colors: any;
  error?: string;
  touched?: boolean;
}

export default function CameraInput({
  label,
  imageUri,
  onPress,
  onPressFile,
  colors,
  error,
  touched,
}: CameraInputProps) {
  return (
    <>
      <View className="flex-row justify-between items-center p-3 mt-4 rounded-lg border border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-medium text-gray-500">{label}</Text>

          {imageUri && (
            <Image
              source={{
                uri: imageUri,
              }}
              className="w-14 h-8 ms-4"
              resizeMode="contain"
            />
          )}
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className="p-2 bg-gray-200 rounded-md"
            onPress={onPressFile}
          >
            <MaterialIcons
              name="attach-file"
              size={24}
              color={colors["custom-blue1"]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2 bg-blue-100 rounded-md"
            onPress={onPress}
          >
            <MaterialIcons
              name="camera-alt"
              size={24}
              color={colors["custom-blue2"]}
            />
          </TouchableOpacity>
        </View>
      </View>
      {error && touched && (
        <Text className="mt-1 text-sm text-red-500">{error}</Text>
      )}
    </>
  );
}
