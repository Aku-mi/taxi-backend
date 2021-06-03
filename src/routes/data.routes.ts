import { Router } from "express";
import { dataController } from "../controllers/data.controller";
import { validateToken } from "../middlewares";

const router: Router = Router({ mergeParams: true });

router.get("/", validateToken, dataController.index);

router.get("/users", validateToken, dataController.getUsers);

router.get("/all-last", validateToken, dataController.getAllUsersLastData);

router.post("/chart-all", validateToken, dataController.getChartAll);

router.post("/time-set/:uid", validateToken, dataController.timeSet);

router.post("/chart/:uid", validateToken, dataController.getChartByUid);

router.post("/time-all", validateToken, dataController.timeSetAll);

router.post("/area-set/:uid", validateToken, dataController.areaSet);

router.get("/last-one", validateToken, dataController.lastOne);

router.post("/add", validateToken, dataController.add);

router.post("/add-t", dataController.addTemp);

router.post("/add-t2", dataController.addTemp2);

router.delete("/delete-all", validateToken, dataController.deleteAll);

export default router;
