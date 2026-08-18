import express from "express";
import { createConversation, getConversations,updateConversationTitle,deleteChat,deleteConversation,saveMessage,renderMessage } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get('/create-conversation', createConversation);
chatRouter.get('/get-conversation', getConversations);
chatRouter.get('/update-conversation-title', updateConversationTitle);
chatRouter.get('/delete-conversation', deleteConversation);
chatRouter.get('/delete-chat', deleteChat);
chatRouter.get('/save-message', saveMessage);
chatRouter.get('/render-message', renderMessage);

export default chatRouter;