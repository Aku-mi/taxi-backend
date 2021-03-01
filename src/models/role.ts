import { Schema, model } from "mongoose";
import { Role } from "../libs/interfaces";

const roleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);

export default model<Role>("Role", roleSchema);
