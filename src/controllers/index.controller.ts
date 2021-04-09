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

  public async datos2(_req: Request, res: Response): Promise<void> {
    const _data: Data[] = await psql.getAll();
    const data_ = _data.map((d) => {
      return {
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lng),
        tmp: d.tmp,
      };
    });

    let data = [data_[0]];

    const deg2rad = (deg: number) => {
      return deg * (Math.PI / 180);
    };

    const getDistanceKm = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) => {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1); // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    };

    for (let i = 0; i < data_.length - 1; i++) {
      for (let j = i + 1; j < i + 2; j++) {
        if (
          getDistanceKm(
            data_[i].lat,
            data_[j].lat,
            data_[i].lng,
            data_[j].lng
          ) > 0.01
        ) {
          data.push(data_[j]);
        }
      }
    }

    res.status(200).json({
      data,
    });
  }

  public async enviarData(req: Request, res: Response): Promise<void> {
    const { lat, lng, tmp } = req.body;

    const _: Data = await psql.insert(lat, lng, tmp, "test");

    res.status(200).json({ ok: true });
  }

  public async timeSet(req: Request, res: Response): Promise<void> {
    const { tmp1, tmp2 } = req.body;
    const _data: Data[] = await psql.getAll();
    const data_ = _data.map((d) => {
      return {
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lng),
        tmp: d.tmp,
      };
    });

    let data = [data_[0]];

    const deg2rad = (deg: number) => {
      return deg * (Math.PI / 180);
    };

    const getDistanceKm = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) => {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1); // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    };

    for (let i = 0; i < data_.length - 1; i++) {
      for (let j = i + 1; j < i + 2; j++) {
        if (
          getDistanceKm(
            data_[i].lat,
            data_[j].lat,
            data_[i].lng,
            data_[j].lng
          ) > 0.01
        ) {
          data.push(data_[j]);
        }
      }
    }

    let _data_ = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].tmp > tmp1 && data[i].tmp < tmp2) {
        _data_.push(data[i]);
      }
    }

    res.status(200).json({
      data: _data_,
    });
  }
}

export const indexController = new IndexController();
