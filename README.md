# CommunityProjectPlanner

# Community Project Copilot

A small Cloudflare Workers + Workers AI app for planning community service projects
(trail renovations, park cleanups, etc.).

- **Backend**: Cloudflare Worker (`backend/`)
  - `/api/chat` endpoint
  - Uses Workers AI (Llama 3) for planning
  - Stores per-project state in Workers KV (`PROJECTS`)
- **Frontend**: Static HTML chat UI (`frontend/index.html`)
  - Sends project descriptions/questions to `/api/chat`
  - Persists a `projectId` in `localStorage` so each browser session keeps its own history
