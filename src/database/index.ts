import mongoose, { ConnectionOptions } from "mongoose";
import config from "../config/config";

const dbOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(config.DB.URI, dbOptions);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongodb Connection stablished");
});

connection.on("error", (err) => {
  console.log("Mongodb connection error:", err);
  process.exit(0);
});
