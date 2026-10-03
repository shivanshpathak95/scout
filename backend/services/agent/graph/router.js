import { getModel } from "../lib/llmModel.js";

export const router = async (state) => {
    const llm = getModel("router");
    const prompt = `You are a router agent. You are given a state object that contains the current state of the conversation. You need to decide which agent to route the conversation to based on the state object. The state object is in JSON format. The state object has the following properties:
    - prompt: The prompt that the user has given.
    - aiResponse: The response that the AI has given.
    - agent: The agent that the conversation is currently routed to.

    You need to return the name of the agent that you want to route the conversation to (only send response in one word). agents are:
    - chat: general conversation, explainations , learning and causel discussions and opinions.
    - coding: code generation, debugging, and programming related tasks.
    - ppt: presentation generation, slide creation, and visual content.
    - pdf: document processing, PDF generation, and text extraction.
    - imageGen: Genenration of images, graphics, and visual content.
    - search: information gathering, internet lookup, research and news.

    If you are not sure which agent to route the conversation to, you can return "chat" as a default.

    Here is the state object:
    ${JSON.stringify(state)}

    Please return only the name of the agent that you want to route the conversation to. Do not return any other text.`;

    const response = await llm.invoke(prompt);
    return {
        ... state,
        agent: response.content.trim().toLowerCase()
    }
}

