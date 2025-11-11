import OpenAI from 'openai';
import { retrieveDocumentContext } from '../tools/rag';
import { queryDatabase } from '../tools/queryDatabase';
import dotenv from 'dotenv';
import { ChatCompletionTool } from 'openai/resources/index';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// === Define Tools (new OpenAI v4+ format) ===
const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'retrieve_document_context',
      description: 'Return relevant document snippets for a user question (RAG).',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The user query to search in documents.' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'query_database',
      description: 'Query orders from MongoDB using criteria like customerName, dateRange, etc.',
      parameters: {
        type: 'object',
        properties: {
          criteria: {
            type: 'object',
            properties: {
              customerName: { type: 'string' },
              dateRange: { type: 'string', enum: ['last week', 'last month'] },
              product: { type: 'string' },
            },
          },
        },
        required: ['criteria'],
      },
    },
  },
] ;

export async function orchestrate(userQuery: string): Promise<string> {
  // Step 1: Ask model which tool to call
  const response = await openai.chat.completions.create({
    model: 'text-embedding-3-small',
    messages: [
      {
        role: 'system',
        content: 'You are an assistant that decides whether to use RAG (document search) or query the database.',
      },
      { role: 'user', content: userQuery },
    ],
    tools,
    tool_choice: 'auto', // Let model decide
  });

  const message = response.choices[0].message;
  const toolCall = message.tool_calls?.[0];

  // If no tool needed, return direct answer
if (!toolCall || toolCall.type !== 'function') {
  return message.content ?? "I couldn't determine what to do.";
}

  // === Execute the selected tool ===
  let toolResult: any;

  const functionName = toolCall.function.name;
  const functionArgs = JSON.parse(toolCall.function.arguments);

  switch (functionName) {
    case 'retrieve_document_context':
      toolResult = await retrieveDocumentContext(functionArgs.query);
      break;

    case 'query_database':
      toolResult = await queryDatabase(functionArgs.criteria);
      break;

    default:
      return `Unknown tool: ${functionName}`;
  }

  // Step 2: Send tool result back to model for final answer
  const finalResponse = await openai.chat.completions.create({
    model: 'text-embedding-3-small',
    messages: [
      { role: 'user', content: userQuery },
      message,
      {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      },
    ],
  });

  return finalResponse.choices[0].message.content ?? 'Error generating final response.';
}