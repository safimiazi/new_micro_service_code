import { errorCreate } from "@/middleware/errorHandler";
import { AgencyUserService } from "@/service/agency/AgencyUser";
import { compare } from "@/utility/encryption";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "@/config/env";
import { UserI } from "@/database/model/user";
import { db } from "@/database";

export const AgencyUserController = {
  async Login(req, res, next) {
    try {
      const { Email, password } = req.body;
      if (!Email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const User = await AgencyUserService.GetAgencyUserByEmail(Email, true);
      if (!User) {
        return res.status(404).json({ message: "User not found" });
      }
      const userData = User.toJSON();
      if (userData.email !== Email) {
        return res.status(401).json({ message: "Information does not match" });
      }
      if (!compare(password, userData.password)) {
        throw errorCreate(401, "Please enter a valid information !");
      }
      const session = uuidv4();
      const token = jwt.sign(
        {
          user: userData.id,
          name: userData.name,
          session: session,
        },
        ENV.SECRET_KEY,
        { expiresIn: "1d" }
      );
      const setCookie = (name, value) =>
        cookie.serialize(name, value, {
          maxAge: 1 * 24 * 60 * 60,
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        });
      res.setHeader("Set-Cookie", [
        setCookie("u_date", token),
        setCookie("u_hi", session),
      ]);
      await User.update({ session: session });
      return res.send({ login: true });
      // end
    } catch (error) {
      next(error);
    }
  },
  async ValidateCookie(u_date: string, u_hi: string): Promise<UserI> {
    // ... implementation ...
    try {
      let userDecoder = null;
      try {
        userDecoder = jwt.verify(u_date, ENV.SECRET_KEY);
      } catch (error) {
        throw new Error("Invalid token.");
      }
      if (!userDecoder) {
        throw errorCreate(401, "You have to login !");
      }

      const User = await db.User.findOne({
        where: {
          id: userDecoder.id,
        },
      });
      if (!User) {
        throw errorCreate(401, "You have To Login");
      }

      if (u_hi !== User.toJSON().session) {
        throw errorCreate(401, "You have to login !");
      }
      return User;
    } catch (error) {
      console.log("🚀 ~ ValidateCookie ~ error:", error);
      throw error;
    }
  },
};
