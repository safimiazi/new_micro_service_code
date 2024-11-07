import { db } from "@/database";
import { errorCreate } from "@/middleware/errorHandler";
import { agencyController } from "@/service/agency/Agency";
import { AgencyUserService } from "@/service/agency/AgencyUser";
import { Op } from "sequelize";

export const AgencyController = {
  async CreateAgencyWithAdmin(req, res, next) {
    try {
      const body = req.body;

      // check if agency already exists
      const existsAgency = await db.Agency.findOne({
        where: {
          [Op.and]: {
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

      const newAgency = await agencyController.createNewAgency({
        address: body.address,
        email: body.email,
        logo: "",
        name: body.name,
        phone: body.phone,
        status: body.status,
        ref_admin_id: body.ref_admin_id || null,
      });

      // create super admin for this account

      const newSuperAdmin = await AgencyUserService.CreateNewUser({
        designation: "super admin of " + body.name,
        email: body.email,
        name: body.name,
        phone: body.phone,
        otp: null,
        password: body.password,
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
};