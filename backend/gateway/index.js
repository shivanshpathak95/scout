import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import proxy from "express-http-proxy";
import cookieparser from "cookie-parser";
import { proxyWithHeader } from "./util/proxyWithHeader.js";
import { protect } from "./util/protect.js";
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieparser());


app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL))
app.use('/api/chat', protect, proxyWithHeader(process.env.CHAT_SERVICE_URL))
app.get("/", (req,res)=> {
    res.json({message:"Hello from gateway"});
})

app.listen(port, ()=> {
    console.log(`Gateway started at port: http://localhost:${port}`);
})