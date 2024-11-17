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
const MakeRouter = new CreateRouter("/ui/agent");
const app = MakeRouter.getApp();
const upload = getMulter({
    destination: Destination, 
    regex: /jpeg|jpg|png/, 
    images: 'jpg, jpeg, png' 
  });

app.post("/agent-registration", AgencyController.CreateAgencyWithAdmin);
app.post("/otp-validation", AgencyController.otpValidation);
app.post("/agent-request-handel", AgencyController.ApproveAgency);
app.post("/set-agent-password", AgencyController.SetAgencyPassword)


app.post("/agent-login", AgencyController.AgencyLogin)
app.get("/login-agent", isAgency, AdministrationController.getAgent);
app.post("/create-agency-new-user", isAgency,  upload.fields([
    { name: 'profilePhoto', maxCount: 1 }, 
    { name: 'coverPhoto', maxCount: 1 } 
  ]), AgencyController.CreateNewAgencyUser );
app.get("/get-agency-users", isAgency, AgencyController.GetAgencyUsers)
app.get("/get-agency-single-user", isAgency, AgencyController.GetAgencySingleUser)
app.get("/get-agency-single-user", isAgency, AgencyController.DeleteAgencySingleUser)

// password change of agency user:
app.post("/password-change-agency-user",isAgency, AgencyController.PasswordChangeAgencyUser)
app.post("/agency-pass-change-by-agency",isAgency, AgencyController.AgencyPassChangeByAgency)

// agency profile update:
app.post("/agency-profile-update", IsAdmin, upload.fields([
  { name: 'profilePhoto', maxCount: 1 }, 
  { name: 'coverPhoto', maxCount: 1 } 
]), AgencyController.UpdateAgencyProfile)
app.post("/agency-profile-photo-update", isAgency, upload.fields([
  { name: 'profilePhoto', maxCount: 1 }
   
]), AgencyController.agencyProfilePhotoUpdate)
app.post("/agency-cover-photo-update", isAgency, upload.fields([
  { name: 'coverPhoto', maxCount: 1 }
   
]), AgencyController.agencyCoverPhotoUpdate)

// get single agency:
app.get("/get-single-agency", IsAdmin, AgencyController.GetSingleAgency)
app.get("/get-agency-profile-info", isAgency, AgencyController.getAgencyProfileInfo)
// authentication
app.post("/login", AgencyUserController.Login);
//
app.get("/all-agency", IsAdmin, AgencyController.GetAll);

export default MakeRouter;
