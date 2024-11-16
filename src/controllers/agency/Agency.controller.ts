import { db } from "@/database";
import { errorCreate } from "@/middleware/errorHandler";
import { AgencyServices } from "@/service/agency/Agency";
import { AgencyUserService } from "@/service/agency/AgencyUser";
import SendEmail from "@/utility/email/Connection";
import EmailTemplate from "@/utility/EmailTemplate/Template";
import { Op } from "sequelize";
import cookie from "cookie";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";

import fs from "fs"



import path from "path";
import emailRejectTemplate from "@/utility/EmailTemplate/emailRejectTemplate";
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

        if (Status === "non_verify" || Status === "request") {
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

      const SelectBalanceConfiguration = await db.AgencyBalance.create({
        agency_id: newAgency.id,
        balance: "0",
        rate: "0",
        type: "prepaid",
      });

      const CreateAgentBalanceConfiguration = await db.AgentBalance.create({
        agency_id: newAgency.id,
        balance: "0",
        user_id: newSuperAdmin.id,
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
      const { id, status } = req.body;
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
      if (status === "approve") {
        // Generate OTP
        const otp = Math.floor(10000 + Math.random() * 90000).toString();
        // send email
        const EmailStatus = await SendEmail({
          to: User.toJSON().email,
          bcc: [],
          attachments: [],
          html: await EmailTemplate(
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
      }

      if (status === "reject") {
        // status deactivate of user:
        await User.update({
          status: "deactivate",
        });
        await Agency.update({
          status: "block",
        });
        const EmailStatus = await SendEmail({
          to: User.toJSON().email,
          bcc: [],
          attachments: [],
          html: await emailRejectTemplate(Agency.toJSON().name),
          subject: "Astha Trip Reject Your Agency Account",
          text: "",
        });

        res.send({
          status: 200,
          reject: true,
          EmailStatus,
        });
      }
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
        cookie.serialize("c_c_date", token, {
          maxAge: 86400, // 1 day in seconds
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        }),
        cookie.serialize("time_c", userData.session, {
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

  async CreateNewAgencyUser(req, res, next) {
    try {
      const { name, email, phone, designation, password } = req.body;
      const agencyId = req.agent.agency_id;
      // Extract file paths
      const profilePhoto = req.files.profilePhoto
        ? req.files.profilePhoto[0].filename
        : null;
      const coverPhoto = req.files.coverPhoto
        ? req.files.coverPhoto[0].filename
        : null;

      console.log("profilePhoto", profilePhoto);

      // Construct data for saving
      const newUserData = {
        name,
        email,
        phone,
        designation,
        password,
        profilePhoto,
        coverPhoto,
        agencyId,
      };
      const newUser = await AgencyServices.CreateNewAgencyUserIntoDB(
        newUserData
      );

      res.status(201).json({
        success: true,
        message: "New agency user created successfully",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async GetAgencyUsers(req, res, next) {
    const { search, limit, page } = req.query;
    const agencyId = req.agent.agency_id;
    const result = await AgencyServices.GetAgencyUsersFromDB(
      search,
      limit,
      page,
      agencyId
    );
    res.status(201).json({
      success: true,
      message: "Agency users retrieved successfully.",
      totalRecord: result.total,
      data: result.users,
    });
  },
  async GetAgencySingleUser(req, res, next) {
    const { id } = req.query;
    const result = await AgencyServices.GetAgencySingleUserFromDB(id);
    res.status(201).json({
      success: true,
      message: "Agency user retrieved successfully.",
      data: result,
    });
  },
  async DeleteAgencySingleUser(req, res, next) {
    const { id } = req.query;
    const result = await AgencyServices.DeleteAgencySingleUserFromDB(id);
  },

  async PasswordChangeAgencyUser(req, res, next) {
    try {
      // Call the service function to change the password
      const result = await AgencyServices.PasswordChangeAgencyUserIntoDB(
        req.body
      );

      // Send a success response back to the client
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      // Pass error to the error-handling middleware
      next(error);
    }
  },

  async getProfileFiles(req, res, next) {
    const { image } = req.params;
    const { agent } = req;
    const User = await db.User.findOne({
      where: {
        agency_id: agent.agency_id,
        [Op.or]: {
          profilePhoto: image,
          coverPhoto: image,
        },
      },
    });
    if (!User) {
      throw errorCreate(404, "Image not found !");
    }
    const filePath = path.join(
      __dirname,
      "../../",
      "privet_assets/agent_profile",
      image
    );
    res.sendFile(filePath);
  },

  async UpdateAgencyProfile (req, res, next) {
    try {
      // Extract data from request body
      const { agencyId, name, email, phone, nid, address, status } = req.body;
      console.log("Received Agency ID:", agencyId);
  
      // Get the admin from the request (assumed to be authenticated)
      const admin = req.admin;
  
      // Extract file paths for photos
      const profilePhoto = req.files.profilePhoto ? req.files.profilePhoto[0].filename : null;
      const coverPhoto = req.files.coverPhoto ? req.files.coverPhoto[0].filename : null;
  
      // Check if admin exists in the database
      const isAdmin = await db.Administration.findOne({
        where: {
          id: admin.id,
        },
      });
  
      const isJsonAdmin = isAdmin ? isAdmin.toJSON() : null;
  
      if (!isJsonAdmin) {
        return res.status(404).json({
          success: false,
          message: "You are not authorized as an admin to update the agency profile.",
        });
      }
  
      // Check admin's authorization (super admin and active status)
      if (isJsonAdmin.type !== "super" || isJsonAdmin.status !== "active") {
        return res.status(401).json({
          success: false,
          message: "Admin is not authorized to update agency profile.",
        });
      }
  
      // Update the agency profile in the database
      const result = await db.Agency.update(
        {
          name,
          email,
          phone,
          address,
          nid,
          status,
          profilePhoto, // Update profile photo if provided
          coverPhoto,   // Update cover photo if provided
        },
        {
          where: {
            id: agencyId,
          },
        }
      );
  
      if (result[0] === 1) {
        return res.status(200).json({
          success: true,
          message: "Agency profile updated successfully.",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Agency profile update failed. Please check the provided details.",
        });
      }
  
    } catch (error) {
      console.error("Error in updating agency profile:", error);
  
      // Pass error to the error-handling middleware
      next(error); // Call next() to handle the error in a centralized error handler
    }
  },

  async GetSingleAgency(req, res, next) {
    try {
      const { id } = req.query;
  console.log("first", id)
      // Ensure ID is provided
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Agency ID is required.",
        });
      }
  
      const result = await db.Agency.findOne({
        where: { id }, // Sequelize automatically resolves shorthand like this
      });
  
      // Check if an agency was found
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Agency not found.",
        });
      }
  
      // Send the agency data in response
      res.status(200).json({
        success: true,
        data: result,
        message: "Agency data retrieved successfully.",
      });
    } catch (error) {
      console.error("Error fetching agency data:", error);
  
      // Send a generic error response
      res.status(500).json({
        success: false,
        message: "An error occurred while retrieving the agency data.",
        error: error.message, // Include error message for debugging
      });
    }
  },


async getAgencyProfileFiles(req, res, next) {
  try {
    const { image, id } = req.params;

    // Find user by ID with the profile or cover photo matching the image parameter
    const User = await db.Agency.findOne({
      where: {
        id: id,
        [Op.or]: {
          profilePhoto: image,
          coverPhoto: image,
        },
      },
    });

    if (!User) {
      return res.status(404).json({ message: "Image not found!" });
    }

    // Construct the full path to the image file
    const filePath = path.join(
      __dirname,
      "../../privet_assets/agent_profile", // Adjust the path based on your project structure
      image
    );

    // Check if the file exists before sending
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server!" });
    }

    // Send the file as a response
    res.sendFile(filePath);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
}

 
};
