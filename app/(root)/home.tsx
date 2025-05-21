import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ClaimService } from "@/services/claim.service";
const tailwindConfig = require("../../tailwind.config");
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const { logout } = useAuth();
  const router = useRouter();
  const colors = tailwindConfig.theme.extend.colors;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem("userDetails");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    fetchUserData();
  }, []);

  const handleProfile = () => {
    console.log("Profile button pressed");
  };

  const cards = [
    { id: 1, icon: "assignment", label: "Claim", route: "/claim" },
    { id: 2, icon: "history", label: "My Claims", route: "/my-claims" },
    { id: 3, icon: "support-agent", label: "Support", route: "/claim" },
    { id: 4, icon: "info-outline", label: "Info", route: "/claim" },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Gradient Background */}
      <LinearGradient
        colors={[colors["custom-blue1"], colors["custom-blue2"], "white"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} // Vertical gradient
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-col w-full p-4 h-96">
          {/* Header with Logout and Profile Buttons */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="p-2 text-4xl font-bold text-white">Welcome!</Text>
            <View className="flex-row">
              <TouchableOpacity onPress={logout} className="p-2">
                <MaterialIcons name="logout" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleProfile} className="p-2">
                <MaterialIcons name="account-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="p-2 mb-4">
            <Text className="text-2xl font-semibold text-white">
              Hello, {user?.user?.name}
            </Text>
            <Text className="text-lg text-white">
              Insurance ID: {user?.user?.insuranceId}
            </Text>

            {/* <Image
              source={require("@/assets/images/DashboardAnimation.gif")}
              className="w-52 h-52 mb-4"
              resizeMode="contain"
            /> */}
          </View>

          {/* <View className="hidden p-4 rounded-lg bg-white/20">
            <Text className="mb-2 text-xl font-semibold text-white">
              Vehicle Details
            </Text>
            <Text className="text-lg text-white">Vehicle No: KM7537</Text>
            <Text className="text-lg text-white">Vehicle Model: Alto</Text>
          </View> */}
        </View>

        {/* Main Content */}
        <View className="items-center justify-center flex-1 bg-white">
          {/* Card Grid */}
          <View className="flex-row flex-wrap justify-center w-full gap-4 px-4">
            {cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                className="items-center justify-center w-40 h-40 p-4 rounded-lg bg-gray100"
                onPress={() => router.navigate(card.route as any)}
              >
                {/* Icon with Correct Type Casting */}
                <MaterialIcons
                  name={card.icon as keyof typeof MaterialIcons.glyphMap}
                  size={46}
                  color="#1978bb"
                />

                {/* Label */}
                <Text className="mt-2 font-medium text-gray800">
                  {card.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Button
        <TouchableOpacity
          onPress={ClaimService.getClaims}
          className="items-center justify-center p-8 bg-blue-500"
        >
          <Text className="text-white">Claim Now</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    </View>
  );
}
