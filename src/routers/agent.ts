import { AgencyController } from "@/controllers/agency/Agency.controller";
import { AgencyUserController } from "@/controllers/agency/AgencyUser.controller";
import CreateRouter from "@CreateRoute";

// create registration route
const MakeRouter = new CreateRouter("/ui/agent");
const app = MakeRouter.getApp();

app.post("/agent-registration", AgencyController.CreateAgencyWithAdmin);
app.post("/otp-validation", AgencyController.otpValidation);
// create agent registration:
// authentication
app.post("/login", AgencyUserController.Login);

export default MakeRouter;
