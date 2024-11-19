import path from "path";
import { AdministrationController } from "@/controllers/Administration/Administration.controller";
import { AgencyController } from "@/controllers/agency/Agency.controller";
import { AgencyUserController } from "@/controllers/agency/AgencyUser.controller";
import IsAdmin from "@/middleware/auth/isAdmin";
import { isAgency } from "@/middleware/auth/isAgent";
import getMulter from "@/middleware/multer/multer";
import CreateRouter from "@CreateRoute";
import { LoiAgencyController } from "@/controllers/LoiAgency/LoiAgency.controller";


// create registration route
const MakeRouter = new CreateRouter("/files");
const app = MakeRouter.getApp();

// agent-profile
app.get("/agent-profile/:image", isAgency, AgencyController.getProfileFiles);
app.get("/admin-see-agency-user-profile-photo/:image", IsAdmin, AgencyController.AdminSeeAgencyUsersProfile);
app.get("/get-agency-profile/:image/:id" , AgencyController.getAgencyProfileFiles);
app.get("/get-agency-profile-cover-photo/:image" , isAgency, AgencyController.getAgencyProfileAndCoverPhoto);

// for show 4 images in edit time
app.get("/get-loi-agency-images/:image", IsAdmin, LoiAgencyController.getLoiAgencyLogoBannerSillSignature);

export default MakeRouter;
