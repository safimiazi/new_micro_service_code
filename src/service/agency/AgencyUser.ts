const bcrypt = require("bcrypt");

import { db } from "@/database";
import { UserI } from "@/database/model/user";
import { errorCreate } from "@/middleware/errorHandler";

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
    const user = await db.User.findOne({
      where: { session },
    });
    if (!user) {
      throw errorCreate(401, "Invalid User!");
     
    }
    if (user.password) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
      
        throw errorCreate(401, "This password is already in use. Please choose a different password.");

      }
    }
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

   // Update the user with the hashed password
    const result = await user.update({ password: hashedPassword, session : null });
    return result;
  },
};
