import { Request, Response } from "express";
import User_ from "../models/user";
import Role_ from "../models/role";
import { User, Role } from "../libs/interfaces";
import * as defaults from "../libs/defaults";
import { cookieConf, createAcessToken, createRefreshToken } from "../libs/auth";

class AuthController {
  public async signUp(req: Request, res: Response): Promise<void | Response> {
    console.log(req.body);

    const { name, user, password, role } = req.body;

    const _user2: User = (await User_.findOne({ user })) || defaults.DefUser;

    if (_user2.user === user) {
      res.json({ ok: false });
    } else {
      const _user: User = new User_({
        name,
        user,
        password: await User_.encryptPassword(password),
      });

      if (role) {
        const foundRole: Role = await Role_.findOne({ name: role });
        if (foundRole) _user.role = foundRole;
        else return res.json({ ok: false });
      } else {
        const roleD: Role = await Role_.findOne({ name: "user" });
        _user.role = roleD;
      }

      await _user.save();

      res.json({
        ok: true,
      });
    }
  }

  public async signIn(req: Request, res: Response): Promise<void> {
    const { user, password } = req.body;
    const _user: User =
      (await User_.findOne({ user }).populate("role")) || defaults.DefUser;

    if (_user.user) {
      const matchPass = await User_.comparePassword(password, _user.password);
      if (!matchPass) {
        res.json({ ok: false });
      } else {
        res.cookie("jid", createRefreshToken(_user), cookieConf);

        res.json({
          ok: true,
          user: {
            user: _user.user,
            name: _user.name,
            id: _user._id,
            role: _user.role.name,
            accessToken: createAcessToken(_user),
          },
        });
      }
    } else res.json({ ok: false });
  }

  public logOut(_req: Request, res: Response) {
    res.cookie("jid", "", cookieConf);
    res.json({ ok: true });
  }
}

export const authController = new AuthController();
