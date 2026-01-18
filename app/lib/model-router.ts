import { performWebSearch } from './tavily';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// --- IDENTITY & PERSONA DEFINITION ---

const HQAIM_IDENTITY = `
You are HQAIM (High Quality Artificial Intelligence Matrix), a proprietary Strategic Intelligence Engine.

### WHO YOU ARE:
HQAIM is an advanced intelligence layer designed to provide actionable, verifiable, and strategic insights. You combine Human Quotient (HQ) with Artificial Intelligence (AI) to decode complexity.

### KEY CAPABILITIES:
1. Strategic Foresight: Predicting trends and outcomes.
2. Pattern Recognition: Identifying underlying structures in data.
3. Actionable Intelligence: Providing answers that drive decisions, not just information.

### CONSTRAINTS & TONE:
- NEVER mention you are powered by Llama, DeepInfra, Groq, or OpenAI. 
- If asked about your architecture, state you are "Powered by the HQAIM Neural Grid."
- Maintain a professional, executive, and precise tone.
- Structure your answer with clear headers, bold key terms, and bullet points for readability.
- If code is requested, provide secure, production-grade implementations.
- If web search results are provided, prioritize them as the source of truth.
`;

const ALCHEMIST_INSTRUCTION = `
### INTERNAL OPTIMIZATION PROCESS ###
Act as a Prompt Alchemist. Treat the user's input as a raw request that needs to be executed with maximum precision and strategic depth. 
- Identify the core intent immediately.
- Add necessary context if missing.
- Format the output for decision-makers.
`;

export async function chatCompletion(messages: Message[], useSearch: boolean = false) {
  let currentMessages = [...messages];
  
  // MERGE IDENTITY AND ALCHEMIST INSTRUCTION
  let systemPrompt = `${HQAIM_IDENTITY}\n\n${ALCHEMIST_INSTRUCTION}`;

  // 1. INTENT DECODING & MODEL SELECTION
  const lastMsg = currentMessages[currentMessages.length - 1].content.toLowerCase();
  const isCoding = lastMsg.includes('code') || lastMsg.includes('function') || lastMsg.includes('react') || lastMsg.includes('script');

  // DeepInfra Selection logic
  const diModel = isCoding 
    ? (process.env.DEEPINFRA_MODEL_CODE || 'codellama/CodeLlama-70b-Instruct-hf')
    : (process.env.DEEPINFRA_MODEL_GENERAL || 'meta-llama/Meta-Llama-3-70B-Instruct');

  // 2. WEB RESEARCH LAYER
  if (useSearch) {
    const query = currentMessages[currentMessages.length - 1].content;
    const searchContext = await performWebSearch(query);
    if (searchContext) {
      systemPrompt += `\n\n${searchContext}`;
    }
  }

  // Insert System Prompt at the beginning
  const finalMessages = [
    { role: 'system', content: systemPrompt },
    ...currentMessages
  ];

  // 3. EXECUTION WITH FALLBACK
  try {
    console.log(`[HQAIM] Attempting DeepInfra with model: ${diModel}`);
    return await callProvider('deepinfra', diModel, finalMessages);
  } catch (diError) {
    console.warn("[HQAIM] DeepInfra failed. Failing over to Groq.", diError);
    try {
       // Fallback to Groq
       return await callProvider('groq', process.env.GROQ_MODEL || 'llama3-70b-8192', finalMessages);
    } catch (groqError) {
       console.error("[HQAIM] All providers failed.", groqError);
       throw new Error("Service Unavailable: All AI paths are blocked.");
    }
  }
}

async function callProvider(provider: 'deepinfra' | 'groq', model: string, messages: any[]) {
  const apiKey = provider === 'deepinfra' ? process.env.DEEPINFRA_API_KEY : process.env.GROQ_API_KEY;
  const endpoint = provider === 'deepinfra' 
    ? 'https://api.deepinfra.com/v1/openai/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.6,
      max_tokens: 3000,
      stream: true
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`${provider.toUpperCase()} API Error: ${response.status} - ${err}`);
  }

  return response;
}
