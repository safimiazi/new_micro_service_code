import { db } from "@/database";
import { AgencyI } from "@/database/model/Agency";
import { errorCreate } from "@/middleware/errorHandler";
import { compare } from "@/utility/encryption";
import { Op } from "sequelize";
import { hash } from "@/utility/encryption";

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
      const alreadyHaveAgencyUser = await db.User.findOne({
        where: {
          agency_id: data.agencyId,
          [Op.or]: [{ email: data.email }, { phone: data.phone }],
        },
      });

      const isExistAgency = await db.Agency.findOne({
        where: {
          id: data.agencyId
        }
      })

      if (!isExistAgency) {
        throw errorCreate(401, "Agency Not exists, Please Request for agency.");
      }

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
        password: data.password,
        coverPhoto: data.coverPhoto,
        profilePhoto: data.profilePhoto,
        type: "user",
        status: "active",
        agency_id: data.agencyId
        
      });

      // Return the newly created user
      return newUser;
    } catch (error) {
      throw errorCreate(
        401,
        "Failed to create new agency user: " + error.message
      );
    }
  },

  async GetAgencyUsersFromDB(search, limit, page, agencyId) {
    try {
      const pageSize = parseInt(limit) || 10;
      const pageIndex = parseInt(page) || 0;
      console.log("first", agencyId);

      const searchCondition = search && `%${search.toLowerCase()}%`;

      const { count, rows: agencyUsers } = await db.User.findAndCountAll({
        where: {
          agency_id: agencyId,
          type: "user",
          status: "active",
          email: { [Op.like]: `%${searchCondition}%` },
        },
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "designation",
          "createdAt",
        ],
      
        order: [["createdAt", "DESC"]],
        limit: pageSize,
        offset: pageIndex * pageSize,
      });

      return {
        total: count,
        users: agencyUsers,
      };
    } catch (error) {
      throw errorCreate(401, error);
    }
  },

  async GetAgencySingleUserFromDB(id) {
    if (!id) {
      throw errorCreate(400, "User ID is required");
    }
  
    const user = await db.User.findOne({
      where: {
        id: id, 
        type: "user",
        status: "active",
      },
    });
  
    if (!user) {
      throw errorCreate(404, "User not found");
    }
  
    return user;
  },
  async DeleteAgencySingleUserFromDB(id) {
    if (!id) {
      throw errorCreate(400, "User ID is required");
    }
  
    const user = await db.User.findOne({
      where: {
        id: id, 
        type: "user",
        status: "active",
      },
    });
  
    if (!user) {
      throw errorCreate(404, "User not found");
    }
  
    return user;
  },


  async PasswordChangeAgencyUserIntoDB(data) {
    try {
      // Retrieve the user by ID with necessary attributes
      const user = await db.User.findOne({
        where: { 
          id: data.id,
          type: "user" // Ensure it's an agency user
        },
        attributes: ["id", "status", "password"]
      });

      // Check if user exists
      if (!user) {
        throw errorCreate(401, "User does not exist.");
      }

      // Check if user is active
      if (user.status !== "active") {
        throw errorCreate(401, "User is not active.");
      }

      // Compare old password with the current password
      const isMatch = await compare(data.oldPassword, user.password);
      if (!isMatch) {
        throw errorCreate(401, "Old password is incorrect.");
      }

    


      // Update the password in the database
      await user.update({ password: data.confirmPassword });

      return { message: "Password changed successfully." };
    } catch (error) {
      throw error;
    }
  }
  
};
