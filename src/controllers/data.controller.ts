import { Request, Response } from "express";
import Data_ from "../models/data";
import User_ from "../models/user";
import { Data, User } from "../libs/interfaces";

class DataController {
  public async index(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    if (req.user === user) {
      const data: Data[] = (await User_.findById(req.id).populate("data")).data;
      if (data) {
        const _data: Data[] = data.sort((a, b) => {
          if (a.tmp && b.tmp) return b.tmp - a.tmp;
          else return 2;
        });

        const toSend = _data.map((d) => {
          return {
            lat: d.lat,
            lng: d.lng,
            tmp: d.tmp,
            id: d._id,
          };
        });

        res.json({ ok: true, data: toSend });
      } else {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async details(req: Request, res: Response): Promise<void> {
    const { user, id } = req.params;
    if (req.user === user) {
      const data: Data = await Data_.findById(id);
      if (data) {
        res.json({
          ok: true,
          data: {
            lat: data.lat,
            lng: data.lng,
            tmp: data.tmp,
            id: data._id,
          },
        });
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
        const data: Data[] = await Data_.find()
          .sort({ createdAt: -1 })
          .limit(1);
        if (data) {
          res.json({
            ok: true,
            data: {
              id: data[0]._id,
              lat: data[0].lat,
              lng: data[0].lng,
              tmp: data[0].tmp,
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
    console.log(req.body);

    const { user } = req.params;
    if (req.user === user) {
      const { lat, lng, tmp } = req.body;
      const user: User = await User_.findById(req.id).populate("data");
      const data: Data = new Data_({
        lat,
        lng,
        tmp,
      });
      await data.save();
      user.data.push(data);
      await user.save();
      res.json({
        ok: true,
        data: {
          lat: data.lat,
          lng: data.lng,
          tmp: data.tmp,
          id: data._id,
        },
      });
    } else {
      res.json({ ok: false });
    }
  }
  public async delete(req: Request, res: Response): Promise<void> {
    const { user, id } = req.params;
    if (req.user === user) {
      const data: Data = await Data_.findByIdAndDelete(id);
      if (data) {
        res.json({
          ok: true,
          data: {
            lat: data.lat,
            lng: data.lng,
            tmp: data.tmp,
            id: data._id,
          },
        });
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
      const data: Data[] = (await User_.findById(req.id)).data;
      if (data) {
        data.forEach(async (d) => await Data_.findByIdAndDelete(d._id));
        res.json({ ok: true });
      } else {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }
}

export const dataController = new DataController();
