import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req,res) => {
    try {
        const { userId } = req.headers['x-user-id'];
        console.log("User ID:", userId);
        const conversation = await Conversation.create({ UserId: userId });
        res.status(201).json(conversation);

    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({ error: "Failed to create conversation" });
    }
}

export const getConversations = async (req,res) => {
    try {
        const {userId} = req.headers['x-user-id'];
        const conversations = await Conversation.find({
            UserId: userId
        }).sort({ updatedAt: -1 });
        return res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({ error: "Failed to fetch conversations" });
    }
}

export const updateConversationTitle = async(req,res) => {
    try {
        const {id,title} = req.body;
        const conversation = await Conversation.findByIdAndUpdate(id,{
            title
        })
    } catch (error) {
        console.error("Error in updating the conversation title");
        return res.status(500).json({error:"Tilte updation error"});
    }
}

export const deleteConversation = async (req,res) => {
    try {
        const {id} = req.body;
        const conversation = await Conversation.findByIdAndDelete(id);
    } catch (error) {
        console.error(`Failed to delete the conversation`);
        return res.status(500).json({error:"Failed to delete the conversation"});
    }
}

export const deleteChat = async(req,res) => {
    try {
        const {id} = req.body;
        const targetMessage = await Message.findById(id);
        if(!targetMessage) {
            return res.status(404).json({error: "Message not found"});
        } 
        await Message.deleteMany({
            conversationId: targetMessage.conversationId,
            createdAt: {$gte: targetMessage.createdAt}
        });
        return res.status(200).json({message:"Chat deleted successfully"});
    } catch (error) {
        console.error("Failed to delete the message");
        return res.status(500).json({error: " Failed to delete the chat"});
    }
}

export const saveMessage = async (req,res) => {
    try {
        const {conversationId,role,content} = req.body;
        const message = await Message.create({
            conversationId,
            content,
            role
        });
        return res.status(200).json(message);
    } catch (error) {
        console.error("Error saving message:", error);
        return res.status(500).json({ error: "Failed to save message" });
    }
}

export const renderMessage = async (req,res) => {
    try {
        const {conversationId} = req.body;
        const message = await Message.find({
            conversationId
        }).sort({createdAt:-1});
        return res.status(200).json(message);
    } catch (error) {
        console.error("Error in loading mesasges");
        return res.status(500).json({error: "Failed to render messages"})
    }
}


