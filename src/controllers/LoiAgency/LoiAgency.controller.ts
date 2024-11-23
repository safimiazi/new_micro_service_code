import { db } from "@/database";
import { errorCreate } from "@/middleware/errorHandler";
import { LoiAgencyServiceProvider } from "@/service/loiAgency/LoiAgency.service";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
export const LoiAgencyController = {
  async createAgency(req, res, next) {
    const files = req.files;
    let NewLoiAgency;

    try {
      const logo = files.logo ? files.logo[0].filename : null;
      const banner = files.banner ? files.banner[0].filename : null;
      const signature = files.signature ? files.signature[0].filename : null;
      const sill = files.sill ? files.sill[0].filename : null;

      // Validate required files
      if (!logo || !banner || !signature || !sill) {
        throw errorCreate(
          404,
          "All files (logo, banner, signature, sill) are required."
        );
      }

      const NewLoiAgency = await LoiAgencyServiceProvider.CreateLoiAgency({
        address: req.body.address,
        email: req.body.email,
        logo,
        name: req.body.name,
        phone: req.body.phone,
        banner,
        default: false,
        name_NRIC: req.body.name,
        signature,
        sill,
        UEN: req.body.UEN,
        status: "active",
      });

      res.send(NewLoiAgency);
    } catch (error) {
      // Delete uploaded files in case of error
      if (files.logo)
        fs.unlink(
          `${files.logo[0].destination}${files.logo[0].filename}`,
          (err) => err && console.error(err)
        );
      if (files.banner)
        fs.unlink(
          `${files.banner[0].destination}${files.banner[0].filename}`,
          (err) => err && console.error(err)
        );
      if (files.signature)
        fs.unlink(
          `${files.signature[0].destination}${files.signature[0].filename}`,
          (err) => err && console.error(err)
        );
      if (files.sill)
        fs.unlink(
          `${files.sill[0].destination}${files.sill[0].filename}`,
          (err) => err && console.error(err)
        );

      next(error);
    }
  },
  async GetAll(req, res, next) {
    try {
      const all = await db.LoiAgency.findAll();
      res.send(all);
    } catch (error) {
      next(error);
    }
  },

  async getLoiAgencyLogoBannerSillSignature(req, res, next) {
    try {
      const { image} = req.params;


   

      // Construct the full path to the image file
      const filePath = path.join(
        __dirname,
        "../../public/media/docs",
        image
      );

      console.log(filePath)

      // Check if the file exists before sending
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on server!" });
      }
    

      // Send the file as a response
      res.sendFile(filePath);
    } catch (error) {
      next(error); // Pass errors to the error-handling middleware
    }
  },


  async  AdminEditAgencyMaterial  (req, res, next) {
    try {
      // Extract ID from params and fields from req.body
      const { id } = req.params;
      const { name, email, address, phone, UEN } = req.body;
  
      // Extract file paths if files are uploaded
      const logo = req.files?.logo?.[0]?.filename || null;
      const banner = req.files?.banner?.[0]?.filename || null;
      const signature = req.files?.signature?.[0]?.filename || null;
      const sill = req.files?.sill?.[0]?.filename || null;
  
      // Retrieve the existing record to avoid overwriting with nulls
      const agency = await db.LoiAgency.findOne({ where: { id } });
  
      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }
  
      // Prepare the update payload, keeping existing values if the new value is null or undefined
      const updateData = {
        name: name ?? agency.name,
        email: email ?? agency.email,
        address: address ?? agency.address,
        phone: phone ?? agency.phone,
        uen: UEN ?? agency.UEN,
        logo: logo || agency.logo,
        banner: banner || agency.banner,
        signature: signature || agency.signature,
        sill: sill || agency.sill,
      };
    
  
      // Perform the update
      const [updated] = await db.LoiAgency.update(updateData, {
        where: { id },
      });
  
      if (updated) {
        // Fetch and return the updated record
        return res.status(200).json({
          message: "Agency material updated successfully",
          success: true,
        });
      } else {
        // No rows were affected (shouldn't happen if the record exists)
        return res.status(400).json({ message: "Update failed" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  
 async AdminDeleteLoiAgencyMaterial  (req, res) {
    try {
      const { id } = req.params;
      const deleted = await db.LoiAgency.destroy({ where: { id } });
  
      if (deleted) {
        return res.status(200).json({ message: "Data deleted successfully." });
      } else {
        return res.status(404).json({ message: "Data not found." });
      }
    } catch (error) {
      console.error("Error deleting Data:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
  
};
