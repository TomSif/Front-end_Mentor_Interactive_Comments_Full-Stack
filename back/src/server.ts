import express from "express";
import db from "./db.js";
import cors from "cors";
import { seedIfEmpty } from "./seed.js";

const app = express();
app.use(express.json());

const currentUser = {
  username: "juliusomo",
  image: {
    png: "/images/avatars/image-juliusomo.png",
    webp: "/images/avatars/image-juliusomo.webp",
  },
};

app.use(cors());

app.get("/", (req, res) => {
  res.send("test");
});

app.get("/comments", (req, res) => {
  const data = db.prepare("SELECT * FROM comments").all();
  const normalized = data.map((row) => ({
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    score: row.score,
    user: {
      username: row.username,
      image: {
        png: row.image_png,
        webp: row.image_webp,
      },
    },
    parentId: row.parent_id,
    replyingTo: row.replying_to,
  }));

  const comments = normalized
    .filter((row) => row.parentId === null)
    .map((row) => ({
      id: row.id,
      content: row.content,
      createdAt: row.createdAt,
      score: row.score,
      user: row.user,
      replies: normalized
        .filter((reply) => reply.parentId === row.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt,
          score: reply.score,
          user: reply.user,
          replyingTo: reply.replyingTo,
        })),
    }));

  res.json({ currentUser, comments });
});

app.post("/comments", (req, res) => {
  const { content } = req.body;

  const insert = db.prepare(`
    INSERT INTO comments (content, created_at, score, username, image_png, image_webp, parent_id, replying_to)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    content,
    "Just now",
    0,
    currentUser.username,
    currentUser.image.png,
    currentUser.image.webp,
    null,
    null,
  );

  const newComment = {
    id: Number(result.lastInsertRowid),
    content,
    createdAt: "Just now",
    score: 0,
    user: currentUser,
    replies: [],
  };

  res.json(newComment);
});

app.post("/comments/:id/replies", (req, res) => {
  const parentId = Number(req.params.id);
  const { content, replyingTo } = req.body;

  const insert = db.prepare(`
    INSERT INTO comments (content, created_at, score, username, image_png, image_webp, parent_id, replying_to)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    content,
    "Just now",
    0,
    currentUser.username,
    currentUser.image.png,
    currentUser.image.webp,
    parentId,
    replyingTo,
  );

  const newReply = {
    id: Number(result.lastInsertRowid),
    content,
    createdAt: "Just now",
    score: 0,
    replyingTo,
    user: currentUser,
  };

  res.json(newReply);
});

app.patch("/comments/:id/vote", (req, res) => {
  const id = Number(req.params.id);
  const { direction } = req.body;
  const delta = direction === "up" ? 1 : -1;

  db.prepare("UPDATE comments SET score = score + ? WHERE id = ?").run(
    delta,
    id,
  );

  const updated = db.prepare("SELECT score FROM comments WHERE id = ?").get(id);

  res.json(updated);
});

seedIfEmpty();

app.listen(3000, () => {
  console.log("epxress server is running");
});
