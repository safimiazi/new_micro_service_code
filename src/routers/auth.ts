import { AdministrationController } from "@/controllers/Administration/Administration.controller";
import IsAdmin from "@/middleware/auth/isAdmin";
import { isAgent } from "@/middleware/auth/isAgent";

import CreateRouter from "@CreateRoute";

// create registration route
const MakeRouter = new CreateRouter("/ui/admin/auth");
const app = MakeRouter.getApp();

const MakeAgentRouter = new CreateRouter("/ui/agent/auth");

const agentApp = MakeAgentRouter.getApp()


app.post("/login", AdministrationController.Login);
app.get("/login-admin", IsAdmin, AdministrationController.GetAdmin);



// create agent registration:


export default MakeRouter;
