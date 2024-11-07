import { db } from "@/database";
import { UserI } from "@/database/model/user";

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
};
