import path from "path";
import { AdministrationController } from "@/controllers/Administration/Administration.controller";
import { AgencyController } from "@/controllers/agency/Agency.controller";
import { AgencyUserController } from "@/controllers/agency/AgencyUser.controller";
import IsAdmin from "@/middleware/auth/isAdmin";
import { isAgency } from "@/middleware/auth/isAgent";
import getMulter from "@/middleware/multer/multer";
import CreateRouter from "@CreateRoute";

const Destination = path.join(__dirname, "..", 'privet_assets/agent_profile')

// create registration route
const MakeRouter = new CreateRouter("/files");
const app = MakeRouter.getApp();

// agent-profile
app.get("/agent-profile/:image", isAgency, AgencyController.getProfileFiles);
app.get("/get-agency-profile/:image/:id" , AgencyController.getAgencyProfileFiles);

export default MakeRouter;
