# QueryRouter AI

An intelligent **Node.js backend service** using the Koa.js framework that uses **OpenAI function calling** to dynamically route natural language user queries to the appropriate tool:

- **RAG Tool** → Vector search over documents using **Pinecone**
- **Database Tool** → Structured data queries using **MongoDB + Mongoose**

---

## Tech Stack

| Layer             | Technology                          |
|-------------------|-------------------------------------|
| **Runtime**       | Node.js (v18+)                      |
| **Language**      | TypeScript                          |
| **Framework**     | Koa.js                              |
| **Routing**       | `koa-router`                        |
| **HTTP Body**     | `koa-bodyparser`                    |
| **LLM & Embeddings** | OpenAI API (`gpt-4o-mini`, `text-embedding-3-small`) |
| **Vector DB**     | Pinecone                            |
| **Database**      | MongoDB + Mongoose                  |
| **Environment**   | `dotenv`                            |
| **Dev Tools**     | `ts-node`, `nodemon`, `typescript`  |

---

## Features

- **Function Calling Orchestration**: OpenAI decides whether to use RAG or DB.
- **RAG Tool**: Embeds queries, searches Pinecone, returns document context.
- **Database Tool**: Parses natural language dates (`last week`, `last month`), queries MongoDB.
- **Modular Architecture**: Clean separation (`routes/`, `services/`, `tools/`, `models/`).
- **Free-Tier Safe**: Pre-computed embeddings (`embeddings.json`) to avoid OpenAI quota issues.

---

## Setup
1. Clone repo: `git clone your-repo-url`
2. Install: `npm install`
3. Set up .env with keys (see .env example above).
4. Create Pinecone index and MongoDB collection.
5. Run: `npx ts-node src/index.ts`

## How to Run Locally
- Start server: `npx ts-node src/index.ts`
- Test with cURL: `curl -X POST http://localhost:3000/ask -H "Content-Type: application/json" -d '{"query": "What does the refund policy say about cancellations?"}'`

## Example Queries
- RAG: "What does the refund policy say about cancellations?" → Uses Pinecone.
- DB: "Show me all orders placed by John Smith last month." → Uses MongoDB.

## Notes
- For production, handle errors, add logging (e.g., pino), and cache embeddings.
