import IsUser from "@/middleware/auth/isUser";
import CreateRouter from "@CreateRoute";

// create registration route
const MakeRouter = new CreateRouter("/ui/auth");
const app = MakeRouter.getApp();

// mobile app api

export default MakeRouter;
