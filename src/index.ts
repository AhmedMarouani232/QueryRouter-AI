import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import askRouter from './routes/ask';
import {connectDB} from "../src/tools/database";
import { initDB } from './tools/queryDatabase';
import { initPineconeIndex } from './tools/rag';
connectDB();

const port = process.env.PORT || 3000;

const app = new Koa;
app.use(bodyParser());
app.use(askRouter.routes());
// app.use(async ctx=>{
//     ctx.body = { message : "connected to MongoDB"}
// })
// app.use(askRouter.routes());
mongoose.connection.once('open', async () => {
    console.log("connected to db")
    await initDB(); // Seed DB
    console.log("initialised db")
    await initPineconeIndex();
        console.log("initialised pinecone")

    app.listen(port, () => console.log(`Server running on ${port}`));
}

);

