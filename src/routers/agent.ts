import { AdministrationController } from "@/controllers/Administration/Administration.controller";
import { AgencyController } from "@/controllers/agency/Agency.controller";
import { AgencyUserController } from "@/controllers/agency/AgencyUser.controller";
import IsAdmin from "@/middleware/auth/isAdmin";
import { isAgent } from "@/middleware/auth/isAgent";
import CreateRouter from "@CreateRoute";

// create registration route
const MakeRouter = new CreateRouter("/ui/agent");
const app = MakeRouter.getApp();

app.post("/agent-registration", AgencyController.CreateAgencyWithAdmin);
app.post("/otp-validation", AgencyController.otpValidation);
app.post("/agent-request-handel", AgencyController.ApproveAgency);
app.post("/set-agent-password", AgencyController.SetAgencyPassword)
app.post("/agent-login", AgencyController.AgencyLogin)
app.get("/login-agent", isAgent, AdministrationController.GetAdmin);

// authentication
app.post("/login", AgencyUserController.Login);
//
app.get("/all-agency", IsAdmin, AgencyController.GetAll);

export default MakeRouter;
