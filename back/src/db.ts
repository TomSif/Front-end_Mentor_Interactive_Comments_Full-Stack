import { DatabaseSync } from "node:sqlite";

const DB_PATH = process.env.DB_PATH ?? "data.sqlite";

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    score INTEGER NOT NULL,
    username TEXT NOT NULL,
    image_png TEXT NOT NULL,
    image_webp TEXT NOT NULL,
    parent_id  INTEGER,
    replying_to TEXT
  )
`);
export default db;

export interface InsertCommentRowParams {
  content: string;
  createdAt: string;
  score: number;
  username: string;
  imagePng: string;
  imageWebp: string;
  parentId: number | null;
  replyingTo: string | null;
}

export const insertCommentRow = (row: InsertCommentRowParams) => {
  const insert = db.prepare(`
      INSERT INTO comments (content, created_at, score, username, image_png, image_webp, parent_id, replying_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

  const result = insert.run(
    row.content,
    row.createdAt,
    row.score,
    row.username,
    row.imagePng,
    row.imageWebp,
    row.parentId,
    row.replyingTo,
  );

  return result;
};
