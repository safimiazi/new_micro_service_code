<<<<<<< HEAD
import { db } from "@/database";
import { AgencyI } from "@/database/model/Agency";
interface AddAgency {
  name: string;
  email: string;
  phone: string;
  logo: string;
  address: string;
  status: "active" | "deactivated" | "block" | "non_verify";
  ref_admin_id?: string;
}

export const agencyController = {
  async createNewAgency(data: AddAgency): Promise<AgencyI> {
    try {
      const NewAgency = await db.Agency.create(data);
      return NewAgency;
    } catch (error) {
      throw error;
    }
  },
=======
export const agencyService = {
   
  async agentRegistrationService(data) {
    const { name, address, nid, email, phone } = data;

  }


>>>>>>> 69d221f1d3939d488ec0f7ab260134d3797277f5
};
