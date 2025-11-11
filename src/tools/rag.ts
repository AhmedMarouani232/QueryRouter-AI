import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import OpenAI  from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

// ---------------------------------------------------------------
// 1. SAMPLE TEXT CHUNKS (the same you already have)
const sampleChunks = [
  { id: '1', text: 'Refunds are available for cancellations made within 48 hours of purchase.' },
  { id: '2', text: 'No refunds for cancellations after 48 hours, but credits may be issued.' },
  { id: '3', text: 'Contact support for any refund-related queries.' },
];

export async function initPineconeIndex() {
  for (const chunk of sampleChunks) {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk.text,
    });
    await index.upsert([{ id: chunk.id, values: embedding.data[0].embedding }]);
  }
}

export async function retrieveDocumentContext(query: string): Promise<string> {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const result = await index.query({
    vector: embedding.data[0].embedding,
    topK: 3, // Top N
    includeMetadata: false,
  });
  // For demo, map IDs back to texts (in prod, store metadata in Pinecone)
  const contexts = result.matches.map(match => sampleChunks.find(c => c.id === match.id)?.text || '');
  return contexts.join('\n');
}