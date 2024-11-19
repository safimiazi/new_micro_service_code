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
  
      // Fetch the current data for the user
      const existingUser = await db.User.findOne({ where: { id } });
  
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Prepare update data by merging existing fields with new ones
      const updateData = {
        name: name || existingUser.name,
        email: email || existingUser.email,
        phone: phone || existingUser.phone,
        designation: designation || existingUser.designation,
        status: status || existingUser.status,
        coverPhoto: req.files.coverPhoto[0].filename || existingUser.coverPhoto,
        profilePhoto: req.files.profilePhoto[0].filename || existingUser.profilePhoto
      };
  
      
      // Update the user in the database
      const [updatedCount] = await db.User.update(updateData, {
        where: { id },
      });
  
      if (updatedCount === 0) {
        return res.status(400).json({ message: "No changes were made" });
      }
  
      res.status(200).json({ message: "User profile updated successfully", data: updateData });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
};
