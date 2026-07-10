import { describe, it, expect, beforeEach } from "vitest";
import db from "./db.js";
import request from "supertest";
import app from "./app.js";

beforeEach(() => {
  db.exec("DELETE FROM comments"); // clear the table before each test
});

describe("GET /comments", () => {
  it("returns a 200 status", async () => {
    // Act
    const res = await request(app).get("/comments");

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.comments).toEqual([]);
  });
});

describe("POST /comments", () => {
  it("returns 200 and created comment whith test as content", async () => {
    // Act
    const res = await request(app).post("/comments").send({ content: "test" });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("test");
  });
});
