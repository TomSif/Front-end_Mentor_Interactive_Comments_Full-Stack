import fs from "node:fs";
import path from "node:path";
import db from "./db.js";

const filePath = path.join(
  process.cwd(),
  "..",
  "front",
  "public",
  "data",
  "data.json",
);

const rawContent = fs.readFileSync(filePath, "utf-8");
const cleaned = rawContent.replace(/^\uFEFF/, "");
const data = JSON.parse(cleaned);

const inserComment = db.prepare(
  "INSERT INTO comments (content,created_at,score,username,image_png ,image_webp,parent_id,replying_to) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)",
);

for (const comment of data.comments) {
  const result = inserComment.run(
    comment.content,
    comment.createdAt,
    comment.score,
    comment.user.username,
    comment.user.image.png,
    comment.user.image.webp,
    null,
    null,
  );
  for (const reply of comment.replies) {
    const result2 = inserComment.run(
      reply.content,
      reply.createdAt,
      reply.score,
      reply.user.username,
      reply.user.image.png,
      reply.user.image.webp,
      result.lastInsertRowid,
      reply.replyingTo,
    );
  }
}
