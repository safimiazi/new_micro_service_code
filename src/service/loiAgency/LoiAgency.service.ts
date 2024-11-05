import { db } from "@/database";
import { LoiAgencyI } from "@/database/model/LOI_Agency";
interface AddLOI_Agency {
  email: string;
  name: string;
  phone: string;
  logo: string;
  banner: string;
  address: string;
  signature: string;
  sill: string;
  UEN: string;
  name_NRIC: string;
  default: boolean;
  status?: "active" | "deactivated" | "block" | "non_verify";
}

export const LoiAgencyServiceProvider = {
  async CreateLoiAgency(data: AddLOI_Agency): Promise<LoiAgencyI> {
    try {
      const NewLoiAgency = await db.LoiAgency.create(data);
      return NewLoiAgency;
    } catch (error) {
      throw error;
    }
  },
  async GetAll() {
    return await db.LoiAgency.findAll();
  },
  async getById(id: string) {
    return await db.LoiAgency.findOne({
      where: {
        id: id,
      },
    });
  },
};
