import { db } from "@/database";
import { UserI } from "@/database/model/user";

export const AgencyUserService = {
  async CreateNewUser(data: UserInterface): Promise<UserI> {
    try {
      const user = await db.User.create(data);
      return user;
    } catch (error) {
      console.log("🚀 ~ CreateNewUser ~ error:", error);
    }
  },
};
