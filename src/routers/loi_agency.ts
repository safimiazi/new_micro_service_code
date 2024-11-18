import { AdministrationController } from "@/controllers/Administration/Administration.controller";
import { LoiAgencyController } from "@/controllers/LoiAgency/LoiAgency.controller";
import IsAdmin from "@/middleware/auth/isAdmin";
import getMulter from "@/middleware/multer/multer";

import CreateRouter from "@CreateRoute";
import path from "path";

const destination = path.join(__dirname, "..", "public/media/docs");
// create registration route
const MakeRouter = new CreateRouter("/ui/loi_agency");
const app = MakeRouter.getApp();

/**
 * @swagger
 * /ui/loi_agency/create:
 *   post:
 *     summary: Create a new agency
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *               banner:
 *                 type: string
 *                 format: binary
 *               signature:
 *                 type: string
 *                 format: binary
 *               sill:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Agency created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
app.post(
  "/create",
  IsAdmin,
  getMulter({
    destination: destination,
  }).fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "sill", maxCount: 1 },
  ]),
  LoiAgencyController.createAgency
);

app.get("/get-all-loi-agency",IsAdmin, LoiAgencyController.GetAll)

export default MakeRouter;
