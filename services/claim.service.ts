import httpClient from "@/constants/httpclient"; // Adjust the import path as necessary

export const ClaimService = {
  //! Submit a claim
  async submitClaim(claim: any) {
    return await httpClient.post(`/claims/add`, claim, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  //! Get all claims
  async getClaims() {
    return await httpClient.get(`/claims/all`);
  },

  //! Get claim by ID
  async getClaimById(id: string) {
    return await httpClient.get(`/claims/detail/${id}`);
  },
};
