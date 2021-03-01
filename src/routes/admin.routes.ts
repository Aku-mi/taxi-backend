import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { validateToken } from "../middlewares";

const router: Router = Router();

router.get("/users", validateToken, adminController.index);

router.delete("/delete/:id", validateToken, adminController.delete);

export default router;
