import { AdministrationController } from "@/controllers/Administration/Administration.controller";
import IsUser from "@/middleware/auth/isUser";
import CreateRouter from "@CreateRoute";

// create registration route
const MakeRouter = new CreateRouter("/ui/admin/auth");
const app = MakeRouter.getApp();

app.post("/login", AdministrationController.Login);

export default MakeRouter;
