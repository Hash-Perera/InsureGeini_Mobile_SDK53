import { useRouter } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { useEffect, useState } from "react";
import { Claim } from "@/models/claim.model";
import { MaterialIcons } from "@expo/vector-icons";
import AppLoader from "@/components/apploader";

//! Services
import { ClaimService } from "@/services/claim.service";
import { insuranceIcons, statusColors } from "@/constants/geini-colors";

export default function MyClaims() {
  const router = useRouter();

  //! Get claims from the server
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //! Fetch claims from the server
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await ClaimService.getClaims();
        setClaims(response.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const onItemPress = (id: string) => {
    router.push(`/${id}` as any);
  };

  const getRandomIcon = () => {
    return insuranceIcons[Math.floor(Math.random() * insuranceIcons.length)];
  };

  return (
    <SafeAreaView className="flex-1">
      <AppLoader visible={isLoading} message="Receiving claims..." />
      <FlatList
        data={claims}
        keyExtractor={(item) => item._id as string}
        renderItem={({ item }) => {
          const statusStyle = statusColors[item.status ?? "default"];

          return (
            <TouchableOpacity
              className="bg-white p-6 rounded-lg shadow-sm flex-row items-center mb-4 relative"
              onPress={() => onItemPress(item._id as string)}
            >
              {/* Left Icon */}
              <MaterialIcons name={getRandomIcon()} size={36} color="#1978bb" />

              {/* Claim Details */}
              <View className="ml-4 flex-1 mt-6">
                <Text className="text-lg font-semibold">
                  Claim #{item._id?.slice(-6)}
                </Text>
                <Text className="text-gray-500">
                  Insurance ID: {item.insuranceId}
                </Text>
                <Text className="text-gray-500">
                  Filed on:{" "}
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>

              <View
                className={`absolute top-3 right-3 px-3 py-1 rounded-lg`}
                style={{ backgroundColor: statusStyle.bg }}
              >
                <Text
                  className={`font-semibold`}
                  style={{ color: statusStyle.text }}
                >
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}
