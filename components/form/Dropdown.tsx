import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { vehicleService } from "@/services/vehicle.service";

interface DropdownFieldProps {
  label: string;
  error?: string;
  value?: string;
  onChangeSelect: (value: string) => void;
}

type VehicleType = {
  _id: string;
  vehicleModel: string;
  vehicleNumberPlate: string;
};

export default function DropdownField({
  label,
  value,
  onChangeSelect,
}: DropdownFieldProps) {
  const [isFocus, setIsFocus] = useState(false);
  const [vehicleOptions, setVehicleOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehicleService.getVehiclesForUser();
        const fetchedVehicles: VehicleType[] = response?.data?.vehicles;

        const formattedVehicles = fetchedVehicles?.map((vehicle) => ({
          label: vehicle.vehicleModel + " " + vehicle.vehicleNumberPlate,
          value: vehicle._id,
        }));

        setVehicleOptions(formattedVehicles);
      } catch (err) {
        console.log(err);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#1978bb" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={vehicleOptions}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select Vehicle" : "..."}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          onChangeSelect(item.value);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    backgroundColor: "white",
    width: "100%",
  },
  dropdown: {
    height: 50,
    borderColor: "#e5e7eb",
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    backgroundColor: "transparent",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
