import { AdministrationController } from "@/controllers/Administration/Administration.controller";
import IsAdmin from "@/middleware/auth/isAdmin";
import getMulter from "@/middleware/multer/multer";
import CreateRouter from "@/utility/CreateRouter";
import path from "path";

const MakeRouter = new CreateRouter("/ui/admin");
const app = MakeRouter.getApp();
const Destination = path.join(__dirname, "..", 'privet_assets/agent_profile')
const upload = getMulter({
    destination: Destination, 
    regex: /jpeg|jpg|png/, 
    images: 'jpg, jpeg, png' 
  });

app.put("/admin-adit-agency-user-profile/:id", IsAdmin, upload.fields([
    { name: 'profilePhoto', maxCount: 1 }, 
    { name: 'coverPhoto', maxCount: 1 } 
  ]), AdministrationController.AdminEditAgencyUserProfile)
app.post("/admin-send-balance-to-agency/:id", IsAdmin, AdministrationController.AdminSendBalanceToAgency)
app.post("/admin-change-password-to-agency/:id", IsAdmin, AdministrationController.AdminChangePasswordToAgency)
app.post("/admin-change-password-to-agency-agent/:id", IsAdmin, AdministrationController.AdminChangePasswordToAgencyAgent)
app.get("/cc", AdministrationController.example)


export default MakeRouter;
  