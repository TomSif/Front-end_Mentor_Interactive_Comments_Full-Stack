import express from "express";
import "./db.js";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("test");
});

app.listen(3000, () => {
  console.log("epxress server is running");
});
