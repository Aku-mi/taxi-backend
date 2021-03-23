import { Request, Response } from "express";
import { Data } from "../libs/interfaces";
import * as psql from "../database/psql";

class DataController {
  public async index(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    if (req.user === user) {
      const data: Data[] = await psql.getByUid(req.id);
      if (data) {
        const _data: Data[] = data.filter((d) => ({
          id: d.id,
          lat: parseFloat(d.lat),
          lng: parseFloat(d.lng),
          tmp: d.tmp,
          uid: d.uid,
        }));
        res.json({ ok: true, data: _data.reverse() });
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
      const _data: Data = await psql.getById(id);
      if (_data) {
        res.json({
          ok: true,
          data: {
            id: _data.id,
            lat: parseFloat(_data.lat),
            lng: parseFloat(_data.lng),
            tmp: _data.tmp,
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
        const data: Data[] = await psql.getByUid(req.id);

        if (data) {
          res.json({
            ok: true,
            data: {
              id: data[data.length - 1].id,
              lat: parseFloat(data[data.length - 1].lat),
              lng: parseFloat(data[data.length - 1].lng),
              tmp: data[data.length - 1].tmp,
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
      const _data: Data = await psql.insert(lat, lng, tmp, req.id);
      res.json({
        ok: true,
        data: {
          id: _data.id,
          lat: parseFloat(_data.lat),
          lng: parseFloat(_data.lng),
          tmp: _data.tmp,
        },
      });
    } else {
      res.json({ ok: false });
    }
  }
  public async delete(req: Request, res: Response): Promise<void> {
    const { user, id } = req.params;
    if (req.user === user) {
      const _data: Data = await psql.deleteById(id);
      if (_data) {
        res.json({
          ok: true,
          data: {
            id: _data.id,
            lat: parseFloat(_data.lat),
            lng: parseFloat(_data.lng),
            tmp: _data.tmp,
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
      const _: Data[] = await psql.deleteByUid(req.id);
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  }
}

export const dataController = new DataController();
