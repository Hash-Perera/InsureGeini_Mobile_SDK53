import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ClaimCardItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

interface ClaimCardListProps {
  data: ClaimCardItem[];
}

export default function ClaimCardList({ data }: ClaimCardListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id} // ✅ `id` is already a string
      renderItem={({ item }) => (
        <TouchableOpacity
          className="bg-white p-8 rounded-lg shadow-slate-50 flex-row items-center mb-4"
          onPress={item.onPress}
        >
          <MaterialIcons
            name={item.icon as keyof typeof MaterialIcons.glyphMap}
            size={32}
            color="#1978bb"
          />
          <View className="ml-4">
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Text className="text-gray-500">{item.subtitle}</Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
