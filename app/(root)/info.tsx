import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Info() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="px-6">
        {/* About Section */}
        {/* <View className="bg-white p-5 rounded-xl shadow mb-6"> */}
        <Text className="text-xl font-bold mb-2 text-gray-900">
          About InsureGeini
        </Text>
        <Text className="text-gray-600 text-sm mt-2">
          InsureGeini is a mobile app designed to simplify and expedite the
          vehicle insurance claims process. Our goal is to provide a seamless,
          user-friendly experience that empowers users to manage their claims
          efficiently and transparently.
        </Text>

        <Text className="text-lg font-semibold mb-3 text-gray-900 mt-12">
          How it Works
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-4"
        >
          <View className="flex-row items-center gap-4 px-4">
            {/* Step 1 */}
            <View className="items-center">
              <MaterialIcons name="camera-alt" size={22} color="#2563eb" />
              <Text className="text-sm text-gray-700 mt-1">Capture</Text>
            </View>

            {/* Arrow */}
            <MaterialIcons name="arrow-forward-ios" size={20} color="#9ca3af" />

            {/* Step 3 */}
            <View className="items-center">
              <MaterialIcons name="send" size={22} color="#f59e0b" />
              <Text className="text-sm text-gray-700 mt-1">Submit</Text>
            </View>

            {/* Arrow */}
            <MaterialIcons name="arrow-forward-ios" size={20} color="#9ca3af" />

            {/* Step 2 */}
            <View className="items-center">
              <MaterialCommunityIcons name="robot" size={22} color="#10b981" />
              <Text className="text-sm text-gray-700 mt-1">AI Analysis</Text>
            </View>

            {/* Arrow */}
            <MaterialIcons name="arrow-forward-ios" size={20} color="#9ca3af" />

            {/* Step 4 */}
            <View className="items-center">
              <MaterialIcons name="check-circle" size={22} color="#4ade80" />
              <Text className="text-sm text-gray-700 mt-1">Result</Text>
            </View>
          </View>
        </ScrollView>

        <Text className="text-lg font-semibold mb-4 text-gray-900 mt-10">
          App Features
        </Text>
        <View className="flex-row flex-wrap gap-4 mt-2">
          {[
            { icon: "camera-alt", label: "Camera Input" },
            { icon: "smart-toy", label: "AI Detection" },
            { icon: "location-pin", label: "Tracking" },
            { icon: "upload-file", label: "Claim Submission" },
            { icon: "verified-user", label: "Fraud Prevention" },
          ].map((feature, idx) => (
            <View
              key={idx}
              className="flex-row items-center px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <MaterialIcons
                name={feature.icon as any}
                size={16}
                color="#2563eb"
              />
              <Text className="ml-2 text-blue-900 font-medium">
                {feature.label}
              </Text>
            </View>
          ))}
        </View>

        <Text className="text-lg font-semibold mb-3 text-gray-900 mt-12">
          Data Privacy & Security
        </Text>
        <View className="space-y-4">
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="security" size={24} color="#8b5cf6" />
            <Text className="text-gray-700">
              Data is encrypted and securely stored.
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="policy" size={24} color="#0ea5e9" />
            <Text className="text-gray-700">
              We follow strict privacy policies.
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="verified" size={24} color="#10b981" />
            <Text className="text-gray-700">
              Regular security audits ensure safety.
            </Text>
          </View>
        </View>
        {/* </View> */}

        {/* Footer */}
        <View className="items-center py-4 mt-14">
          <Text className="text-sm text-gray-500 mb-1">Version 2.0.0</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://insuregeini.com/terms")}
          >
            <Text className="text-sm text-blue-500 underline">
              Terms & Conditions | Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
