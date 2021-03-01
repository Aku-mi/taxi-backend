import { Schema, model, Model } from "mongoose";
import { User } from "../libs/interfaces";
import bcrypt from "bcryptjs";

export interface UserModel extends Model<User> {
  comparePassword: (password: string, receivedPassword: string) => string;
  encryptPassword: (password: string) => string;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    role: {
      ref: "Role",
      type: Schema.Types.ObjectId,
    },
    data: [
      {
        ref: "Data",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.static(
  "encryptPassword",
  async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
);

userSchema.static(
  "comparePassword",
  async (password: string, receivedPassword: string): Promise<boolean> =>
    await bcrypt.compare(password, receivedPassword)
);

const user: UserModel = model<User, UserModel>("User", userSchema);

export default user;
