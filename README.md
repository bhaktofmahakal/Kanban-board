# Kanban Board Application

A full-stack Kanban board application built with React, Node.js/Express, and PostgreSQL.

## Features

- ✅ Add, edit, and delete tasks
- ✅ Move tasks between columns (To Do, In Progress, Done)
- ✅ Persistent storage with localStorage (frontend-only) or PostgreSQL (full-stack)
- ✅ Clean, responsive UI with Tailwind CSS
- ✅ Production-ready code structure
- ✅ TypeScript for type safety

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Axios

### Backend
- Node.js + Express
- PostgreSQL (Neon recommended for easy deployment)
- TypeScript

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL (optional, for full-stack setup)

### Frontend Only (with localStorage)

```bash
cd apps/frontend
npm install
npm run dev
```

The application will run at `http://localhost:5173` and use localStorage for data persistence.

### Full Stack Setup

1. **Setup Database (Neon)**
   - Create a free Neon account at https://neon.tech
   - Create a new project and get your connection string
   - Update `apps/backend/.env` with your DATABASE_URL

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Backend**
   ```bash
   npm run dev:backend
   ```
   Backend runs at `http://localhost:3000`

4. **Start Frontend (in new terminal)**
   ```bash
   npm run dev:frontend
   ```
   Frontend runs at `http://localhost:5173`

## Project Structure

```
kanban-board/
├── apps/
│   ├── frontend/           # React frontend
│   │   ├── src/
│   │   │   ├── components/   # Reusable components
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── services/     # API services
│   │   │   ├── types/        # TypeScript types
│   │   │   └── App.tsx       # Main app component
│   │   └── vite.config.ts
│   └── backend/            # Express backend
│       ├── src/
│       │   ├── controllers/ # Route handlers
│       │   ├── db/          # Database setup
│       │   ├── routes/      # API routes
│       │   ├── types/       # TypeScript types
│       │   └── index.ts     # Server entry point
│       └── tsconfig.json
└── shared/                 # Shared types (future)
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Deployment

### Frontend (Vercel)

```bash
npm run build
```

Deploy the `dist` folder to Vercel.

### Backend (Render or Railway)

1. Create a new project on Render/Railway
2. Connect your GitHub repository
3. Set environment variables:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `FRONTEND_URL` - Your frontend URL (e.g., https://my-kanban.vercel.app)
4. Set build command: `npm run build`
5. Set start command: `npm run start`

## Development

### Run Tests
```bash
npm run test
```

### Run Linter
```bash
npm run lint
```

### Type Checking
```bash
npm run typecheck
```

## Features Implemented

✅ Core Requirements:
- Add new tasks
- Edit tasks
- Delete tasks
- Move tasks between columns
- Persist tasks using localStorage
- Clean, simple, user-friendly UI

✅ Extra Features:
- Full-stack backend with PostgreSQL
- TypeScript for type safety
- Error handling and validation
- Responsive design
- Production-ready code structure

## License

MIT
