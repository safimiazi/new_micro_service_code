import { AdministrationService } from "@/service/administration/Administration.service";

export const AdministrationController = {
  async Login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log("🚀 ~ Login ~ req.body:", req.body);
      console.log("🚀 ~ Login ~ req.cookies:", req.cookies);
      await AdministrationService.Login(email, password, res);
    } catch (error) {
      next(error);
    }
  },
};
