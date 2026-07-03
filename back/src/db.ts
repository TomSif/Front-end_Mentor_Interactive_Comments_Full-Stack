import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data.sqlite");

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
