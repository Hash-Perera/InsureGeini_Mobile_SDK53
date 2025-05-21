import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import AppLoader from "./apploader";

interface CameraProps {
  onClose: () => void;
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  cardWidth: number;
  cardHeight: number;
  displayText: string;
}

export default function MultiImageCameraComponent({
  onClose,
  onImagesChange,
  initialImages = [],
  cardWidth,
  cardHeight,
  displayText,
}: CameraProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]); // Store multiple images

  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(initialImages);
    }
  }, [initialImages]);

  // Ensure permissions
  if (!cameraPermission) return <View />;
  if (!cameraPermission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg text-center">
          We need your permission to access the camera
        </Text>
        <TouchableOpacity
          onPress={() => requestCameraPermission()}
          className="bg-blue-500 px-4 py-2 rounded-md mt-4"
        >
          <Text className="text-white text-lg">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
        setIsLoading(true);

        if (photo?.uri) {
          const updatedImages = [...images, photo.uri];
          setImages(updatedImages);
          onImagesChange(updatedImages);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to capture image:", error);
        setIsLoading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    Alert.alert("Confirm", "Do you want to delete this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedImages = images.filter((_, i) => i !== index);
          setImages(updatedImages);
          onImagesChange(updatedImages); // Notify parent component
        },
      },
    ]);
  };

  return (
    <View className="flex-1">
      <AppLoader visible={isLoading} message="Processing Image..." />

      <View style={{ flex: 5 }} className="relative overflow-hidden">
        <CameraView
          ref={cameraRef}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          facing={facing}
          className="rounded-lg overflow-hidden"
        >
          {/* Top Blur */}
          <BlurView
            intensity={50}
            tint="dark"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${(100 - cardHeight) / 2}%`,
              backgroundColor: "transparent",
            }}
          />

          {/* Bottom Blur */}
          <BlurView
            intensity={50}
            tint="dark"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${(100 - cardHeight) / 2}%`,
              backgroundColor: "transparent",
            }}
          />

          {/* Left Blur */}
          <BlurView
            intensity={50}
            tint="dark"
            style={{
              position: "absolute",
              top: `${(100 - cardHeight) / 2}%`,
              bottom: `${(100 - cardHeight) / 2}%`,
              left: 0,
              width: `${(100 - cardWidth) / 2}%`,
              backgroundColor: "transparent",
            }}
          />

          {/* Right Blur */}
          <BlurView
            intensity={50}
            tint="dark"
            style={{
              position: "absolute",
              top: `${(100 - cardHeight) / 2}%`,
              bottom: `${(100 - cardHeight) / 2}%`,
              right: 0,
              width: `${(100 - cardWidth) / 2}%`,
              backgroundColor: "transparent",
            }}
          />

          {/* Frame Overlay (Clear Area) */}
          <View
            style={{
              width: `${cardWidth}%`,
              height: `${cardHeight}%`,
              borderWidth: 3,
              borderColor: "yellow",
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              zIndex: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                marginTop: -25,
              }}
            >
              {displayText}
            </Text>
          </View>
        </CameraView>
      </View>

      {/* Controls */}
      <View className="flex-1 flex-row justify-around items-center w-full">
        {/* Flip Camera Button */}
        <TouchableOpacity onPress={toggleCameraFacing}>
          <MaterialIcons name="flip-camera-ios" size={32} color="black" />
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity
          onPress={isLoading ? undefined : captureImage}
          className="w-14 h-14 bg-black border-4 rounded-full"
        />

        {/* Close Camera Button */}
        <TouchableOpacity
          onPress={onClose}
          className="items-center justify-center"
          style={{ width: 50, height: 50 }}
        >
          <MaterialIcons name="close" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable Image List */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          className="w-full h-24 mt-2 bg-gray-200"
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 10,
          }}
          showsHorizontalScrollIndicator={false}
        >
          {images.map((uri, index) => (
            <View key={index} className="mr-4 relative">
              <Image
                source={{ uri }}
                className="w-20 h-20 rounded-md"
                style={{ resizeMode: "cover" }}
              />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full"
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
