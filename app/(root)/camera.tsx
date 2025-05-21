import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import ImageView from "react-native-image-viewing";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

const cardWidth = 70;
const cardHeight = 40;

export default function CameraComponent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = params.mode as string;
  const photoLimit = params.photoLimit as unknown as number;
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<{ uri: string }[]>([]);
  const [showCarousel, setShowCarousel] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    if (capturedImages.length >= photoLimit) {
      switch (mode) {
        case "NIC_FRONT":
          router.back();
          setTimeout(() => {
            router.setParams({
              NIC_FRONT: capturedImages.map((img) => img.uri),
            });
          }, 1);
          break;
        case "NIC_BACK":
          router.back();
          setTimeout(() => {
            router.setParams({
              NIC_BACK: capturedImages.map((img) => img.uri),
            });
          }, 1);
          break;

        default:
          router.back();
          setTimeout(() => {
            router.setParams({
              image: capturedImages.map((img) => img.uri),
            });
          }, 1);
          break;
      }
    }
  }, [capturedImages]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg text-center">
          We need your permission to access the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
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
    if (!mode || !photoLimit) {
      console.error("Mode or Photo Limit not provided");
      return;
    }

    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });

        if (photo?.uri) {
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

          setCapturedImages((prev) => [...prev, { uri: croppedPhoto.uri }]);
        }
      } catch (error) {
        console.error("Failed to capture and crop image:", error);
      }
    }
  };

  return (
    <View className="flex-1 bg-black">
      {showCarousel ? (
        <ImageView
          images={capturedImages}
          imageIndex={0}
          visible={showCarousel}
          onRequestClose={() => setShowCarousel(false)}
        />
      ) : (
        <>
          <View
            style={{ flex: 5 }}
            className=" relative overflow-hidden rounded-lg"
          >
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
            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="bg-black/50 p-2 rounded-full"
            >
              <MaterialIcons name="flip-camera-ios" size={32} color="white" />
            </TouchableOpacity>

            {/* Capture Button */}
            <TouchableOpacity
              onPress={captureImage}
              className="w-16 h-16 bg-black border-4 border-white/50 rounded-full"
            />

            {/* Open Carousel Button */}
            <TouchableOpacity
              onPress={() => setShowCarousel(true)}
              className="bg-white p-2 rounded-full overflow-hidden items-center justify-center"
              style={{ width: 50, height: 50 }}
            >
              {capturedImages.length > 0 ? (
                <Image
                  source={{ uri: capturedImages[0].uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 50,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <MaterialIcons name="image" size={32} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
