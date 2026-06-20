import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Strip markdown code fences if Gemini wraps JSON in ```json blocks
const cleanJsonResponse = (text) => text.replace(/```json|```/g, '').trim();

// 1. Feasibility & ROI scoring for a single idea
export const generateFeasibilityScore = async (idea) => {
  const prompt = `
You are a business strategy analyst. Analyze this internal innovation idea and return ONLY a JSON object, no preamble, no markdown.

Idea Title: ${idea.title}
Pitch: ${idea.pitch}
Estimated Budget: $${idea.estimatedBudget}
Required Team Size: ${idea.requiredTeamSize}
Expected Impact: ${idea.expectedImpact}
Category: ${idea.category || 'N/A'}
Employee Votes (backing): ${idea._count?.votes ?? 0}
Employee Comments: ${idea._count?.comments ?? 0}

Return JSON in this exact shape:
{
  "feasibilityScore": <number 1-10>,
  "roiScore": <number 1-10>,
  "complexity": "<LOW|MEDIUM|HIGH>",
  "overallScore": <number 1-10, weighted combination>,
  "reasoning": "<2-3 sentence justification>"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(cleanJsonResponse(text));
  } catch (err) {
    throw new Error('Failed to parse AI feasibility response');
  }
};

// 2. Theme clustering across multiple ideas
export const generateThemeClusters = async (ideas) => {
  const ideaSummaries = ideas
    .map((i) => `ID: ${i.id} | Title: ${i.title} | Category: ${i.category || 'N/A'} | Pitch: ${i.pitch}`)
    .join('\n');

  const prompt = `
You are a strategy analyst grouping internal innovation ideas into broader innovation themes.

Ideas:
${ideaSummaries}

Group these ideas into 3-6 broader innovation themes based on similarity in purpose, domain, or business function.
Return ONLY a JSON array, no preamble, no markdown, in this exact shape:
[
  {
    "theme": "<theme name>",
    "description": "<1-2 sentence description of this theme>",
    "ideaIds": ["<id1>", "<id2>"]
  }
]
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(cleanJsonResponse(text));
  } catch (err) {
    throw new Error('Failed to parse AI theme clustering response');
  }
};

// 3. Resource allocation suggestions for top-ranked ideas
export const generateResourceSuggestions = async (idea) => {
  const prompt = `
You are a resource planning analyst. Based on this top-ranked internal idea, suggest the skill sets and team composition needed to execute it.

Idea Title: ${idea.title}
Pitch: ${idea.pitch}
Required Team Size: ${idea.requiredTeamSize}
Expected Impact: ${idea.expectedImpact}
Category: ${idea.category || 'N/A'}

Return ONLY a JSON object, no preamble, no markdown, in this exact shape:
{
  "recommendedRoles": ["<role1>", "<role2>"],
  "keySkills": ["<skill1>", "<skill2>"],
  "suggestedTeamSize": <number>,
  "notes": "<short rationale>"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(cleanJsonResponse(text));
  } catch (err) {
    throw new Error('Failed to parse AI resource suggestion response');
  }
};