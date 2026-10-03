import {ChatGroq} from "@langchain/groq";


export const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 3,
})



export const getModel = async (agent) => {
    if(agent=="chat") {
        return groq;
    }
    else {
        return groq;
    }
}