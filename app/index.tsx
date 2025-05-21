import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";

const Home = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Redirect href="./(root)/home" />;
  }
  return <Redirect href={"./(auth)/login"} />;
};

export default Home;
