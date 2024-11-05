import { ENV } from "@/config/env";
import { db } from "@/database";
import { compare } from "@/utility/encryption";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { v4 as uuidv4 } from "uuid";
import { errorCreate } from "@/middleware/errorHandler";

export const AdministrationService = {


  async GetById(id: string) {
    return await db.Administration.findOne({
      where: {
        id, // Assuming 1 is the admin id
      },
    });
  },



  
  async Create(data: {
    phone: string;
    password: string;
    email: string;
    designation: string;
    name: string;
  }) {
    try {
      const newAdmin = await db.Administration.create({
        name: data.name,
        designation: data.designation,
        email: data.email,
        password: data.password,
        phone: data.phone,
        photo: "/no.png",
        role: [] as unknown as any,
        session: "0",
        status: "active",
        type: "user",
      });
      return newAdmin;
    } catch (error) {
      throw error;
    }
  },
  // login
  async Login(email, password, res) {
    try {
      const User = await db.Administration.unscoped().findOne({
        where: {
          email,
        },
      });
      if (!User) {
        throw new Error("Invalid email or password.");
      }

      const Matcher = compare(password, User.toJSON()?.password);

      if (Matcher) {
        // set cookies
        const session = await uuidv4();
        const token = await jwt.sign(
          {
            user: User.toJSON().id,
            name: User.toJSON().name,
          },
          ENV.SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        res.setHeader("Set-Cookie", [
          cookie.serialize("date", token, {
            maxAge: 1 * 24 * 60 * 60,
            sameSite: "strict",
            path: "/",
            httpOnly: true,
          }),
          cookie.serialize("hi", session, {
            maxAge: 1 * 24 * 60 * 60,
            sameSite: "strict",
            path: "/",
            httpOnly: true,
          }),
        ]);

        await User.update({
          session: session,
        });

        return res.send({
          login: true,
        });
        // end
      }
      throw errorCreate(404, "Wrong Credential");
    } catch (error) {
      throw error;
    }
  },

  // authentication
  async CookiesAuth(data: string, hi: string) {
    try {
      let userDecoder = null;
      try {
        userDecoder = jwt.verify(data, ENV.SECRET_KEY);
      } catch (error) {
        throw new Error("Invalid token.");
      }

      if (!userDecoder) {
        throw errorCreate(401, "You have to login !");
      }

      const Admin = await db.Administration.unscoped().findOne({
        where: {
          id: userDecoder.user,
        },
      });

      if (!Admin) {
        throw errorCreate(401, "You have To Login");
      }

      if (hi !== Admin.toJSON().session) {
        throw errorCreate(401, "You have to login !");
      }
      const Data = Admin.toJSON();

      delete Data.password;
      delete Data.session;

      return Data;
    } catch (error) {
      throw error;
    }
  },
};
