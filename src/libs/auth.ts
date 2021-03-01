import config from "../config/config";
import { User } from "./interfaces";
import { sign } from "jsonwebtoken";
import { CookieOptions } from "express";

export const createAcessToken = (user: User): string => {
  return sign(
    { user: user.user, _id: user._id, role: user.role.name },
    config.JWT.ACCESS,
    {
      expiresIn: "15m",
    }
  );
};

export const createRefreshToken = (user: User): string => {
  return sign(
    {
      user: user.user,
      _id: user._id,
      role: user.role.name,
      tokenVersion: user.tokenVersion,
    },
    config.JWT.REFRESH,
    {
      expiresIn: "1d",
    }
  );
};

export const cookieConf: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/api/refresh_token",
};
