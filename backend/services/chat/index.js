import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './lib/database';
dotenv.config();

const port = process.env.PORT || 8002;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    res.json({message:"Hello from Chat"});
})

app.listen(port,()=>{
    connectDB();
    console.log(`chat started at port http://localhost${port}`);
})

