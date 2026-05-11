require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function test() {
  const prompt = `You are a medical scribe assistant. Extract structured information from this doctor's spoken consultation transcript. Return ONLY a JSON object with these fields: { "symptoms": [], "diagnosis": "string", "medicines": [{ "name": "string", "dosage": "string", "duration": "string" }], "advice": "string", "followUpDate": "string" }. Transcript: The patient has a mild headache and fever. Diagnosed with viral fever. Prescribed Paracetamol 500mg twice a day for 5 days. Advised to drink plenty of fluids. Follow up in 5 days.`;
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0,
  });
  console.log('--- RESPONSE ---');
  console.log(completion.choices[0]?.message?.content);
  console.log('----------------');
}
test().catch(console.error);
