import axios from "axios";
import { graph } from "../graph/graph.js";
export const agentController = async (req,res) => {
    try {
        const {prompt,converstion} = req.body;
        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
            conversationId,role:"user",content:prompt
        });
        const result = await graph.invoke({
            prompt,conversationId
            
        })
        const response = result.aiResponse;
        return res.status(200).json({response});

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(`agent controller error: ${error}`);
    }
}