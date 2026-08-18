import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './lib/database';

const port = process.env.PORT || 8003;
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req,res)=> {
    console.log("Hello from Agent");
    res.json({message: "Hello from Agent"});
});

app.listen(port, ()=>{
    connectDB();
    console.log("Agent server running");
});

