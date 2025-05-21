import { Claim, Report } from "@/models/claim.model";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  TextInput,
  Modal,
  Button,
  ActivityIndicator,
} from "react-native";
import AppLoader from "@/components/apploader";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

//! Services
import { ClaimService } from "@/services/claim.service";
import { FeedbackService } from "@/services/feedback.service";
import MapView, { Marker } from "react-native-maps";
import React from "react";
import { statusColors } from "@/constants/geini-colors";
import { Formik } from "formik";
import * as Yup from "yup";

export default function ClaimDetails() {
  const { id } = useLocalSearchParams();

  //! Get claims from the server
  const [claim, setClaim] = useState<Claim>({});
  const [report, setReport] = useState<Report | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const suggestedFeedbacks = [
    "The claims process was quick and hassle-free!",
    "The support team was very helpful and responsive.",
    "The service was okay, nothing special.",
    "The instructions for filing a claim were unclear.",
    "The support team guided me through every step patiently.",
    "I got my claim processed, but it took some time.",
    "unhappy with the policy coverage options.",
  ];

  //! Fetch claims from the server
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await ClaimService.getClaimById(id as string);
        setClaim(response.data.data);
        setReport(response.data.report);

        // Fetch feedback for the report if available
        if (response.data.report?._id) {
          const feedbackResponse = await FeedbackService.getFeedbackById(
            response.data.report._id
          );
          setFeedback(feedbackResponse.data?.data?.feedback || null);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const fetchfeedback = async () => {
    if (!report?._id) return;
    try {
      const feedbackResponse = await FeedbackService.getFeedbackById(
        report._id
      );
      setFeedback(feedbackResponse.data?.data?.feedback || null);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    if (feedbackSubmitted) {
      fetchfeedback();
    }
  }, [feedbackSubmitted]);

  //! Feedback validation schema
  const feedbackSchema = Yup.object().shape({
    feedback: Yup.string()
      .required("Feedback is required")
      .min(5, "Feedback must be at least 5 characters"),
  });

  //! Handle feedback submission
  const handleSubmitFeedback = async (
    values: { feedback: string },
    { resetForm }: any
  ) => {
    setSubmitting(true);
    try {
      await FeedbackService.submitFeedback({
        feedback: values.feedback,
        reportId: report?._id,
      });
      setFeedbackSubmitted(true);
      resetForm();
      setTimeout(() => {
        setFeedbackSubmitted(false);
        setFeedbackModalVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <AppLoader visible={isLoading} message="Loading..." />
      <ScrollView className="flex-1 p-5 bg-gray-100">
        <View className="p-5 mb-4 bg-white rounded-lg shadow-md">
          <Text className="text-lg font-bold text-gray-800">
            Claim ID: {claim._id}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text
              className="px-3 py-1 text-xs font-bold rounded-full"
              style={{
                backgroundColor: statusColors[claim.status || "default"].bg,
                color: statusColors[claim.status || "default"].text,
              }}
            >
              {claim.status}
            </Text>
          </View>
        </View>

        {/* Insurance Info */}
        <View className="p-5 mb-4 bg-white rounded-lg shadow-md">
          <Text className="mb-2 text-lg font-semibold text-gray-800">
            Insurance Details
          </Text>
          <Text className="text-gray-600">
            🔹 Insurance ID: {claim.insuranceId}
          </Text>
          <Text className="text-gray-600">🆔 NIC No: {claim.nicNo}</Text>
          <Text className="text-gray-600">
            🚗 License No: {claim.drivingLicenseNo}
          </Text>
        </View>

        {/* Damage Details */}
        <View className="p-5 mb-4 bg-white rounded-lg shadow-md">
          <Text className="mb-2 text-lg font-semibold text-gray-800">
            Damage Details
          </Text>
          <Text className="text-gray-600">
            🔹 Damaged Areas:{" "}
            {claim.damagedAreas ? claim.damagedAreas.join(", ") : "N/A"}
          </Text>
          <Text className="text-gray-600">
            🔹 OBD Codes: {claim.obdCodes ? claim.obdCodes : "N/A"}
          </Text>

          {/* Map */}
          {claim.location && (
            <MapView
              style={{ height: 150, borderRadius: 10, marginTop: 10 }}
              initialRegion={{
                latitude: claim.location.latitude,
                longitude: claim.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: claim.location.latitude,
                  longitude: claim.location.longitude,
                }}
                title="Accident Location"
              />
            </MapView>
          )}
        </View>

        {/* Image Sections */}
        <View className="p-5 mb-4 bg-white rounded-lg shadow-md">
          <Text className="mb-2 text-lg font-semibold text-gray-800">
            Uploaded Images
          </Text>

          {/* Insurance Images */}
          <Text className="font-medium text-gray-600">
            📄 Insurance Documents
          </Text>
          <View className="flex-row gap-2 mt-2">
            <Image
              source={{ uri: claim.insuranceFront }}
              className="w-24 h-24 rounded-md"
            />
            <Image
              source={{ uri: claim.insuranceBack }}
              className="w-24 h-24 rounded-md"
            />
          </View>

          {/* NIC Images */}
          <Text className="mt-4 font-medium text-gray-600">
            🆔 NIC Documents
          </Text>
          <View className="flex-row gap-2 mt-2">
            <Image
              source={{ uri: claim.nicFront }}
              className="w-24 h-24 rounded-md"
            />
            <Image
              source={{ uri: claim.nicBack }}
              className="w-24 h-24 rounded-md"
            />
          </View>

          {/* License Images */}
          <Text className="mt-4 font-medium text-gray-600">
            🚗 License Documents
          </Text>
          <View className="flex-row gap-2 mt-2">
            <Image
              source={{ uri: claim.drivingLicenseFront }}
              className="w-24 h-24 rounded-md"
            />
            <Image
              source={{ uri: claim.drivingLicenseBack }}
              className="w-24 h-24 rounded-md"
            />
          </View>

          {/* Vehicle Images */}
          <Text className="mt-4 font-medium text-gray-600">
            🚘 Vehicle Details
          </Text>
          <View className="flex-row gap-2 mt-2">
            <Image
              source={{ uri: claim.frontLicencePlate }}
              className="w-24 h-24 rounded-md"
            />
            <Image
              source={{ uri: claim.backLicencePlate }}
              className="w-24 h-24 rounded-md"
            />
          </View>

          {/* Damage Images */}
          <Text className="mt-4 font-medium text-gray-600">
            ⚠️ Damage Images
          </Text>
          <FlatList
            horizontal
            data={claim.damageImages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                className="w-24 h-24 m-2 rounded-md"
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Report */}
        {report && (
          <View className="p-5 mb-4 bg-white rounded-lg shadow-md">
            <Text className="mb-2 text-lg font-semibold text-gray-800">
              Reports
            </Text>
            <Text className="text-gray-600">
              Status :
              {report?.status === "Approved" ? (
                <Text className="font-semibold text-green-500"> Approved </Text>
              ) : (
                <Text className="text-red-500"> Rejected </Text>
              )}
            </Text>
            {/* Incident report PDF */}

            <Text className="mt-2 font-medium text-gray-600">
              📄 Incident Report
            </Text>
            {/* download pdf */}
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(report?.incidentReport);
              }}
              className="flex-row items-center mt-2"
            >
              <Text className="text-blue-500">View PDF</Text>
            </TouchableOpacity>

            <Text className="mt-2 font-medium text-gray-600">
              📄 Decision Report
            </Text>
            {/* download pdf */}
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(report?.decisionReport);
              }}
              className="flex-row items-center mt-2"
            >
              <Text className="text-blue-500">View PDF</Text>
            </TouchableOpacity>

            {/* Show feedback if available, otherwise show Give Feedback button */}
            {feedback ? (
              <View className="mt-4 p-4 bg-gray-100 rounded-lg">
                <Text className="text-gray-700 font-semibold">
                  My Feedback:
                </Text>
                <Text className="text-gray-600 mt-1">{feedback}</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setFeedbackModalVisible(true)}
                className="px-4 py-2 mt-4 bg-blue-500 rounded-lg flex-row items-center justify-center"
              >
                <MaterialIcons
                  name="feedback"
                  size={20}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white text-center text-lg font-semibold">
                  Give Feedback
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      {/* Feedback Modal */}
      <Modal
        visible={feedbackModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
          <View className="p-6 bg-white rounded-lg w-11/12 shadow-lg">
            {!feedbackSubmitted ? (
              <Formik
                initialValues={{ feedback: selectedFeedback }}
                validationSchema={feedbackSchema}
                onSubmit={handleSubmitFeedback}
              >
                {({
                  handleChange,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <>
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="text-lg font-semibold">
                        Provide Feedback
                      </Text>
                      <TouchableOpacity
                        onPress={() => setFeedbackModalVisible(false)}
                      >
                        <AntDesign name="close" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-gray-600 mb-6">
                      Your feedback is valuable to us!
                    </Text>
                    <FlatList
                      horizontal
                      data={suggestedFeedbacks}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          className={`px-4 py-2 m-1 rounded-lg ${
                            selectedFeedback === item
                              ? "bg-blue-500"
                              : "bg-gray-200"
                          }`}
                          onPress={() => {
                            setSelectedFeedback(item);
                            setFieldValue("feedback", item);
                          }}
                        >
                          <Text
                            className={`${
                              selectedFeedback === item
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                      showsHorizontalScrollIndicator={false}
                    />
                    <TextInput
                      className="border border-gray-300 p-3 rounded-md w-full text-base mt-4"
                      placeholder="Enter your feedback"
                      value={values.feedback}
                      onChangeText={handleChange("feedback")}
                      multiline
                    />
                    {touched.feedback && errors.feedback && (
                      <Text className="text-red-500 mt-1">
                        {errors.feedback}
                      </Text>
                    )}
                    <View className="mt-6">
                      <TouchableOpacity
                        className="w-full px-4 py-2 bg-blue-500 rounded-lg mb-2 flex items-center"
                        onPress={() => handleSubmit()}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-white font-semibold text-center">
                            Submit
                          </Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="w-full px-4 py-2 bg-gray-300 rounded-lg"
                        onPress={() => setFeedbackModalVisible(false)}
                      >
                        <Text className="text-gray-700 font-semibold text-center">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            ) : (
              <View className="flex items-center">
                <MaterialIcons name="check-circle" size={48} color="green" />
                <Text className="text-lg font-semibold text-center mt-4">
                  Thank you for your feedback!
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
