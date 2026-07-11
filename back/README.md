# Interactive Comments Section — Backend API

[![Node.js](https://img.shields.io/badge/node-%3E%3D23.4.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/sqlite-node%3Asqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://nodejs.org/api/sqlite.html)
[![Vitest](https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Supertest](https://img.shields.io/badge/supertest-testing-E33332?style=for-the-badge)](https://github.com/ladjs/supertest)

REST API for the [Interactive Comments Section](../front) Frontend Mentor challenge. Serves comments and replies from a SQLite database, and handles create/vote/edit/delete operations with per-author authorization.

**Base URL (production):** `https://front-end-mentor-interactive-comments.onrender.com`

---

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)

---

## Tech stack

- **[Express 5](https://expressjs.com/)** — HTTP server and routing
- **[`node:sqlite`](https://nodejs.org/api/sqlite.html)** (`DatabaseSync`) — built-in Node SQLite driver, chosen over `better-sqlite3` because no precompiled binary was available for the Node version used in development and the local toolchain couldn't compile it from source. The API is close to identical (synchronous), so this cost nothing functionally.
- **TypeScript** (`strict: true`) — consistent with the frontend
- **[Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest)** — integration tests against the real Express app, in-memory database (`DB_PATH=:memory:`)
- **`cors`** — cross-origin requests from the Vite dev server / deployed frontend

## Prerequisites

- Node.js `>= 23.4.0` (see `engines` in `package.json`) — required for `node:sqlite` support

## Getting started

```bash
cd back
npm install
npm run dev       # starts the API on http://localhost:3000, auto-reload via tsx watch
```

On first boot, if the `comments` table is empty, it is automatically seeded from `back/data/data.json` (see [`seedIfEmpty`](./src/seed.ts)).

Other scripts:

```bash
npm run build      # compile TypeScript to dist/
npm start          # run the compiled build (node dist/server.js)
npm test           # run the Vitest + Supertest suite
```

## Environment variables

| Variable  | Required | Default          | Purpose                                                                 |
| --------- | :------: | ---------------- | ------------------------------------------------------------------------ |
| `DB_PATH` |    no    | `data.sqlite`     | Path to the SQLite file. Set to `:memory:` in `vitest.config.ts` for tests so the test suite never touches the real database. |

No secrets or API keys are required — there is no authentication layer (see [Known limitations](#known-limitations)).

## API reference

All endpoints are relative to the base URL. All request/response bodies are JSON.

### `GET /comments`

Returns the current user and the full comment tree (root comments with nested `replies`).

**Response `200`**

```json
{
  "currentUser": { "username": "juliusomo", "image": { "png": "...", "webp": "..." } },
  "comments": [
    {
      "id": 1,
      "content": "string",
      "createdAt": "string",
      "score": 12,
      "user": { "username": "string", "image": { "png": "...", "webp": "..." } },
      "replies": [
        {
          "id": 3,
          "content": "string",
          "createdAt": "string",
          "score": 4,
          "replyingTo": "string",
          "user": { "username": "string", "image": { "png": "...", "webp": "..." } }
        }
      ]
    }
  ]
}
```

### `POST /comments`

Creates a new root-level comment, authored by the hardcoded current user.

**Body:** `{ "content": string }`
**Response `200`:** the created comment (`{ id, content, createdAt, score, user, replies: [] }`)

### `POST /comments/:id/replies`

Creates a reply to the comment `:id`.

**Body:** `{ "content": string, "replyingTo": string }`
**Response `200`:** the created reply (`{ id, content, createdAt, score, replyingTo, user }`)

### `PATCH /comments/:id/vote`

Increments or decrements the score of comment/reply `:id`.

**Body:** `{ "direction": "up" | "down" }`
**Response `200`:** `{ "score": number }`
**Response `403`:** the target comment belongs to the current user — **you cannot vote on your own comment.**

### `PUT /comments/:id`

Edits the content of comment/reply `:id`. **Author-only.**

**Body:** `{ "content": string }`
**Response `200`:** the updated row
**Response `403`:** the target comment does not belong to the current user

### `DELETE /comments/:id`

Deletes comment/reply `:id`. If `:id` is a root comment, its replies are deleted too (avoids orphaned rows on `parent_id`). **Author-only.**

**Response `200`:** `{ "id": number }`
**Response `403`:** the target comment does not belong to the current user

## Testing

```bash
npm test
```

9 Supertest tests cover every route above, including both authorization failure paths (`403` on voting on your own comment, `403` on editing/deleting someone else's comment). Each test runs against an in-memory database (`DB_PATH=:memory:`), reset via `beforeEach(() => db.exec("DELETE FROM comments"))` for full isolation between tests.

## Project structure

```
back/
├── src/
│   ├── app.ts          # Express app: middleware + all routes (exported, no app.listen)
│   ├── server.ts        # Boots the app: runs seedIfEmpty(), then app.listen()
│   ├── db.ts             # DatabaseSync connection, schema, shared insertCommentRow()
│   ├── seed.ts           # Seeds the comments table from data/data.json if empty
│   └── app.test.ts       # Supertest suite (all 6 routes + ownership failure cases)
├── data/
│   └── data.json         # Seed data (duplicated from front/public/data/data.json so this backend has no dependency on a sibling folder in production)
└── vitest.config.ts       # Sets DB_PATH=:memory: for the test run
```

`app.ts` is split from `server.ts` specifically so Supertest can exercise the Express app directly, without opening a real port or triggering the production seed.

## Deployment

Deployed on **[Render](https://render.com/)** (free tier). Two production issues were hit and fixed during the first deploy — worth knowing if you redeploy this API elsewhere:

- **Ephemeral filesystem.** Render's free tier resets the filesystem on every redeploy/restart, so a plain SQLite file doesn't persist across deploys. Fix: `seedIfEmpty()` checks `COUNT(*)` on boot and only seeds when the table is genuinely empty, so the app self-heals on every cold start instead of requiring a manual reseed.
- **No dependency on a sibling folder.** The seed data lives in `back/data/data.json`, not `front/public/data/data.json` — a backend deployed on its own should not read from a directory outside its own project root.

## Known limitations

- **No real authentication.** `currentUser` is a hardcoded constant in `app.ts` (no login flow was in scope for this challenge). Every write operation is attributed to this single user, and ownership checks compare against it.
- **No input validation.** Routes trust `req.body` as-is (e.g. `POST /comments` does not reject an empty/missing `content`). Tracked as a follow-up item in the project's `nouveauxObjectifs.md`.
