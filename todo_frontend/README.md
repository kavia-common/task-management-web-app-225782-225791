# Todo Frontend (React)

A modern, lightweight React todo app with add, edit, delete, and complete features. Uses a light theme with accents (#3b82f6 and #06b6d4), supports accessibility and responsive layout, and persists data via localStorage or an optional backend API.

## Features

- Add, edit (inline), delete, and toggle completion
- Keyboard accessible (Enter/Escape, labels, focus states)
- Error boundary to isolate UI errors
- Responsive layout, modern light theme with brand accents
- Persistence:
  - Local mode: localStorage (default)
  - API mode: if `REACT_APP_API_BASE` is set, uses HTTP CRUD

## Getting Started

Install dependencies and start:

```bash
npm install
npm start
```

Open http://localhost:3000

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
```

## Environment Variables

These variables are read from the environment (via `process.env.REACT_APP_*`). Do not hardcode secrets.

Used variables:
- `REACT_APP_API_BASE` (optional): When set, the app uses this API base for CRUD:
  - GET    `${REACT_APP_API_BASE}/todos`
  - POST   `${REACT_APP_API_BASE}/todos`
  - PUT    `${REACT_APP_API_BASE}/todos/:id`
  - DELETE `${REACT_APP_API_BASE}/todos/:id`
- `REACT_APP_BACKEND_URL` (optional): Display-only footer hint for the backend URL
- `REACT_APP_FRONTEND_URL` (optional): Not used by code, reserved for deployments
- `REACT_APP_WS_URL` (optional): Not used by this app
- `REACT_APP_NODE_ENV`, `REACT_APP_ENABLE_SOURCE_MAPS`, `REACT_APP_PORT`, `REACT_APP_TRUST_PROXY`, `REACT_APP_LOG_LEVEL`, `REACT_APP_HEALTHCHECK_PATH`, `REACT_APP_FEATURE_FLAGS`, `REACT_APP_EXPERIMENTS_ENABLED`: Not directly used in code; reserved for platform configuration

Example `.env.local`:
```
REACT_APP_API_BASE=https://api.example.com
REACT_APP_BACKEND_URL=https://api.example.com
```

Note: For Create React App, env vars must be prefixed with `REACT_APP_`.

## Project Structure

```
src/
  components/
    ErrorBoundary.js
    TodoInput.js
    TodoItem.js
    TodoList.js
  context/
    TodoContext.js
  utils/
    api.js
  App.js
  App.css
  index.js
  index.css
```

## Accessibility

- Inputs and buttons include `aria-label`s and visible focus states
- Keyboard: Enter to add/save; Escape to cancel edit
- Screen-reader only labels provided for critical inputs

## API Contract (when REACT_APP_API_BASE is set)

- Todo shape:
```json
{
  "id": "string",
  "title": "string",
  "completed": false,
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

- Endpoints:
  - GET `/todos` → `[Todo]`
  - POST `/todos` with `{ title }` → `Todo`
  - PUT `/todos/:id` with `{ title?, completed? }` → `Todo`
  - DELETE `/todos/:id` → `204 No Content`

## Theming

Accent colors:
- Primary: `#3b82f6`
- Success: `#06b6d4`

Switch between light/dark using the header toggle.

## Security

- No secrets are stored in code; configuration via environment variables
- Avoid logging sensitive data in the browser console

## License

MIT
