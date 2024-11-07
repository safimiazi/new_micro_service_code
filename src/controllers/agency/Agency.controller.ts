import { db } from "@/database";
import { errorCreate } from "@/middleware/errorHandler";
import { AgencyServices } from "@/service/agency/Agency";
import { AgencyUserService } from "@/service/agency/AgencyUser";
import { Op } from "sequelize";

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
      await User.update({
        otp: null,
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
      });
    } catch (error) {
      next(error);
    }
  },
  async GetAll(req, res, next) {
    try {
      const { page = 1, limit = 10, email, status } = req.query; // Get page and limit from query parameters
      const offset = (page - 1) * limit; // Calculate offset for pagination

      const agencies = await db.Agency.findAll({
        where: {
          [Op.and]: [
            status ? { status: status } : {}, // Include status if it's not null
            email ? { email: { [Op.like]: email } } : {}, // Include email if it's not null
          ],
        },
        limit: limit.toString(), // Convert limit back to string
        offset: offset, // Convert offset back to string
      });

      res.send({
        page: parseInt(page),
        limit: parseInt(limit),
        email: email,
        status,
        data: agencies,
      });
    } catch (error) {
      next(error);
    }
  },
};
