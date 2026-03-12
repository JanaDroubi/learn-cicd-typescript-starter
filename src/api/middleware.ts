import { Request, Response, NextFunction } from "express";
import { getUserByEmail, User } from "../db/queries/users.js";

export function middlewareAuth(handler: (req: Request, res: Response, user: User) => Promise<void> | void) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = await getUserByEmail("test@example.com");

      if (!user) {
        res.status(401).send("Unauthorized");
        return;
      }

      return handler(req, res, user);
    } catch (err) {
      next(err);
    }
  };
}
