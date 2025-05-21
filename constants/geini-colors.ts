import { MaterialIcons } from "@expo/vector-icons";

const statusColors: Record<string, { text: string; bg: string }> = {
  Pending: { text: "#92400e", bg: "#fef3c7" }, // Dark orange text, light yellow bg
  Approved: { text: "#065f46", bg: "#d1fae5" }, // Dark green text, light green bg
  Rejected: { text: "#b91c1c", bg: "#fee2e2" }, // Dark red text, light red bg
  InProgress: { text: "#1e40af", bg: "#dbeafe" }, // Dark blue text, light blue bg
  "Damage Detection Started": { text: "#7c3aed", bg: "#ede9fe" }, // Dark purple text, soft violet bg
  "Damage Detection Completed": { text: "#4d7c0f", bg: "#ecfccb" }, // Dark green text, light lime bg
  "Fraud Detection Started": { text: "#c2410c", bg: "#ffedd5" }, // Dark amber text, peach bg
  "Fraud Detection Completed": { text: "#047857", bg: "#d1fae5" }, // Dark teal text, light green bg
  "Policy Mapper Started": { text: "#4338ca", bg: "#e0e7ff" }, // Dark indigo text, soft blue bg
  Completed: { text: "#065f46", bg: "#d1fae5" }, // Dark green text, light green bg
  default: { text: "#374151", bg: "#f3f4f6" }, // Dark gray text, light gray bg
};

const insuranceIcons: (keyof typeof MaterialIcons.glyphMap)[] = [
  "directions-car", // 🚗 Car icon
  "airport-shuttle", // 🚌 Shuttle / Van
  "two-wheeler", // 🏍 Motorcycle
  "local-taxi", // 🚕 Taxi
  "directions-bus", // 🚌 Bus
  "commute", // 🚎 Public Transport
  "assignment", // 📄 Insurance Claims
  "article", // 📑 Policy Document
  "fact-check", // ✅ Verification
  "verified-user", // 🛡 Insurance Protection
  "local-police", // 🚔 Police Report
  "description", // 📜 Document/Claim
  "attach-file", // 📎 File Attachment
  "engineering", // 🔧 Car Repair / Mechanic
  "build", // 🔨 Workshop / Repair
  "support-agent", // 🎧 Customer Support
  "history", // 📜 Claim History
  "handyman", // 🛠 Fix/Mechanic
  "report-problem", // ⚠️ Accident Report
  "car-repair", // 🚘 Vehicle Repair
];

export { statusColors, insuranceIcons };
