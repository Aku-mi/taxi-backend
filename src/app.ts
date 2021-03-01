import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/config";
import { createRoles } from "./libs/initialSetup";

//import Routes
import indexRoutes from "./routes/index.routes";

//Inits
const app = express();
import "./database";
createRoles();

//settings
app.set("port", config.PORT);

//Middlewares
app.use(
  cors({
    origin: config.CORS.ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.use("/api", indexRoutes);

export default app;
