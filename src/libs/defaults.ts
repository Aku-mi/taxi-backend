import { Data, User } from "./interfaces";
import User_ from "../models/user";
import Data_ from "../models/data";

export const DefUser: User = new User_({
  name: "",
  user: "",
  password: "",
});

export const DefData: Data = new Data_({
  lat: 0,
  lng: 0,
  exist: false,
});
