import { Request, Response } from "express";
import { Data } from "../libs/interfaces";
import * as psql from "../database/psql";

class DataController {
  public async index(req: Request, res: Response): Promise<void> {
    const { user } = req.params;
    if (req.user === user) {
      const _data: Data[] = await psql.getByUid(req.id);
      if (_data) {
        const data_ = _data.map((d) => ({
          lat: parseFloat(d.lat),
          lng: parseFloat(d.lng),
          tmp: d.tmp,
        }));

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

        res.json({ ok: true, data });
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
