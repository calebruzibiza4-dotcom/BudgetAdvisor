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
VITE_API_URL=
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```

If your frontend and backend are deployed separately, set `VITE_API_URL` to your backend base URL so the app can call `/api/chat` correctly.

The backend also exposes a health endpoint at `/health`.
