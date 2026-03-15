import { v4 as uuidv4 } from "uuid";

/**
 * Type definition for a User
 */
export type User = {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Type definition for creating a user
 */
export type CreateUserInput = Omit<User, "id"> & { id?: string };

/**
 * In-memory storage
 */
export const users: User[] = [];

/**
 * Create a new user
 */
export async function createUser(user: CreateUserInput): Promise<User> {
  const newUser: User = {
    id: user.id ?? uuidv4(),
    name: user.name,
    email: user.email,
    apiKey: user.apiKey,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  users.push(newUser);
  return newUser;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  return users.find((u) => u.email === email);
}
