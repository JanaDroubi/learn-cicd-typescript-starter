import { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "../db/queries/users.js"; // optional

export async function middlewareAuth(handler: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Example: attach a dummy user
    const user = await getUserByEmail("test@example.com"); // optional
    if (!user) return res.status(401).send("Unauthorized");

    return handler(req, res, user);
  };
}
