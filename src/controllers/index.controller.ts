import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import config from "../config/config";
import { cookieConf, createAcessToken, createRefreshToken } from "../libs/auth";
import { Payload, User } from "../libs/interfaces";
import User_ from "../models/user";

class IndexController {
  public index(_req: Request, res: Response): void {
    res.json({
      message: "Hello",
    });
  }
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const token = req.cookies.jid;
    if (!token) {
      res.json({
        ok: false,
        accessToken: "",
      });
    } else {
      try {
        const payload = verify(token, config.JWT.REFRESH) as Payload;
        const user: User = await User_.findById(payload._id);
        if (!user) {
          res.json({
            ok: false,
            accessToken: "",
          });
        } else {
          if (user.tokenVersion !== payload.tokenVersion) {
            res.json({
              ok: false,
              accessToken: "",
            });
          } else {
            res.cookie("jid", createRefreshToken(user), cookieConf);
            res.json({
              ok: true,
              accessToken: createAcessToken(user),
            });
          }
        }
      } catch (error) {
        res.json({
          ok: false,
          accessToken: "",
        });
      }
    }
  }
  public async revokeRefreshTokens(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user: User = await User_.findById(id);
    if (user) {
      user.tokenVersion += 1;
      await user.save();
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  }
}

export const indexController = new IndexController();
