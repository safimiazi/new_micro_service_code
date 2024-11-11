import { db } from "@/database";
import { AgencyI } from "@/database/model/Agency";
import { errorCreate } from "@/middleware/errorHandler";
import { Op } from "sequelize";
interface AddAgency {
  name: string;
  email: string;
  phone: string;
  logo: string;
  address: string;
  status: "active" | "deactivated" | "block" | "non_verify";
  ref_admin_id?: string;
}

export const AgencyServices = {
  async createNewAgency(data: AddAgency): Promise<AgencyI> {
    try {
      const NewAgency = await db.Agency.create(data);
      return NewAgency;
    } catch (error) {
      throw error;
    }
  },
  async CreateNewAgencyUserIntoDB(data) {
    try {
      // Check if a user already exists with the same email or phone
      const alreadyHaveAgencyUser = await db.User.findOne({
        where: {
          [Op.or]: [
            { email: data.email },
            { phone: data.phone }
          ]
        }
      });
  
      // If user already exists, throw an error
      if (alreadyHaveAgencyUser) {
        throw errorCreate(401, "User already exists");
      }
  
      // Create a new user in the database
      const newUser = await db.User.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        designation: data.designation,
        password: data.password, // Remember to hash the password
        coverPhoto: data.coverPhoto,
        profilePhoto: data.profilePhoto,
      });
  
      // Return the newly created user
      return newUser;
    } catch (error) {
      throw new Error("Failed to create new agency user: " + error.message);
    }
  }
};
