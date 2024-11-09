import { db } from "@/database";
import { errorCreate } from "@/middleware/errorHandler";
import { AgencyServices } from "@/service/agency/Agency";
import { AgencyUserService } from "@/service/agency/AgencyUser";
import SendEmail from "@/utility/email/Connection";
import emailTemplate from "@/utility/emailTamplate/tamplate";
import { Op } from "sequelize";
import cookie from "cookie";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
interface CreateAgencyRequestBody {
  address: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  ref_admin_id?: string | null; // optional field
}

export const AgencyController = {
  async CreateAgencyWithAdmin(
    req: { body: CreateAgencyRequestBody },
    res,
    next
  ) {
    try {
      const body = req.body;

      // check if agency already exists
      const existsAgency = await db.Agency.findOne({
        where: {
          [Op.or]: {
            email: body.email,
            phone: body.phone,
          },
        },
      });

      if (existsAgency) {
        const Status = existsAgency.toJSON().status;

        if (Status === "active") {
          throw errorCreate(
            400,
            "Agency already exists. Please Login to your valid credentials."
          );
        }

        if (Status === "block") {
          throw errorCreate(
            400,
            "This Agency Are Not Allowed to Login or use our Services. Please Contact with the administrator"
          );
        }

        if (Status === "deactivated") {
          throw errorCreate(
            400,
            "Your Account is Deactivated for Please Contact the Administrator"
          );
        }

        if (Status === "non_verify") {
          throw errorCreate(
            400,
            "Your Account is on verification stage now. If you are Selected we will inform you with a email "
          );
        }
      }

      const newAgency = await AgencyServices.createNewAgency({
        address: body.address,
        email: body.email,
        logo: "",
        name: body.name,
        phone: body.phone,
        status: "non_verify",
        ref_admin_id: body.ref_admin_id || null,
      });

      // create super admin for this account

      const newSuperAdmin = await AgencyUserService.CreateNewUser({
        designation: "super admin of " + body.name,
        email: body.email,
        name: body.name,
        phone: body.phone,
        otp: null,
        password: "",
        photo: "",
        // @ts-expect-error skip
        role: [],
        session: "0",
        status: "non_verify",
        type: "super",
        agency_id: newAgency.id,
      });

      res.send({
        userCreated: true,
        status: "success",
      });
    } catch (error) {
      next(error);
    }
  },

  async otpValidation(req, res, next) {
    try {
      const { email, otp } = req.body;
      const User = await AgencyUserService.GetAgencyUserByEmail(email, true);
      if (!User) {
        throw errorCreate(401, "User not found !");
      }
      const UserJson = User.toJSON();
      if (UserJson.type !== "super") {
        throw errorCreate(
          401,
          "Please use agency information check your email inbox ."
        );
      }

      if (UserJson.otp !== otp) {
        throw errorCreate(401, "Please use valid Code");
      }

      const Session = uuidv4();

      await User.update({
        otp: null,
        session: Session,
        status: "active",
      });

      const UpdateAgency = await db.Agency.update(
        {
          status: "active",
        },
        {
          where: {
            id: User.agency_id,
          },
        }
      );

      res.send({
        update: true,
        user: "verified",
        Session,
      });
    } catch (error) {
      next(error);
    }
  },
  async GetAll(req, res, next) {
    try {
      const { page = 0, limit = 10, email, status } = req.query;
      const offset = page * parseInt(limit); // Calculate offset as a number

      const agencies = await db.Agency.findAll({
        where: {
          [Op.and]: [
            status ? { status } : {}, // Include status if provided
            email ? { email: { [Op.like]: `%${email}%` } } : {}, // Add wildcard for partial matching
          ],
        },
        limit: parseInt(limit), // Ensure limit is a number
        offset, // Use numeric offset
      });

      // Get total count of records in the table without filters
      const totalRecords = await db.Agency.count({
        where: {
          [Op.and]: [
            status ? { status } : {}, // Include status if provided
            email ? { email: { [Op.like]: `%${email}%` } } : {}, // Add wildcard for partial matching
          ],
        },
      });

      res.send({
        page: parseInt(page),
        limit: parseInt(limit),
        totalRecords,
        email,
        status,
        data: agencies,
      });
    } catch (error) {
      console.log("🚀 ~ GetAll ~ error:", error);
      next(error);
    }
  },
  async ApproveAgency(req, res, next) {
    try {
      const { id, Status } = req.body;
      console.log("🚀 ~ ApproveAgency ~ Status:", Status);
      const Agency = await db.Agency.findOne({
        where: {
          id: id,
        },
      });
      if (!Agency) {
        throw errorCreate(404, "Agency not found !");
      }

      // UPDATE

      const User = await db.User.findOne({
        where: {
          agency_id: Agency.id,
          type: "super",
        },
      });
      if (!User) {
        throw errorCreate(404, "Admin User not found !");
      }
      // Generate OTP
      const otp = Math.floor(10000 + Math.random() * 90000).toString();
      // send email
      const EmailStatus = await SendEmail({
        to: User.toJSON().email,
        bcc: [],
        attachments: [],
        html: await emailTemplate(
          otp,
          Agency.toJSON().name,
          Agency.toJSON().email
        ),
        subject: "Astha Trip Confirm Your Agency Account",
        text: "",
      });

      await User.update({
        otp: otp,
      });

      res.send({
        status: 200,
        approve: true,
        EmailStatus,
      });
    } catch (error) {
      next(error);
    }
  },
  async SetAgencyPassword(req, res, next) {
    try {
      const { session, password } = req.body;
      const result: any = await AgencyUserService.SetAgencyPasswordInDB(
        session,
        password
      );
      console.log("result", result);

      // Check if the result contains an error
      if (result.error) {
        console.error("Error:", result.error);
        return res.status(400).send({
          status: 400,
          message: result.error,
        });
      }
      res.send({
        status: 200,
        success: true,
        message: "password created successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async AgencyLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      // Attempt login in the database
      const user = await AgencyUserService.agencyLoginIntoDB(email, password);

      // Extract user details for token creation and session management
      const userData = user.toJSON();
      const token = jwt.sign(
        {
          userId: userData.id,
          email: userData.email,
          phone: userData.phone,
        },
        ENV.SECRET_KEY,
        { expiresIn: "1d" }
      );

      // Set cookies for authentication and session tracking
      res.setHeader("Set-Cookie", [
        cookie.serialize("login", token, {
          maxAge: 86400, // 1 day in seconds
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        }),
        cookie.serialize("session", userData.session, {
          maxAge: 86400, // 1 day in seconds
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        }),
      ]);

      // Send success response
      res.status(200).json({
        success: true,
        message: "Login successful",
      });
    } catch (error) {
      next(error);
    }
  },
};
