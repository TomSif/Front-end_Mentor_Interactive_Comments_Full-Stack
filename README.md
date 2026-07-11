# Interactive Comments Section — Full-Stack

[![React](https://img.shields.io/badge/react_19-20232a?style=for-the-badge&logo=react&logoColor=61dafb)](https://react.dev/)
[![Express](https://img.shields.io/badge/express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/sqlite-node%3Asqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://nodejs.org/api/sqlite.html)

A full-stack solution to the [Interactive Comments Section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9): a comment thread supporting nested replies, upvote/downvote, edit and delete — backed by a real REST API and a SQLite database, not local mock data.

**Live app:** [front-end-mentor-interactive-commen-psi.vercel.app](https://front-end-mentor-interactive-commen-psi.vercel.app/)
**Live API:** [front-end-mentor-interactive-comments.onrender.com](https://front-end-mentor-interactive-comments.onrender.com/)

---

## Monorepo structure

This repository contains two independently deployed apps:

| Folder      | What it is                                              | Docs                     |
| ----------- | -------------------------------------------------------- | ------------------------- |
| [`front/`](./front) | React 19 + TypeScript + Tailwind CSS v4 client, deployed on Vercel | [`front/README.md`](./front/README.md) |
| [`back/`](./back)   | Express 5 + SQLite (`node:sqlite`) REST API, deployed on Render    | [`back/README.md`](./back/README.md)   |

Each app has its own `package.json`, its own test suite (Vitest + React Testing Library on the front, Vitest + Supertest on the back), and its own README with full setup instructions, API reference, and deployment notes. This root README is only an entry point — see the two linked READMEs for anything project-specific.

## Quick start

```bash
# Terminal 1 — API
cd back && npm install && npm run dev     # http://localhost:3000

# Terminal 2 — client
cd front && npm install && npm run dev    # http://localhost:5173
```

The frontend reads the API's base URL from `VITE_API_URL` (see `front/.env`).

## Testing

```bash
cd front && npm test   # 26 tests — Vitest + React Testing Library
cd back && npm test    # 9 tests  — Vitest + Supertest
```

## Author

- Frontend Mentor — [@TomSif](https://www.frontendmentor.io/profile/TomSif)
- GitHub — [@TomSif](https://github.com/TomSif)
