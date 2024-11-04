// controllers/agentController.js

import { agencyService } from "@/service/agency/Agency";

export const agentController = {
  async agentRegistration(req, res) {
    try {
      const data = await agencyService.agentRegistrationService(req.body);
    } catch (error) {
      console.error("Agent registration error:", error);
      return res
        .status(500)
        .json({ message: "Registration failed", error: error.message });
    }
  },
};
