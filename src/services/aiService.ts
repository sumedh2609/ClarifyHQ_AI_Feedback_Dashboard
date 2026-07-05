// src/services/aiService.ts

export async function getAIBatchTriageData(feedbacks: { id: string, text: string }[], config: any) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  // Switched to the ultra-lightweight model
  const MODEL = "gemini-3.1-flash-lite"; 

  const prompt = `System Instructions: ${config.systemInstruction}
  Categories Rules: ${JSON.stringify(config.categories)}
  Urgency Rules: ${JSON.stringify(config.urgency)}
  Sentiment Rules: ${config.sentimentPrompt}

  Task: Analyze the following batch of feedback items:
  ${JSON.stringify(feedbacks)}

  Return ONLY a valid JSON array containing one object for each feedback item analyzed. 
  Each object MUST have EXACTLY these four keys:
  "id" (string: the exact ID from the input),
  "category" (string: strictly 'Bug', 'Feature Request', 'Billing', or null),
  "urgency" (string: strictly 'Critical', 'Medium', or 'Low'),
  "sentiment_score" (number: 10 to 95).`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  return JSON.parse(data.candidates[0].content.parts[0].text);
}

export async function generateSimulatedFeedback(config: any) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const MODEL = "gemini-3.1-flash-lite";

  const prompt = `System Context: ${config.simulationPrompt}
  Task: Generate exactly 5 highly realistic B2B SaaS customer support tickets. 
  Return ONLY a valid JSON array containing exactly 5 objects. 
  Each object must have EXACTLY three keys: 
  "customer_name" (a realistic full name), 
  "source" (strictly one of: "App Store", "Play Store", "Email"), 
  "feedback_text" (the realistic 2-sentence issue).`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  return JSON.parse(data.candidates[0].content.parts[0].text);
}


// Add this at the bottom of src/services/aiService.ts

export async function generateDraftResponse(feedbackText: string, customerName: string, toneTemplate: string) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const MODEL = "gemini-3.1-flash-lite";

  const prompt = `System Instructions: You are drafting an email reply to a customer.
  Customer Name: ${customerName}
  Customer Feedback: "${feedbackText}"
  
  CRITICAL TONE DIRECTIVE:
  ${toneTemplate}

  Constraints:
  - You MUST strictly embody the persona and tone defined in the CRITICAL TONE DIRECTIVE above.
  - If the directive asks for empathy, be extremely warm. If it asks for directness, be brutally concise.
  - Return ONLY the exact email body text. Do not include subject lines.
  - Sign off as "Support Team".`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  return data.candidates[0].content.parts[0].text;
}