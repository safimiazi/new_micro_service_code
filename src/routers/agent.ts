import { AdministrationController } from "@/controllers/Administration/Administration.controller";
import { AgencyController } from "@/controllers/agency/Agency.controller";
import { AgencyUserController } from "@/controllers/agency/AgencyUser.controller";
import IsAdmin from "@/middleware/auth/isAdmin";
import { isAgency } from "@/middleware/auth/isAgent";
import getMulter from "@/middleware/multer/multer";
import CreateRouter from "@CreateRoute";

// create registration route
const MakeRouter = new CreateRouter("/ui/agent");
const app = MakeRouter.getApp();
const upload = getMulter({
    destination: './uploads', // Define the folder for saving the uploaded files
    regex: /jpeg|jpg|png/, // Allowed file extensions
    images: 'jpg, jpeg, png' // This will be used in error messages if the file format is not allowed
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
  ]), AgencyController.CreateNewAgencyUser )

// authentication
app.post("/login", AgencyUserController.Login);
//
app.get("/all-agency", IsAdmin, AgencyController.GetAll);

export default MakeRouter;
