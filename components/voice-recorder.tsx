import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const recordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: 2, // MPEG_4
    audioEncoder: 3, // AAC
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".m4a",
    audioQuality: 0, // High quality
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
    numberOfAudioChannels: 2,
    sampleRate: 44100,
  },
};

interface VoiceRecorderProps {
  setFormState: React.Dispatch<React.SetStateAction<any>>;
  onPressFile: () => void;
  colors?: string;
}

export default function VoiceRecorder({
  setFormState,
  onPressFile,
  colors,
}: VoiceRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [waveBars, setWaveBars] = useState<number[]>([]);
  const [playbackProgress, setPlaybackProgress] = useState(0); // Progress of audio
  const [playedSeconds, setPlayedSeconds] = useState(0); // Played time in seconds
  const [recordingSeconds, setRecordingSeconds] = useState(0); // Recording time in seconds

  const scrollViewRef = useRef<ScrollView>(null);
  const intervalMap = useRef<Map<Audio.Recording, NodeJS.Timeout>>(new Map()); // Map to track intervals for recordings

  // Start recording
  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission required", "Please grant audio permissions.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      setRecording(recording);
      setWaveBars([]); // Reset wave bars when a new recording starts
      setRecordingSeconds(0); // Reset the recording timer

      // Start recording timer
      const interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Store the interval in the map
      intervalMap.current.set(recording, interval);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      if (!recording) return;

      // Clear the interval for this recording
      const interval = intervalMap.current.get(recording);
      if (interval) {
        clearInterval(interval);
        intervalMap.current.delete(recording);
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      // Update the form state with the audio URI
      setFormState((prev: any) => ({
        ...prev,
        audio: uri, // This will update the audio in the parent component's state
      }));
      setRecordingUri(uri);
      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  // Play recording
  const playRecording = async () => {
    try {
      if (!recordingUri) return;

      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          const progress = status.durationMillis
            ? status.positionMillis / status.durationMillis
            : 0;
          setPlaybackProgress(progress);
          setPlayedSeconds(Math.floor(status.positionMillis / 1000));

          // Automatically scroll to match the playback progress
          if (scrollViewRef.current) {
            const totalBars = waveBars.length;
            const scrollPosition = progress * totalBars * 6 - 50; // 6 is approx bar width+spacing
            scrollViewRef.current.scrollTo({
              x: scrollPosition,
              animated: true,
            });
          }

          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error("Failed to play recording:", error);
    }
  };

  const deleteRecording = async () => {
    try {
      // Stop and unload the sound if it's playing
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      // Clear the state
      setRecordingUri(null);
      setWaveBars([]);
      setPlaybackProgress(0);
      setPlayedSeconds(0);
      setRecordingSeconds(0);

      Alert.alert("Deleted", "Recording has been deleted.");
    } catch (error) {
      console.error("Failed to delete recording:", error);
    }
  };

  // Stop playback
  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  // Generate wave bars dynamically during recording
  useEffect(() => {
    if (recording) {
      const interval = setInterval(() => {
        setWaveBars((prev) => [...prev, Math.random() * 50 + 10]); // Add random bar height
        scrollViewRef.current?.scrollToEnd({ animated: true }); // Auto-scroll to the end during recording
      }, 500); // Add a new bar every 500ms

      return () => clearInterval(interval);
    }
  }, [recording]);

  // Cleanup sound object on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }

      // Clear all intervals in the map
      intervalMap.current.forEach((interval) => clearInterval(interval));
      intervalMap.current.clear();
    };
  }, [sound]);

  return (
    <View className="flex-1 justify-center items-center p-1 mt-5 rounded-lg bg-gray200">
      {/* Main Row Container */}
      <View className="flex-row justify-between items-center">
        {/* Buttons Section */}
        <View className="flex-row space-x-4">
          {!recordingUri && !recording && (
            <TouchableOpacity
              className="p-4 bg-blue-500 rounded-full"
              onPress={startRecording}
            >
              <MaterialIcons name="mic" size={12} color="white" />
            </TouchableOpacity>
          )}

          {recording && (
            <TouchableOpacity
              className="p-4 bg-red-500 rounded-full"
              onPress={stopRecording}
            >
              <MaterialIcons name="stop" size={12} color="white" />
            </TouchableOpacity>
          )}

          {recordingUri && !recording && (
            <>
              <TouchableOpacity
                className="p-4 bg-green-500 rounded-full"
                onPress={isPlaying ? stopPlayback : playRecording}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={12}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                className="p-4 bg-gray-500 rounded-full"
                onPress={() => {
                  deleteRecording();
                }}
              >
                <Ionicons name="trash" size={12} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Wave Animation Section */}
        <View className="overflow-hidden flex-1 p-2 ml-4 h-14 bg-gray-100 rounded-lg">
          <ScrollView
            horizontal
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              {waveBars.map((height, index) => {
                const isPlayed = index < playbackProgress * waveBars.length;
                return (
                  <View
                    key={index}
                    style={{
                      width: 4,
                      height,
                      backgroundColor: isPlayed ? "#00ff00" : "#007bff", // Played portion is green
                      borderRadius: 2,
                      marginHorizontal: 2,
                    }}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity
          className="p-4 bg-gray-200 rounded-full"
          onPress={onPressFile}
        >
          <MaterialIcons
            name="attach-file"
            size={24}
            color={colors ?? "#007AFF"} // Default color if colors is not provided
          />
        </TouchableOpacity>
      </View>

      {/* Timers */}
      {recording && (
        <Text className="mt-2 text-gray-600">
          Recording: {recordingSeconds}s
        </Text>
      )}

      {recordingUri && !recording && (
        <Text className="mt-2 text-gray-600">Played: {playedSeconds}s</Text>
      )}
    </View>
  );
}
