import { db } from "@/database";
import { AdministrationService } from "@/service/administration/Administration.service";

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

      res
        .status(200)
        .json({
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
      const { balance, rate, type } = req.body;

      if (!balance || !rate || !type) {
        return res.status(400).json({
          message: "Balance, rate and type are required.",
        });
      }

      // Find or create the agency balance
      const [agencyBalance] = await db.AgencyBalance.findOrCreate({
        where: { agency_id: id },
        defaults: { balance, rate, type },
      });

      if (!agencyBalance.isNewRecord) {
        // Update the existing balance
        agencyBalance.balance = String(
          Number(agencyBalance.balance) + Number(balance)
        );
        agencyBalance.rate = rate || agencyBalance.rate;
        agencyBalance.type = type;
        await agencyBalance.save();
      }

      res.status(200).json({
        message: "Agency balance updated successfully.",
        data: agencyBalance,
      });
    } catch (error) {
      console.error("Error updating agency balance:", error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
