import { StateGraph } from  "@langchain/langgraph";
import { agentState } from "./state";
import { router } from "./router";
import { chatAgent } from "../agents/chat.agent";
import { searchAgent } from "../agents/search.agent";
import { pdfAgent } from "../agents/pdf.agent";
import { imageGenAgent } from "../agents/image.agent";
import { pptAgent } from "../agents/ppt.agent";
import { codingAgent } from "../agents/coding.agent";

const workflow = new StateGraph(agentState);

workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("pdf",pdfAgent);
workflow.addNode("imageGen",imageGenAgent);
workflow.addNode("ppt",pptAgent);
workflow.addNode("codeing",codingAgent);

workflow.addEdge("__start__","router");
workflow.addConditionalEdges("router", (state)=> {
    if(state.agent=="chat") {
        return "chat";
    }
    else if(state.agent=="coding") {
        return "coding";
    }
    else if(state.agent=="ppt") {
        return "ppt";
    }
    else if(state.agent=="pdf") {
        return "pdf";
    }
    else if(state.agent=="imageGen") {
        return "imageGen";
    }
    else if(state.agent=="search") {
        return "search";
    }
    else{
        return "chat";
    }
},{
    chat:"chat",
    search:"search",
    ppt:"ppt",
    pdf:"pdf",
    imageGen:"imageGen",
    coding:"coding"
});

workflow.addEdge("search","chat");
workflow.addEdge("chat","__end__");
workflow.addEdge("ppt","__end__");
workflow.addEdge("pdf","__end__");
workflow.addEdge("imageGen","__end__");
workflow.addEdge("coding","__end__");

export const graph = workflow.compile();
