import PrimaryButton from "@/components/form/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const issues = [
  "I can't log in",
  "I can't find my vehicle",
  "I want to cancel my claim",
  "I want to re open my claim",
  "I have a question about my claim",
];

export default function HelpScreen() {
  const navigation = useNavigation();

  const handlePress = (issue: string) => {
    // Navigate to issue detail or handle logic
    console.log("Selected:", issue);
  };

  const handleSubmit = () => {
    // Handle submit logic
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="bg-white flex-1 rounded-t-2xl px-5 pt-4">
        {/* Search */}
        <View className="bg-gray-100 rounded-lg px-4 py-3 flex-row items-center mb-6">
          <Ionicons name="search" size={18} color="#888" className="mr-2" />
          <TextInput
            placeholder="Search FAQs"
            placeholderTextColor="#888"
            className="flex-1 text-sm"
          />
        </View>

        {/* Common Issues */}
        <Text className="text-base font-semibold mb-3">Common issues</Text>
        <FlatList
          data={issues}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row justify-between items-center py-4 border-b border-gray-200"
              onPress={() => handlePress(item)}
            >
              <Text className="text-[15px] text-gray-800">{item}</Text>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </TouchableOpacity>
          )}
        />

        <View className="mt-10 mb-8">
          <PrimaryButton onPress={() => handleSubmit()} text="Contact Us" />
        </View>
      </View>
    </SafeAreaView>
  );
}
