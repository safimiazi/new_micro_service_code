import { EmailControllers } from "@/controllers/emailController";
import CreateRouter from "@/utility/CreateRouter";

const MakeRouter = new CreateRouter("/ui/send-email");
const app = MakeRouter.getApp();


app.post("/send", EmailControllers.sendEmail)



export default MakeRouter;