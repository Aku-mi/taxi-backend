import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import adminRoutes from "./admin.routes";

const router: Router = Router();

router.post("/sign-in", authController.signIn);

router.post("/sign-up", authController.signUp);

router.post("/log-out", authController.logOut);

router.use("/admin", adminRoutes);

export default router;
