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
    const isOldPassMatch = await db.User.findOne({
      where:{
        password: data.oldPassword
      }
    })

  }
  
};
