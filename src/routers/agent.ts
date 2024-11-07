import { agencyControllers } from "@/controllers/Administration/agent.controller";
import CreateRouter from "@CreateRoute";

// create registration route
const MakeRouter = new CreateRouter("/ui/agent");
const app = MakeRouter.getApp();

app.post("/agent-registration", agencyControllers.agencyRegistration);
// create agent registration:

export default MakeRouter;
