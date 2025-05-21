import { useTheme } from "@/hooks/ThemeContext";
import { StatusBar } from "react-native";

export default function DynamicStatusBar() {
  const { theme } = useTheme();

  return (
    // <StatusBar
    //   barStyle={theme === "dark" ? "light-content" : "dark-content"}
    //   backgroundColor={theme === "dark" ? "#121212" : "#FFFFFF"}
    // />
    <></>
  );
}
