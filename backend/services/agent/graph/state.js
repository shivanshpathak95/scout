import {Annotation, Annotations} from '@langchain/langgraph';

export const agentState = Annotations.Root({
    prompt:Annotation(),
    aiResponse:Annotation(),
    agent:Annotation()
});

