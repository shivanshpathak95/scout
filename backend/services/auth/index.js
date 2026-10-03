import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './lib/database.js';
import authRouter from './routes/auth.routes.js';
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
}));

app.get('/', (req,res)=> {
    res.json({ message: "Welcome from auth server" });
})

app.use('/api/auth', authRouter);

app.listen(port,()=>{
    connectDB();
    console.log("Auth server started");
})
