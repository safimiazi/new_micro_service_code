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
      const { image, id } = req.params;

      console.log("image", image);

      // Find user by ID with the profile or cover photo matching the image parameter
      const User = await db.LoiAgency.findOne({
        where: {
          id: id,
          [Op.or]: {
            banner: image,
            logo: image,
            signature: image,
            sill: image,
          },
        },
      });

      if (!User) {
        return res.status(404).json({ message: "Image not found!" });
      }

      // Construct the full path to the image file
      const filePath = path.join(
        __dirname,
        "../public/media/docs",
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
  },
};
