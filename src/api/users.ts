import { Request, Response } from "express";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { respondWithError, respondWithJSON } from "./json.js";
import { createUser, getUserByEmail, User } from "../db/queries/users.js";
/**
 * Get current user info
 */
export async function handlerUsersGet(
  req: Request,
  res: Response,
  user: User
) {
  try {
    respondWithJSON(res, 200, user);
  } catch (err) {
    respondWithError(res, 500, "Couldn't retrieve user", err);
  }
}

/**
 * Create a new user
 */
export async function handlerUsersCreate(req: Request, res: Response) {
  try {
    const { email, name } = req.body;

    if (
      !email ||
      !name ||
      typeof email !== "string" ||
      typeof name !== "string" ||
      email.trim() === "" ||
      name.trim() === ""
    ) {
      return respondWithError(res, 400, "Invalid or missing fields");
    }

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    const existingUser = await getUserByEmail(trimmedEmail);
    if (existingUser) {
      return respondWithError(res, 409, "User already exists");
    }

    const apiKey = crypto.randomBytes(32).toString("hex");
    const userId = uuidv4();

    await createUser({
      id: userId,
      name: trimmedName,
      email: trimmedEmail,
      apiKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const createdUser = await getUserByEmail(trimmedEmail);

    respondWithJSON(res, 201, createdUser);
  } catch (err) {
    respondWithError(res, 500, "Couldn't create user", err);
  }
}
