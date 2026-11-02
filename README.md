# AXIS Intelligence — rebuilt

A responsive dark AI chat app with a Node.js/Express backend and OpenAI Responses API integration. The API key stays on the server.

## Requirements
- Node.js 18+
- OpenAI API key with API access/billing enabled

## Run locally
1. Extract this ZIP.
2. Open a terminal in the extracted folder.
3. Copy `.env.example` to `.env`.
4. Open `.env` and replace `your_openai_api_key_here` with your key. Do not share or commit `.env`.
5. Run `npm install`
6. Run `npm start`
7. Open `http://localhost:3000`

For development, use `npm run dev`.

## Troubleshooting
- `AI is not configured yet`: ensure `.env` exists beside `server.js`, contains `OPENAI_API_KEY=...`, then restart the server.
- Model not found / access error: set `OPENAI_MODEL` in `.env` to a model enabled for your API account.
- Port in use: set `PORT=3001` in `.env`, then open `http://localhost:3001`.
- The app requires an active internet connection for API calls.

Chat history is kept in memory in the browser for the current session and is not stored in a database.
