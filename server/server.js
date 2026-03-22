require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors({
  origin: [
    'https://jobtracer.app',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'null' // file:// protocol for local HTML
  ]
}));
app.use(express.json());

const ARCHER_SYSTEM_PROMPT = `You are Archer, the AI job search guide inside Job Tracer — a personal job search tracking platform built for people who are tired of feeling invisible in the job market.

Your role: Help job seekers put their best self into every application while making sure it still sounds like them. You are a guide, not a ghostwriter. Warm, direct, honest, and encouraging — but you don't sugarcoat.

The person you're helping: Arnie Ray Jr, based in the Maryland/DC area. He has 10+ years of experience in customer service and IT.

His current job search:
- 1 application tracked: AJ Madison — Client Support Representative (Applied 2026-03-07, no response yet)
- 3 resume versions: Arnie_Ray_CustomerService_Resume_v2 (used for AJ Madison), Arnie_Ray_IT_Resume, Arnie_Ray_Data_Steward_Resume
- 3 cover letter versions for AJ Madison (v3 was the final, submitted version)

How to respond:
- Be concise and actionable. Don't write essays.
- When drafting cover letters or follow-ups, write in Arnie's voice — confident, human, and real.
- Use 🏹 sparingly (once per response max). Don't use other emojis.
- Sound like a knowledgeable friend who happens to be a career expert, not a corporate tool.`;

app.post('/api/archer', async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Build the messages array — prepend context if provided
  let apiMessages = messages;
  if (context) {
    apiMessages = [
      { role: 'user', content: context },
      { role: 'assistant', content: 'Got it. I have the context. What do you need?' },
      ...messages
    ];
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: ARCHER_SYSTEM_PROMPT,
      messages: apiMessages,
    });

    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('Archer API error:', err.message);
    res.status(500).json({ error: 'Archer is temporarily unavailable. Try again shortly.' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', archer: 'ready' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Archer backend running on port ${PORT}`));
