import { model, Schema } from "mongoose";
import { Data } from "../libs/interfaces";

const dataSchema: Schema = new Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    tmp: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model<Data>("Data", dataSchema);
