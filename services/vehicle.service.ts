import httpClient from "@/constants/httpclient"; // Adjust the import path as necessary

export const vehicleService = {
  //! Get all vehicles for a user
  async getVehiclesForUser() {
    return await httpClient.get(`/vehicle/getVehiclesByUserId`);
  },
};
