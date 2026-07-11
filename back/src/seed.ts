import fs from "node:fs";
import path from "node:path";
import db, { insertCommentRow } from "./db.js";

export const seedIfEmpty = () => {
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM comments")
    .get() as { count: number };

  if (count > 0) return;

  const filePath = path.join(process.cwd(), "data", "data.json");
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const cleaned = rawContent.replace(/^\uFEFF/, "");
  const data = JSON.parse(cleaned);

  for (const comment of data.comments) {
    const result = insertCommentRow({
      content: comment.content,
      createdAt: comment.createdAt,
      score: comment.score,
      username: comment.user.username,
      imagePng: comment.user.image.png,
      imageWebp: comment.user.image.webp,
      parentId: null,
      replyingTo: null,
    });
    for (const reply of comment.replies) {
      insertCommentRow({
        content: reply.content,
        createdAt: reply.createdAt,
        score: reply.score,
        username: reply.user.username,
        imagePng: reply.user.image.png,
        imageWebp: reply.user.image.webp,
        parentId: Number(result.lastInsertRowid),
        replyingTo: reply.replyingTo,
      });
    }
  }
};
