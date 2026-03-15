import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { respondWithError, respondWithJSON } from "./json.js";
import { createNote, getNote, getNotesForUser } from "../db/queries/notes.js";
import { User } from "../db/schema.js";

/**
 * Handler to get all notes for a user
 */
export async function handlerNotesGet(req: Request, res: Response, user: User) {
  try {
    const notes = await getNotesForUser(user.id);
    respondWithJSON(res, 200, notes);
  } catch (err) {
    respondWithError(res, 500, "Couldn't retrieve notes", err);
  }
}

/**
 * Handler to create a new note for a user
 */
export async function handlerNotesCreate(
  req: Request,
  res: Response,
  user: User,
) {
  try {
    const body = req.body;

    // Validate input
    if (!body || typeof body.note !== "string" || body.note.trim() === "") {
      return respondWithError(res, 400, "Invalid or missing 'note' field");
    }

    const noteContent = body.note.trim();
    const noteId = uuidv4();

    // Create note in the database
    await createNote({
      id: noteId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      note: noteContent,
      userId: user.id,
    });

    // Retrieve the created note
    const createdNote = await getNote(noteId);

    respondWithJSON(res, 201, createdNote);
  } catch (err) {
    respondWithError(res, 500, "Couldn't create note", err);
  }
}
