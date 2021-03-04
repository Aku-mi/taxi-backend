import { Router } from "express";
import { indexController } from "../controllers/index.controller";
import authRoutes from "./auth.routes";
import dataRoutes from "./data.routes";

const router: Router = Router();

router.get("/", indexController.index);

router.get("/datos", indexController.datos);

router.post("/enviar-data", indexController.enviarData);

router.post("/refresh_token", indexController.refreshToken);

router.post("/revoke_tokens/:id", indexController.revokeRefreshTokens);

router.use("/auth", authRoutes);

router.use("/data/:user", dataRoutes);

export default router;
