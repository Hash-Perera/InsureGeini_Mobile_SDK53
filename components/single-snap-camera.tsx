import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import AppLoader from "./apploader";

interface CameraProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
  cardWidth: number;
  cardHeight: number;
  displayText: string;
}

export default function CameraComponent({
  onCapture,
  onClose,
  cardWidth,
  cardHeight,
  displayText,
}: CameraProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  // const [mediaPermission, requestMediaPermission] =
  // MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ensure permissions
  if (!cameraPermission) return <View />;
  if (!cameraPermission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg text-center">
          We need your permission to access the camera and media library
        </Text>
        <TouchableOpacity
          onPress={async () => {
            requestCameraPermission();
            // requestMediaPermission();
          }}
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
          // Crop the image
          const croppedPhoto = await ImageManipulator.manipulateAsync(
            photo.uri,
            [
              {
                crop: {
                  originX: photo.width * ((100 - cardWidth) / 200),
                  originY: photo.height * ((100 - cardHeight) / 200),
                  width: photo.width * (cardWidth / 100),
                  height: photo.height * (cardHeight / 100),
                },
              },
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
          );

          // Save photo to media library
          const asset = await MediaLibrary.createAssetAsync(croppedPhoto.uri);
          onCapture(croppedPhoto.uri);
          setIsLoading(false);
          onClose();
        }
      } catch (error) {
        console.error("Failed to capture and process image:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <View className="flex-1">
      <AppLoader visible={isLoading} message="Prepareing Image..." />

      <View style={{ flex: 5 }} className=" relative overflow-hidden ">
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
              Align the License Here
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
          className="w-16 h-16 bg-black border-4  rounded-full"
        />

        {/* Open Carousel Button */}
        <TouchableOpacity
          onPress={onClose}
          className="items-center justify-center"
          style={{ width: 50, height: 50 }}
        >
          <MaterialIcons name="close" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
