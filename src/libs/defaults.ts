import { User } from "./interfaces";
import User_ from "../models/user";

export const DefUser: User = new User_({
  name: "",
  user: "",
  password: "",
});
