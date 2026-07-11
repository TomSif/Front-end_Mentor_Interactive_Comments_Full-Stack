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
describe("POST /comments/:id/replies", () => {
  it("returns 200 and created a reply to a comment with test reply as content", async () => {
    // Arrange
    const parentRes = await request(app)
      .post("/comments")
      .send({ content: "test" });
    const parentId = parentRes.body.id;

    // Act
    const res = await request(app)
      .post(`/comments/${parentId}/replies`)
      .send({ content: "test reply", replyingTo: "someone" });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("test reply");
    expect(res.body.replyingTo).toBe("someone");
  });
});
describe("PATCH /comments/:id/vote", () => {
  it("returns 200 and increase the vote of a comment", async () => {
    // Arrange — Direct insert
    const insert = db
      .prepare(
        `
      INSERT INTO comments (content, created_at, score, username, image_png, image_webp, parent_id, replying_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run("not mine", "Just now", 0, "someoneelse", "", "", null, null);

    const otherId = Number(insert.lastInsertRowid);

    // Act
    const res = await request(app)
      .patch(`/comments/${otherId}/vote`)
      .send({ direction: "up" });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.score).toBe(1);
  });
});
describe("PATCH /comments/:id/vote", () => {
  it("returns 403 and does not increase the vote of a comment", async () => {
    // Arrange
    const parentRes = await request(app)
      .post("/comments")
      .send({ content: "test" });
    const parentId = parentRes.body.id;

    // Act
    const res = await request(app)
      .patch(`/comments/${parentId}/vote`)
      .send({ direction: "up" });

    // Assert
    expect(res.status).toBe(403);
  });
});
describe("PUT /comments/:id", () => {
  it("returns 200 and edit a comment with edited as content", async () => {
    // Arrange
    const parentRes = await request(app)
      .post("/comments")
      .send({ content: "test" });
    const parentId = parentRes.body.id;

    // Act
    const res = await request(app)
      .put(`/comments/${parentId}`)
      .send({ content: "edited" });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("edited");
  });
});
describe("DELETE /comments/:id", () => {
  it("returns 200 and delete a comment ", async () => {
    // Arrange
    const parentRes = await request(app)
      .post("/comments")
      .send({ content: "test" });
    const parentId = parentRes.body.id;

    // Act
    await request(app).delete(`/comments/${parentId}`);
    const res2 = await request(app).get("/comments");

    // Assert
    expect(res2.status).toBe(200);
    expect(res2.body.comments).toEqual([]);
  });
});
describe("DELETE /comments/:id", () => {
  it("returns 403 when deleting someone else's comment", async () => {
    // Arrange — Direct insert
    const insert = db
      .prepare(
        `
      INSERT INTO comments (content, created_at, score, username, image_png, image_webp, parent_id, replying_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run("not mine", "Just now", 0, "someoneelse", "", "", null, null);
    const otherId = Number(insert.lastInsertRowid);

    // Act
    const res = await request(app).delete(`/comments/${otherId}`);

    // Assert
    expect(res.status).toBe(403);
  });
});
describe("PUT /comments/:id", () => {
  it("returns 403 when editing someone else's comment", async () => {
    // Arrange — insertion directe en base, pas via l'API
    const insert = db
      .prepare(
        `
      INSERT INTO comments (content, created_at, score, username, image_png, image_webp, parent_id, replying_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run("not mine", "Just now", 0, "someoneelse", "", "", null, null);
    const otherId = Number(insert.lastInsertRowid);

    // Act
    const res = await request(app)
      .put(`/comments/${otherId}`)
      .send({ content: "hacked" });

    // Assert
    expect(res.status).toBe(403);
  });
});
