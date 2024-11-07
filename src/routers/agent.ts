import { AgencyController } from "@/controllers/agency/Agency.controller";
import CreateRouter from "@CreateRoute";

// create registration route
const MakeRouter = new CreateRouter("/ui/agent");
const app = MakeRouter.getApp();

app.post("/agent-registration", AgencyController.CreateAgencyWithAdmin);
// app.post('/otp-validation', agencyControllers.otpValidation);
// create agent registration:

export default MakeRouter;
