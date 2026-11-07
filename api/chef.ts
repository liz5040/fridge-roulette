import type { IncomingMessage, ServerResponse } from 'http';
import { generateRecipeWithGroq, ChefRequestPayload } from '../server/groqChef.ts';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'MISSING_API_KEY',
        message: 'Groq API Key is not configured on the server. Please add GROQ_API_KEY to your environment variables or .env file.',
        source: 'fallback_rule_based',
      })
    );
    return;
  }

  try {
    let body: ChefRequestPayload;
    if (typeof req.body === 'object' && req.body !== null) {
      body = req.body;
    } else {
      let rawData = '';
      for await (const chunk of req) {
        rawData += chunk;
      }
      body = JSON.parse(rawData);
    }

    const recipe = await generateRecipeWithGroq(body, apiKey);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, recipe, source: 'groq_ai' }));
  } catch (err: any) {
    console.error('Groq Chef API Error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'GROQ_API_ERROR',
        message: err.message || 'Failed to generate recipe with AI Chef.',
        source: 'fallback_rule_based',
      })
    );
  }
}
