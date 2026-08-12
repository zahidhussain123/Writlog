<div align="center">

<img src="frontend/public/logo.svg" width="72" height="72" alt="Writlog logo" />

# Writlog

A full-stack MERN blog platform for publishing and reading long-form stories.

Rich-text authoring, image and video uploads, categories, search, sorting, infinite scroll and threaded discussion — with authentication handled by Clerk.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)

</div>

---

## Features

- **Rich-text publishing** — Quill editor with inline image and video embeds
- **Cover images and media** — uploaded straight to ImageKit from the browser via signed credentials
- **Discovery** — filter by category or author, full-text title search, and four sort modes:
  - `newest` · `oldest` · `popular` (most viewed) · `trending` (most viewed in the last 7 days, falling back to all-time when the window is empty)
- **Infinite scroll** — cursor-free pagination backed by TanStack Query's `useInfiniteQuery`
- **Comments** — post and delete, with optimistic rendering while the request is in flight
- **Authentication** — Clerk handles sign-in; a Svix-verified webhook mirrors new users into MongoDB
- **View counter** — each post read atomically increments `visit`, which drives the popular/trending sorts
- **Ownership rules** — you can only delete your own posts and comments; accounts with the `admin` role can delete any

## Tech stack

| Layer | Stack |
|---|---|
| **Frontend** | React 19, Vite 5, Tailwind CSS 3, React Router 7, TanStack Query 5 |
| **Backend** | Node.js, Express 5, Mongoose 8 |
| **Database** | MongoDB (Atlas) |
| **Auth** | Clerk (`@clerk/clerk-react`, `@clerk/express`) + Svix webhooks |
| **Media** | ImageKit |
| **Editor** | react-quill-new |

## Project structure

```
.
├── backend/
│   ├── controller/     # post, comment and webhook handlers
│   ├── models/         # Mongoose schemas: Post, Comment, User
│   ├── routes/         # Express routers
│   ├── lib/            # DB connection, ImageKit client
│   └── index.js        # app entry — starts only after the DB connects
└── frontend/
    ├── public/         # static assets (logo, starter imagery)
    └── src/
        ├── components/ # Navbar, PostList, Comments, Search, SideMenu …
        ├── pages/      # Home, PostListPage, SinglePost, Write, Login, Register
        ├── layouts/    # MainLayout
        ├── router/     # route definitions
        └── utils/      # API clients ("databanks")
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB database (Atlas or local)
- A [Clerk](https://clerk.com) application
- An [ImageKit](https://imagekit.io) account

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```ini
MONGODB=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&dbName=Writlog
PORT=5000
CLIENT_URL=http://localhost:5173

CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK=whsec_xxx

IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_PRIVATE_KEY=private_xxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

```bash
npm start        # nodemon on http://localhost:5000
```

The server **exits with a clear error if the database is unreachable** rather than starting and serving empty responses. If it won't boot, check `MONGODB` and that your IP is allowed under Atlas → Network Access.

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```ini
VITE_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
VITE_IK_PUBLIC_KEY=public_xxx
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

```bash
npm run dev      # http://localhost:5173
```

> Only `VITE_`-prefixed variables reach the browser, and everything prefixed that way **ships in the JS bundle** — keep secrets in `backend/.env`, which is gitignored.

### 3. Clerk webhook (optional, for local dev)

New users are written to MongoDB by a webhook. To receive it locally, expose your backend with a tunnel (ngrok or similar) and point a Clerk webhook at `https://<tunnel>/webhooks/clerk`, subscribing to `user.created`. Put the signing secret in `CLERK_WEBHOOK`.

Without this the app still runs, but signed-in users won't have a MongoDB record, so writing posts or comments returns `404 User not found`.

## API reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Auth | Description |
|---|---|:--:|---|
| `GET` | `/health` | – | Liveness probe |
| `GET` | `/posts` | – | List posts (see query params below) |
| `GET` | `/posts/:slug` | – | Single post; increments its view count |
| `POST` | `/posts/post` | ✅ | Create a post |
| `DELETE` | `/posts/post/:id` | ✅ | Delete own post (admins: any) |
| `GET` | `/posts/upload-auth` | – | Signed ImageKit upload credentials |
| `GET` | `/comments/:postId` | – | Comments for a post, newest first |
| `POST` | `/comments/:postId` | ✅ | Add a comment |
| `DELETE` | `/comments/:id` | ✅ | Delete own comment (admins: any) |
| `POST` | `/webhooks/clerk` | Svix | Clerk user sync |

Authenticated routes expect `Authorization: Bearer <clerk-session-token>`.

### `GET /posts` query parameters

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number | `1` | 1-indexed |
| `limit` | number | `5` | capped at 50 |
| `sort` | string | `newest` | `newest` · `oldest` · `popular` · `trending` |
| `cat` | string | – | category slug; `all` disables the filter |
| `search` | string | – | case-insensitive title match |
| `author` | string | – | username; unknown authors return an empty list, not an error |
| `featured` | bool | – | `true` restricts to featured posts |

Response:

```json
{ "posts": [ … ], "hasMore": true, "totalPosts": 12 }
```

## Data models

**Post** — `user` (ref User), `title`, `slug` (unique), `desc`, `content`, `img`, `category` (default `general`), `isFeatured`, `visit`, timestamps

**Comment** — `user` (ref User), `post` (ref Post), `desc`, timestamps

**User** — `clerkId` (unique), `username`, `email`, `img`, `savedPosts`, timestamps

Slugs are generated from the title and de-duplicated with a numeric suffix (`my-post`, `my-post-2`, …).

## Scripts

| Location | Command | Purpose |
|---|---|---|
| `backend` | `npm start` | Run the API with nodemon |
| `frontend` | `npm run dev` | Vite dev server |
| `frontend` | `npm run build` | Production build to `dist/` |
| `frontend` | `npm run preview` | Serve the production build |
| `frontend` | `npm run lint` | ESLint |

## Acknowledgements

The initial project scaffold and starter imagery came from [Lama Dev's MERN blog tutorial](https://github.com/safak). The application has since been substantially rewritten — querying, filtering and sorting, authentication handling, comments, error and loading states, and the UI.

## License

ISC
