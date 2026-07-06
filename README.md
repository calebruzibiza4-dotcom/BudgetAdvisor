# Budget Advisor

A premium budget advisor app with a React + Vite frontend and an Express backend.

## Structure

- `index.html`, `src/`, `vite.config.js`: React + Vite frontend
- `server.js`: Express API backend

## Run locally

```bash
npm install
npm run dev
```

The Vite frontend can make API requests to the backend at `http://localhost:5000` when the backend is started with:

```bash
npm start
```

## Environment Variables

Create a `.env` file for local development with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```

The backend also exposes a health endpoint at `/health`.
