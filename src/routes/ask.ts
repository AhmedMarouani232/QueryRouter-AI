import Router from 'koa-router';
import { orchestrate } from '../services/orchestrator';

const router = new Router();

router.post('/ask', async (ctx) => {
  const { query } = ctx.request.body as { query: string };
  if (!query) {
    ctx.status = 400;
    ctx.body = { error: 'Query is required' };
    return;
  }
   const answer = await orchestrate(query);
   ctx.body = { answer };
});

export default router;