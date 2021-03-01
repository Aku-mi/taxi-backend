import { Router } from "express";
import { dataController } from "../controllers/data.controller";
import { validateToken } from "../middlewares";

const router: Router = Router({ mergeParams: true });

router.get("/all", validateToken, dataController.index);

router.get("/details/:id", validateToken, dataController.details);

router.get("/last-one", validateToken, dataController.lastOne);

router.post("/add", validateToken, dataController.add);

router.delete("/delete/:id", validateToken, dataController.delete);

router.delete("/delete-all", validateToken, dataController.deleteAll);

export default router;
