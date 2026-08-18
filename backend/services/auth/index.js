import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './lib/database.js';
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req,res)=> {
    console.log("Welcome form auth serverr")
})

app.listen(port,()=>{
    connectDB();
    console.log("Auth server started");
})