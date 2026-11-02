# Axis Intelligence

A mobile-friendly ChatGPT-style web app with a black and light-purple interface, chat history for the current browser session, and an API-backed assistant.

## Requirements
- Node.js 18 or newer
- An OpenAI API key

## Run locally
1. Extract this folder.
2. In this folder, copy `.env.example` to `.env`.
3. Add your API key to `.env`. Keep the key private; do not put it in browser code or share the file.
4. Install dependencies: `npm install`
5. Start the app: `npm start`
6. Open `http://localhost:3000`

## Notes
- The API key stays on the server and is not sent to the browser.
- Chat history is currently held in memory in the page; refreshing the page clears it. Persistent accounts, database storage, billing, moderation, and production hosting are not included yet.
- Change `OPENAI_MODEL` in `.env` to a model available to your API account.
- This is a working starter app, not a deployed public service. Hosting and API usage may incur costs.
