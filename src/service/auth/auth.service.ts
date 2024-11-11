import { ENV } from "@config/env";

import jwt from "jsonwebtoken";
import cookie from "cookie";
import { compare } from "@/utility/encryption";
import { errorCreate } from "@/middleware/errorHandler";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import { db } from "@/database";

const AuthService = {
  async setCookieAdmin(data, res, app = false) {
    try {
      const token = await jwt.sign(
        {
          ...data,
        },
        ENV.SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      if (app) {
        return token;
      }
      res.setHeader("Set-Cookie", [
        cookie.serialize("sort_a", token, {
          maxAge: 1 * 24 * 60 * 60,
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        }),
        cookie.serialize("log_a", data.session, {
          maxAge: 1 * 24 * 60 * 60,
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        }),
      ]);
    } catch (error) {
      throw error;
    }
  },
  async loginAdmin(email: string, password: string, req): Promise<boolean> {
    try {
      // query the request user
      const Admin = await db.Administration.unscoped().findOne({
        where: { email: email },
      });

      if (!Admin) {
        throw errorCreate(401, "Invalid credential");
      }

      if (Admin.toJSON().status === "deactivate") {
        throw errorCreate(406, "user blocked");
      }
      if (Admin.toJSON().status === "non_verify") {
        throw errorCreate(406, "user not Verify");
      }

      const passwordHash = Admin.toJSON().password;
      const Matcher = await compare(password, passwordHash);

      if (Matcher) {
        const session = await uuidv4();
        await this.setCookieAdmin(
          {
            name: Admin.toJSON().name,
            user: Admin.toJSON().id,
            session: session,
          },
          req
        );
        Admin.update({
          session: session,
        });
        return true;
      }

      throw errorCreate(401, "Invalid credential");
    } catch (error) {
      throw error;
    }
  },

  async CookieValidator(cookie: string, session: string) {
    try {
      let userDecode: {
        name: string;
        user: string;
        session: string;
      } | null;

      // validate the jwt
      try {
        userDecode = jwt.verify(cookie, ENV.SECRET_KEY) as {
          name: string;
          user: string;
          session: string;
        };
      } catch (error) {
        console.log("🚀 ~ CookieValidator ~ error:", error);
        throw errorCreate(401, "Invalid User please login");
      }

      const User = await db.Administration.unscoped().findOne({
        where: {
          [Op.and]: {
            id: userDecode.user,
            session: session,
          },
        },
        attributes: {
          exclude: ["password"],
        },
      });

      if (!User) {
        throw errorCreate(401, "Invalid User please login");
      }

      if (User.toJSON().session !== session) {
        throw errorCreate(406, "Invalid User Please Login Again");
      }
      return User;
    } catch (error) {
      throw error;
    }
  },

  async agentCookieValidator(cookie: string, session: string) {
    try {
      let userDecode: {
        userId: string;
        session: string;
        email: string;
      };

      try {
        userDecode = jwt.verify(cookie, ENV.SECRET_KEY) as {
          userId: string;
          session: string;
          email: string;
        };
        console.log("userDecode", userDecode);
      } catch (error) {
        throw errorCreate(401, "Invalid User please login");
      }

      const user = await db.User.unscoped().findOne({
        where: {
          [Op.and]: {
            id: userDecode.userId,
            session: session,
          },
        },
        attributes: {
          exclude: ["password"],
        },
      });

      if (!user) {
        throw errorCreate(401, "Invalid user, Please Login");
      }
      if (user.toJSON().session !== session) {
        throw errorCreate(401, "Invalid user, Please Login again");
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  async jwtValidator(Token: string) {
    try {
      let userDecode: {
        name: string;
        user: string;
        session: string;
      } | null;

      // validate the jwt
      try {
        userDecode = jwt.verify(Token, ENV.SECRET_KEY) as {
          name: string;
          user: string;
          session: string;
        };
      } catch (error) {
        throw errorCreate(401, "Invalid User please login");
      }

      const User = await db.Administration.unscoped().findOne({
        where: {
          id: userDecode.user,
        },

        attributes: {
          exclude: ["password", "session"],
        },
      });

      if (!User) {
        throw errorCreate(401, "Invalid User please login");
      }
      return User;
    } catch (error) {
      throw error;
    }
  },
  async Logout(user, res) {
    try {
      await db.Administration.update(
        {
          session: "",
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.setHeader("Set-Cookie", [
        cookie.serialize("sort", "", {
          maxAge: 1,
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        }),
        cookie.serialize("log", "", {
          maxAge: 1,
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        }),
      ]);
      res.send({ logout: true });
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;
