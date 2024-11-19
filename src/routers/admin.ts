import { AdministrationController } from "@/controllers/Administration/Administration.controller";
import IsAdmin from "@/middleware/auth/isAdmin";
import CreateRouter from "@/utility/CreateRouter";

const MakeRouter = new CreateRouter("/ui/admin");
const app = MakeRouter.getApp();

app.put("/admin-adit-agency-user-profile/:id", IsAdmin, AdministrationController.AdminEditAgencyUserProfile)

export default MakeRouter;
