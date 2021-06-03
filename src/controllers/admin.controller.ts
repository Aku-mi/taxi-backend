import { Request, Response } from "express";
import { User } from "../libs/interfaces";
import User_ from "../models/user";

class AdminController {
  public async index(req: Request, res: Response): Promise<void> {
    if (req.role === "admin") {
      const _users: User[] = await User_.find().populate("role");

      if (_users) {
        const users = _users
          .map((u) => {
            if (u.role.name !== "admin") {
              return {
                name: u.name,
                id: u._id,
                user: u.user,
                role: u.role.name,
              };
            }
          })
          .filter((u) => u !== undefined);

        res.json({
          ok: true,
          users,
        });
      } else {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    if (req.role == "admin") {
      const { id } = req.params;
      try {
        const user: User = await User_.findById(id).populate("role");
        if (user && user.role.name !== "admin") {
          await User_.findByIdAndDelete(id);
          res.json({ ok: true });
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
}

export const adminController = new AdminController();
