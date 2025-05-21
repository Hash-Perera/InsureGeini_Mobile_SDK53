import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import InputField from "@/components/form/InputField";
import PrimaryButton from "@/components/form/PrimaryButton";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "expo-router";
import AppLoader from "@/components/apploader";
import Toast from "react-native-toast-message";
import { AuthService } from "@/services/auth.service";

const LoginSchema = Yup.object().shape({
  insuranceId: Yup.string().required("Insurance Number is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const authService = AuthService;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <SafeAreaView className="bg-general-500 flex-1 justify-center items-center">
          <AppLoader visible={isLoading} message="Logging in..." />

          <Image
            source={require("@/assets/images/InsureGeini.png")}
            className="w-52 h-52 mb-4"
            resizeMode="contain"
          />

          {/* Welcome Text */}
          <View className="mb-6 items-center">
            <Text className="text-xl font-bold text-gray800">Welcome!</Text>
          </View>

          <Formik
            initialValues={{ insuranceId: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
              setIsLoading(true);

              authService
                .login(values)
                .then((res) => {
                  login(res.data);
                  Toast.show({
                    type: "success",
                    text1: "Login Successful 🎉",
                    position: "top",
                    visibilityTime: 4000,
                    topOffset: 50,
                    props: { onPress: () => router.push("/home") },
                  });
                  router.replace("/home");
                })
                .catch((err) => {
                  console.log(err);
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View className="w-4/5">
                <InputField
                  label="Insurance ID"
                  placeholder="Enter your insurance Id"
                  value={values.insuranceId}
                  onChangeText={handleChange("insuranceId")}
                  error={errors.insuranceId}
                  touched={touched.insuranceId}
                />

                <InputField
                  label="Password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  error={errors.password}
                  touched={touched.password}
                />

                <View className="mt-8">
                  <PrimaryButton onPress={() => handleSubmit()} text="Login" />
                </View>
              </View>
            )}
          </Formik>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
