import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Generate Nostalgic AI Cover Art
app.post('/api/gemini/generate-cover', async (req, res) => {
  try {
    const { prompt, mood = 'happy', imageSize = '1K', aspectRatio = '1:1' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAI();

    // Enhance prompt with authentic nostalgic aesthetics
    const moodStyle =
      mood === 'happy'
        ? 'warm golden hour sunlight, nostalgic 90s vintage film grain, Kodak Portra 400 aesthetic, sunny carefree afternoon, vibrant retro colors, authentic analog photography feel'
        : 'moody cinematic twilight, monsoon rain droplets on glass, moody melancholic blue and amber neon hues, 35mm film photography, introspective nostalgic feeling';

    const enhancedPrompt = `${prompt}, vintage cassette mixtape cover art style, ${moodStyle}, artistic composition, highly detailed album artwork`;

    // Supported sizes for gemini-3.1-flash-image: 1K, 2K, 4K (or 512px)
    const validSizes = ['512px', '1K', '2K', '4K'];
    const selectedSize = validSizes.includes(imageSize) ? imageSize : '1K';
    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const selectedAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    let imageUrl: string | null = null;
    let captionText = '';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: selectedAspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
            imageSize: selectedSize as '512px' | '1K' | '2K' | '4K',
          },
        },
      });

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          } else if (part.text) {
            captionText += part.text;
          }
        }
      }
    } catch (modelError: any) {
      console.warn('Primary image generation error, trying fallback model:', modelError.message);
      // Fallback to gemini-3.1-flash-lite-image
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
      });

      if (fallbackResponse.candidates && fallbackResponse.candidates[0]?.content?.parts) {
        for (const part of fallbackResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to generate image artifact.' });
    }

    return res.json({
      imageUrl,
      caption: captionText || `${mood === 'happy' ? 'Sunshine' : 'Monsoon'} Mixtape Cover Art`,
      size: selectedSize,
      aspectRatio: selectedAspectRatio,
    });
  } catch (error: any) {
    console.error('Error generating cover art:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Generate Custom Nostalgic Quotes & Memory Anecdotes
app.post('/api/gemini/nostalgia-story', async (req, res) => {
  try {
    const { mood = 'happy', memoryPrompt = '' } = req.body;
    const ai = getGenAI();

    const promptText = `You are a nostalgic poet and curator for a vintage music player called "MOOD WISE by jittu".
Generate 3 short, deeply evocative nostalgic quotes or micro-memories for a "${mood}" mood cassette tape.
${memoryPrompt ? `Theme/memory inspiration: ${memoryPrompt}` : ''}
Focus on Indian 90s/2000s nostalgia, walkmans, cassette tapes, rainy train journeys, old school radio, chai tapris, handwritten letters, late night chats, cycle bells, and timeless warmth.
Return a JSON array of 3 objects with properties: "quote" (string, max 20 words, evocative and poetic), "tag" (string, e.g. "Side A: Golden Hours" or "Side B: 2 AM Monsoon"), "era" (e.g. "Summer 1999" or "Rainy Night, Kolkata").`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    res.json({ quotes: parsed });
  } catch (error: any) {
    console.error('Error generating memory quote:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quote' });
  }
});

// Setup Vite middleware or static serving
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MOOD WISE server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
