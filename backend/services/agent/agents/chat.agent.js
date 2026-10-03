import { getModel } from "./llmModel.js";
export const chatAgent = async (state) => {
    const llm = getModel("chat");
    const prompt = ` You are a chat agent. You are given a state object that contains the current state of the conversation.
    - prompt: The prompt that the user has given.
    - aiResponse: The response that the AI has given.
    You need to return a response that is relevant to the prompt and the current state of the conversation.
    Be respectful and to the point`
    const response = await llm.invoke([
        {
            "role": "system",
            "content": prompt
        },
        {
            "role": "user",
            "content": state.prompt
        }
    ]);

    return {
        ...state,
        aiResponse: response.content
    }
}