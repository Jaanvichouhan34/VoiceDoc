const resultText = `\`\`\`json
{
  "symptoms": ["mild headache", "fever"],
  "diagnosis": "viral fever",
  "medicines": [
    {
      "name": "Paracetamol",
      "dosage": "500mg twice a day",
      "duration": "5 days"
    }
  ],
  "advice": "drink plenty of fluids",
  "followUpDate": "in 5 days"
}
\`\`\``;
const jsonMatch = resultText.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  console.log('No match');
} else {
  console.log('Matched text:', jsonMatch[0]);
  try {
    JSON.parse(jsonMatch[0]);
    console.log('Parsed successfully');
  } catch(e) {
    console.error('Parse failed:', e);
  }
}
