import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CheckboxGroupProps {
  title: string; // Title of the checkbox group
  options: { label: string; value: string }[]; // Array of checkbox options
  selectedValues: string[]; // Array of currently selected values
  onChange: (selectedValues: string[]) => void; // Function to handle selection change
}

export default function CheckboxGroup({
  title,
  options,
  selectedValues,
  onChange,
}: CheckboxGroupProps) {
  const toggleCheckbox = (value: string) => {
    if (selectedValues.includes(value)) {
      // Remove value from selectedValues
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      // Add value to selectedValues
      onChange([...selectedValues, value]);
    }
  };

  return (
    <View>
      <Text className="text-lg font-semibold text-gray-800 mb-4">{title}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          className="flex-row items-center mb-2"
          onPress={() => toggleCheckbox(option.value)}
        >
          <View
            className={`h-6 w-6 border border-custom-blue2 rounded-md flex items-center justify-center ${
              selectedValues.includes(option.value)
                ? "bg-custom-blue2"
                : "bg-white"
            }`}
          >
            {selectedValues.includes(option.value) && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
          <Text className="ml-2 text-black">{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
