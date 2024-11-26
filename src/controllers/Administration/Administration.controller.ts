import { db } from "@/database";
import { errorCreate } from "@/middleware/errorHandler";
import { AdministrationService } from "@/service/administration/Administration.service";
import SendEmail from "@/utility/email/Connection";
import visaFormTemplate from "@/utility/EmailTemplate/VisaFormTemplate";

export const AdministrationController = {
  async Login(req, res, next) {
    try {
      const { email, password } = req.body;
      await AdministrationService.Login(email, password, res);
    } catch (error) {
      next(error);
    }
  },

  async GetAdmin(req, res, next) {
    try {
      res.send(req.admin);
    } catch (error) {
      next(error);
    }
  },
  async getAgent(req, res, next) {
    try {
      res.send(req.agent);
    } catch (error) {
      next(error);
    }
  },

  async AdminEditAgencyUserProfile(req, res, next) {
    try {
      const { id } = req.params; // Extract the user ID from params
      const { name, email, phone, designation, status } = req.body; // Extract fields from request body

      // Validate user ID
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Fetch the current data for the user
      const existingUser = await db.User.findOne({ where: { id } });

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prepare update data by merging existing fields with new ones

      let updateData;
      updateData = {
        name: name || existingUser.name,
        email: email || existingUser.email,
        phone: phone || existingUser.phone,
        designation: designation || existingUser.designation,
        status: status !== undefined ? status : existingUser.status, // Allow status to be explicitly set to false
      };

      // Handle uploaded files (if any)
      if (req.files) {
        if (req.files.coverPhoto && req.files.coverPhoto[0]) {
          updateData.coverPhoto = req.files.coverPhoto[0].filename;
        } else if (!existingUser.coverPhoto) {
          return res.status(400).json({ message: "Cover photo is required" });
        } else {
          updateData.coverPhoto = existingUser.coverPhoto;
        }

        if (req.files.profilePhoto && req.files.profilePhoto[0]) {
          updateData.profilePhoto = req.files.profilePhoto[0].filename;
        } else if (!existingUser.profilePhoto) {
          return res.status(400).json({ message: "Profile photo is required" });
        } else {
          updateData.profilePhoto = existingUser.profilePhoto;
        }
      }

      // Update the user in the database
      const [updatedCount] = await db.User.update(updateData, {
        where: { id },
      });

      if (updatedCount === 0) {
        return res.status(400).json({ message: "No changes were made" });
      }

      res.status(200).json({
        message: "User profile updated successfully",
        data: updateData,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      next(error); // Pass error to error-handling middleware
    }
  },

  async AdminSendBalanceToAgency(req, res, next) {
    try {
      const { id } = req.params;
      const { balance, rate } = req.body;

      if (!balance || !rate ) {
        return res.status(400).json({
          message: "Balance and rate are required.",
        });
      }

      // Find or create the agency balance
      const [agencyBalance] = await db.AgencyBalance.findOrCreate({
        where: { agency_id: id },
        defaults: { balance, rate },
      });

      if (!agencyBalance.isNewRecord) {
        // Update the existing balance
        agencyBalance.balance = String(
          Number(agencyBalance.balance) + Number(balance)
        );
        agencyBalance.rate = rate || agencyBalance.rate;
        await agencyBalance.save();
      }

      res.status(200).json({
        message: "Agency balance updated successfully.",
        data: agencyBalance,
      });
    } catch (error) {
      next(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  async AdminSetPaymentTypeToAgency(req, res, next) {
    try {
      const { id } = req.params;
      const { type } = req.body;

      if (!type) {
        return res.status(400).json({
          message: "Payment type are required.",
        });
      }

      // Find or create the agency balance
      const [agencyPaymentType] = await db.AgencyBalance.findOrCreate({
        where: { agency_id: id },
        defaults: { type },
      });

      if (!agencyPaymentType.isNewRecord) {
        // Update the existing balance
        agencyPaymentType.type = type
        await agencyPaymentType.save();
      }

      res.status(200).json({
        message: "Agency Payment type updated successfully.",
        data: agencyPaymentType,
      });
    } catch (error) {
      next(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },

  async AdminChangePasswordToAgency(req, res, next) {
    try {
      const { id } = req.params;
      const { confirmPassword } = req.body;

      // Check if the user exists
      const isExistAgency = await db.Agency.findOne({
        where: {
          id: id,
        },
      });

      if (!isExistAgency) {
        throw errorCreate(404, "Agency does not exist.");
      }


      // Update the user's password
      const [update] = await db.User.update(
        { password: confirmPassword },
        {
          where: {
            agency_id: id,
          },
        }
      );

      if (update === 0) {
        throw errorCreate(500, "Failed to update the password.");
      }

      // Send success response
      res.status(200).json({
        success: true,
        message: "Password updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
  
  async AdminChangePasswordToAgencyAgent(req, res, next) {
    try {
      const { id } = req.params;
      const { confirmPassword } = req.body;

      // Check if the user exists
      const isExistAgent = await db.User.findOne({
        where: {
          id: id,
        },
      });

      if (!isExistAgent) {
        throw errorCreate(404, "User does not exist.");
      }

      // Hash the new password

      // Update the user's password
      const [update] = await db.User.update(
        { password: confirmPassword },
        {
          where: {
            id: id,
          },
        }
      );

      if (update === 0) {
        throw errorCreate(500, "Failed to update the password.");
      }

      // Send success response
      res.status(200).json({
        success: true,
        message: "Password updated successfully.",
      });
    } catch (error) {
      next(error); // Pass error to the error-handling middleware
    }
  },

  async AdminAddNewService (req, res, next){
    try {
      const data = req.body;
      const admin = req.admin;
      console.log("is Admin", admin);
      console.log("data", data)
      
    } catch (error) {
      next(error)
    }
  },


  async example(req, res, next) {
    const id = "c56f9770-ca9b-4b80-af4a-dd8653e1f3cd";

    const EmailStatus = await SendEmail({
      to: "nahidhasan141400@gmail.com",
      bcc: [],
      attachments: [],
      html: await visaFormTemplate(),
      subject: "Astha Trip Confirm Your Agency Account",
      text: "",
    });
  },
};
