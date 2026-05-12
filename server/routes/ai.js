const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/analyze', auth, async (req, res) => {
  try {
    const { transcript } = req.body;
    
    let resultText = '';

    // Trying Groq first if key exists, else Gemini
    if (process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
      const Groq = require('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const prompt = `You are a medical scribe assistant. Extract structured information from this doctor's spoken consultation transcript. Return ONLY a JSON object with these fields: { "symptoms": [], "diagnosis": "string", "medicines": [{ "name": "string", "dosage": "string", "duration": "string" }], "advice": "string", "followUpDate": "string", "vitals": { "bloodPressure": "string", "heartRate": 0, "temperature": 0, "weight": 0 } }. Extract vitals if mentioned (e.g., blood pressure, pulse/heart rate, temperature, weight). If a vital is not mentioned, use null or omit it. IMPORTANT: The transcript may be in Hindi, but the values in the JSON object must ALWAYS be in English for clinical documentation. Transcript: ${transcript}`;
      
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
      });
      resultText = completion.choices[0]?.message?.content || '{}';
    } else if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              symptoms: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "List of symptoms mentioned by the patient or doctor."
              },
              diagnosis: {
                type: "STRING",
                description: "The clinical diagnosis or assessment."
              },
              medicines: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING", description: "Name of the medicine." },
                    dosage: { type: "STRING", description: "Dosage instructions (e.g., 1-0-1, 500mg)." },
                    duration: { type: "STRING", description: "Duration to take the medicine (e.g., 5 days)." }
                  },
                  required: ["name"]
                },
                description: "List of prescribed medicines."
              },
              advice: {
                type: "STRING",
                description: "General advice or instructions given to the patient."
              },
              followUpDate: {
                type: "STRING",
                description: "Recommended follow-up date or timeframe."
              },
              vitals: {
                type: "OBJECT",
                properties: {
                  bloodPressure: { type: "STRING", description: "Blood pressure (e.g., 120/80)." },
                  heartRate: { type: "NUMBER", description: "Heart rate in bpm." },
                  temperature: { type: "NUMBER", description: "Temperature in Fahrenheit or Celsius." },
                  weight: { type: "NUMBER", description: "Weight in kg or lbs." }
                },
                description: "Vitals extracted from the consultation."
              }
            },
            required: ["symptoms", "diagnosis", "medicines", "advice"]
          }
        }
      });
      const prompt = `You are a medical scribe assistant. Extract structured information from this doctor's spoken consultation transcript. The transcript may be in Hindi or English (or a mix), but the values in the JSON object must ALWAYS be in English for clinical documentation. Transcript: ${transcript}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      resultText = response.text();
    } else {
      return res.status(400).json({ error: 'No AI API Key provided in environment' });
    }

    let cleanText = resultText;
    if (cleanText.includes('```')) {
      const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanText = match[1];
      }
    }
    const parsedData = JSON.parse(cleanText.trim());
    res.json(parsedData);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze transcript' });
  }
});

router.post('/suggest', auth, async (req, res) => {
  try {
    const { symptoms } = req.body;
    let resultText = '';
    const prompt = `Based on these symptoms in a clinical context: ${JSON.stringify(symptoms)}, list 3 possible diagnoses with brief reasoning. Add disclaimer that this is AI assistance only, not a replacement for clinical judgment. Return ONLY a JSON array of objects with fields: { "name": "string", "reasoning": "string" }.`;

    if (process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
      const Groq = require('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
      });
      resultText = completion.choices[0]?.message?.content || '[]';
    } else if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING", description: "Name of the possible diagnosis." },
                reasoning: { type: "STRING", description: "Brief reasoning for this diagnosis." }
              },
              required: ["name", "reasoning"]
            }
          }
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      resultText = response.text();
    } else {
      return res.status(400).json({ error: 'No AI API Key provided' });
    }

    let cleanText = resultText;
    
    // Try to extract JSON array if present
    const arrayMatch = cleanText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      cleanText = arrayMatch[0];
    } else if (cleanText.includes('```')) {
      const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanText = match[1];
      }
    }
    
    const parsedData = JSON.parse(cleanText.trim());
    res.json(parsedData);
  } catch (error) {
    console.error('AI Suggest Error:', error);
    res.status(500).json({ error: `Failed to get suggestions: ${error.message}` });
  }
});

router.post('/summarize', auth, async (req, res) => {
  try {
    const { data } = req.body;
    let resultText = '';
    const prompt = `You are a medical assistant. Generate a patient-friendly summary of this consultation record in simple, easy-to-understand terms. Avoid heavy medical jargon. Provide the summary in both English and Hindi.
    Record: ${JSON.stringify(data)}
    Return a JSON object with fields: { "english": "string", "hindi": "string" }.`;

    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              english: { type: "STRING", description: "Patient-friendly summary in English." },
              hindi: { type: "STRING", description: "Patient-friendly summary in Hindi." }
            },
            required: ["english", "hindi"]
          }
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      resultText = response.text();
    } else {
      return res.status(400).json({ error: 'Gemini API Key required for this feature' });
    }

    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error) {
    console.error('AI Summarize Error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router;
