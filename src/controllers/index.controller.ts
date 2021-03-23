import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import config from "../config/config";
import { cookieConf, createAcessToken, createRefreshToken } from "../libs/auth";
import { Payload, User } from "../libs/interfaces";
import User_ from "../models/user";
import * as psql from "../database/psql";
import { Data } from "../libs/interfaces";

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

  public async datos(_req: Request, res: Response): Promise<void> {
    const data: Data[] = await psql.getAll();
    const _data = data[data.length - 1];
    res.status(200).json({
      data: {
        lat: parseFloat(_data.lat),
        lng: parseFloat(_data.lng),
        tmp: _data.tmp,
      },
    });
  }

  public async enviarData(req: Request, res: Response): Promise<void> {
    const { lat, lng, tmp } = req.body;

    const _: Data = await psql.insert(lat, lng, tmp, "test");

    res.status(200).json({ ok: true });
  }
}

export const indexController = new IndexController();
