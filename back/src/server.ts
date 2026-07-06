import express from "express";
import db from "./db.js";
import cors from "cors";

const app = express();

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

app.listen(3000, () => {
  console.log("epxress server is running");
});
