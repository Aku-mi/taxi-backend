import { Request, Response } from "express";
import { Data, User } from "../libs/interfaces";
import User_ from "../models/user";
import * as psql from "../database/psql";
import { getDistanceKm, getRandomColor } from "../libs/helpers";

class DataController {
  public async index(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    if (req.user === user) {
      const _data: Data[] = await psql.getByUid(req.id);
      if (_data) {
        const data = _data.map((d) => {
          return {
            id: d.id,
            lat: parseFloat(d.lat),
            lng: parseFloat(d.lng),
            tmp: parseInt(d.tmp as any),
            uid: d.uid,
            pathColor: getRandomColor(),
          };
        });

        res.json({ ok: true, data });
      } else {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async lastOne(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    if (req.user === user) {
      try {
        const data: Data = await psql.getLastOneByUid(req.id);

        if (data) {
          res.json({
            ok: true,
            data: {
              id: data.id,
              lat: parseFloat(data.lat),
              lng: parseFloat(data.lng),
              tmp: parseInt(data.tmp as any),
              uid: data.uid,
              pathColor: getRandomColor(),
            },
          });
        } else {
          res.json({ ok: false });
        }
      } catch (error) {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async add(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    if (req.user === user) {
      const { lat, lng, tmp }: { lat: number; lng: number; tmp: number } =
        req.body;
      const data: Data = await psql.getLastOneByUid(req.id);
      const dist = getDistanceKm(
        parseFloat(data.lat),
        parseFloat(data.lng),
        lat,
        lng
      );

      if (dist > 0.01) {
        const _data: Data[] = await psql.insert(lat, lng, tmp, req.id, 0, 0);
        if (_data) res.json({ ok: true });
        else res.json({ ok: false });
      } else {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async deleteAll(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    if (req.user === user) {
      const _: Data[] = await psql.deleteByUid(req.id);
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  }

  public async timeSet(req: Request, res: Response): Promise<void> {
    const { tmp1, tmp2 }: { tmp1: number; tmp2: number } = req.body;
    const { uid } = req.params;
    const _data: Data[] = await psql.timeSetByUid(uid, tmp1, tmp2);

    const data = _data.map((d) => {
      return {
        id: d.id,
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lng),
        tmp: parseInt(d.tmp as any),
        uid: d.uid,
        pathColor: getRandomColor(),
      };
    });

    res.status(200).json({
      data,
    });
  }

  public async areaSet(req: Request, res: Response): Promise<void> {
    const {
      lat,
      lng,
      tmp1,
      tmp2,
    }: { lat: number; lng: number; tmp1: number; tmp2: number } = req.body;
    const { uid } = req.params;
    const _data: Data[] = await psql.areaSetByUid(uid, tmp1, tmp2, lat, lng);

    const data = _data.map((d) => {
      return {
        id: d.id,
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lng),
        tmp: parseInt(d.tmp as any),
        uid: d.uid,
        pathColor: getRandomColor(),
      };
    });

    res.status(200).json({
      data,
    });
  }

  public async timeSetAll(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    const { tmp1, tmp2 }: { tmp1: number; tmp2: number } = req.body;
    if (req.user === user) {
      const _users: User[] = await User_.find().populate("role");
      if (_users) {
        const users = _users
          .map((u) => {
            if (u.role.name !== "admin") {
              return {
                name: u.name,
                id: u._id?.toString(),
                user: u.user,
                role: u.role.name,
              };
            }
          })
          .filter((u) => u !== undefined);
        let dd: any = [];
        for (let i = 0; i < users.length; i++) {
          const aux = await await psql.timeSetByUid(
            users[i]?.id || "",
            tmp1,
            tmp2
          );

          const aux2 = aux.map((d) => {
            return {
              id: d.id,
              lat: parseFloat(d.lat),
              lng: parseFloat(d.lng),
              tmp: parseInt(d.tmp),
              uid: d.uid,
              pathColor: getRandomColor(),
            };
          });
          dd.push(aux2);
        }

        res.json({ ok: true, data: dd.filter((d: []) => d.length > 0) });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async getAllUsersLastData(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    if (req.user === user) {
      const _users: User[] = await User_.find().populate("role");
      if (_users) {
        const users = _users
          .map((u) => {
            if (u.role.name !== "admin") {
              return {
                name: u.name,
                id: u._id?.toString(),
                user: u.user,
                role: u.role.name,
              };
            }
          })
          .filter((u) => u !== undefined);

        let dd: any = [];

        for (let i = 0; i < users.length; i++) {
          const aux = await psql.getLastOneByUid(users[i]?.id || "");
          if (aux) {
            dd.push({
              id: aux.id,
              lat: parseFloat(aux.lat),
              lng: parseFloat(aux.lng),
              tmp: parseInt(aux.tmp),
              uid: aux.uid,
              pathColor: getRandomColor(),
            });
          }
        }
        res.json({ ok: true, data: dd });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async getUsers(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    if (req.user === user) {
      const _users: User[] = await User_.find().populate("role");
      if (_users) {
        const users = _users
          .map((u) => {
            if (u.role.name !== "admin") {
              return {
                id: u._id?.toString(),
                name: u.user,
              };
            }
          })
          .filter((u) => u !== undefined);

        res.json({ ok: true, data: users });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async addTemp2(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    res.json({ ok: false });
  }

  public async addTemp(req: Request, res: Response): Promise<void> {
    const {
      lat,
      lng,
      tmp,
    }: { lat: number; lng: number; tmp: number; rpm: number; speed: number } =
      req.body;

    console.log(lat, lng, tmp);

    const data: Data = await psql.getLastOneByUid("605b6ddde2b2526a3adb35bf");
    const dist = getDistanceKm(
      parseFloat(data.lat),
      parseFloat(data.lng),
      lat,
      lng
    );

    if (dist > 0.01) {
      const _data: Data[] = await psql.insert(
        lat,
        lng,
        tmp,
        "605b6ddde2b2526a3adb35bf",
        0,
        0
      );
      if (_data) res.json({ ok: true });
      else res.json({ ok: false });
    } else {
      res.json({ ok: false });
    }
  }
  public async getChartByUid(req: Request, res: Response): Promise<void> {
    const { user, uid } = req.params;
    const { tmp1, tmp2 }: { tmp1: number; tmp2: number } = req.body;
    if (req.user === user) {
      const data_ = await psql.chartSetByUid(uid, tmp1, tmp2);
      const data = data_.map((d) => ({
        speed: parseInt(d.speed),
        rpm: parseInt(d.rpm),
        tmp: parseInt(d.tmp),
      }));
      res.json({ ok: true, data });
    } else {
      res.json({ ok: false });
    }
  }
  public async getChartAll(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    const { tmp1, tmp2 }: { tmp1: number; tmp2: number } = req.body;
    if (req.user === user) {
      const data_ = await psql.chartSetAll(tmp1, tmp2);
      const data = data_.map((d) => ({
        speedA: parseInt(d.speeda),
        rpmA: parseInt(d.rpma),
      }));
      res.json({ ok: true, data });
    } else {
      res.json({ ok: false });
    }
  }
}

export const dataController = new DataController();
