import { v4 as uuidv4 } from "uuid";

import { db } from "@/database";
import { UserI } from "@/database/model/user";
import { errorCreate } from "@/middleware/errorHandler";
import { compare } from "@/utility/encryption";

export const AgencyUserService = {
  async CreateNewUser(data: UserInterface): Promise<UserI> {
    try {
      const user = await db.User.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  },
  async GetAgencyUserByEmail(email: string, U = false): Promise<UserI> {
    try {
      if (U) {
        const user = await db.User.unscoped().findOne({
          where: { email },
        });
        return user;
      } else {
        const user = await db.User.findOne({
          where: { email },
        });
        return user;
      }
    } catch (error) {
      throw error;
    }
  },

  async SetAgencyPasswordInDB(session: string, password: string) {
    try {
      const user = await db.User.unscoped().findOne({
        where: { session },
      });
      if (!user) {
        throw errorCreate(401, "Invalid User!");
      }

      // Update the user with the hashed password
      const result = await user.update({
        password,
        session: null,
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async agencyLoginIntoDB(email: string, password: string) {
    try {
      // Find user by email
      const user = await db.User.unscoped().findOne({
        where: { email },
      });
  
      // Check if user exists
      if (!user) {
        throw errorCreate(404, "Agency not found!");
      }
  
      // Check if user's status is active
      if (user.status !== "active") {
        throw errorCreate(403, "User account is not active, Please contact support.");
      }
  
 
  
      // Compare passwords with bcrypt (using await)
      const matchPassword =  compare(password, user.toJSON().password);
      console.log("Password match result:", matchPassword);
  
      if (!matchPassword) {
        throw errorCreate(401, "Invalid password, Please try again.");
      }
  
      // If password matches, generate session and update user
      const session = uuidv4();
      const result = await user.update({ session: session });
  
      // Return the result of the update
      return result;
  
    } catch (error) {
      console.error("Error in agencyLoginIntoDB:", error);
      throw error;
    }
  },
};
