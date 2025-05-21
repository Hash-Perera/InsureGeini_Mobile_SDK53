import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type User = {
  insuranceId: string;
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
};

interface AuthContextProps {
  isLoggedIn: boolean;
  userDetails: { role: string; token: string; user: User } | null;
  login: (details: {
    role: string;
    token: string;
    user: User;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    role: string;
    token: string;
    user: User;
  } | null>(null);

  useEffect(() => {
    // Load login state and user details from storage
    const loadAuthState = async () => {
      const storedUserDetails = await AsyncStorage.getItem("userDetails");
      console.log("This is load auth state");
      console.log(storedUserDetails);
      if (storedUserDetails) {
        setUserDetails(JSON.parse(storedUserDetails));
        setIsLoggedIn(true);
        // Navigate to Home if credentials exist
        router.replace("/home");
      }
    };

    loadAuthState();
  }, []);

  const login = async (details: {
    role: string;
    token: string;
    user: User;
  }) => {
    await AsyncStorage.setItem("userDetails", JSON.stringify(details));
    setUserDetails(details);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userDetails");
    setUserDetails(null);
    setIsLoggedIn(false);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userDetails, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
