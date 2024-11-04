

import { agentController } from "@/controllers/Administration/agent.controller";
import CreateRouter from "@CreateRoute";

// create registration route
const MakeRouter = new CreateRouter("/ui/agent/auth");
const app = MakeRouter.getApp();

app.post("/agent-registration", agentController.agentRegistration)
// create agent registration:


export default MakeRouter;
