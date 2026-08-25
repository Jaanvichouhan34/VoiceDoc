/**
 * Parses raw consultation transcripts (bilingual Hindi/English/Hinglish)
 * into alternating Doctor & Patient dialogue turns.
 */

export const formatSpeakerDialogue = (rawText) => {
  if (!rawText || !rawText.trim()) return [];

  // Check if text already contains explicit Doctor: / Patient: prefixes
  if (rawText.includes('Doctor:') || rawText.includes('Patient:')) {
    const turns = [];
    const lines = rawText.split(/(?=Doctor:|Patient:)/i);
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      if (/^Doctor:/i.test(trimmed)) {
        turns.push({
          speaker: 'Doctor',
          text: trimmed.replace(/^Doctor:\s*/i, '').trim()
        });
      } else if (/^Patient:/i.test(trimmed)) {
        turns.push({
          speaker: 'Patient',
          text: trimmed.replace(/^Patient:\s*/i, '').trim()
        });
      } else {
        turns.push({
          speaker: 'Doctor',
          text: trimmed
        });
      }
    });

    return turns.filter(t => t.text.length > 0);
  }

  // Auto-diarization: Split by sentences/pauses and assign turn order
  const sentences = rawText
    .split(/(?<=[.?!])\s+|(?:\n+)/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) return [];

  const turns = [];
  let currentSpeaker = 'Doctor';

  const doctorCues = /bataiye|takleef|temperature|check|bp|pulse|heart rate|paracetamol|tablet|dawa|lijiye|karein|follow up|good morning|how are|namaste/i;
  const patientCues = /mujhe|doctor saab|sir|bukhar|khasi|dard|jalan|pet me|pichle|din se|ho raha|pain|fever/i;

  sentences.forEach((sentence) => {
    if (doctorCues.test(sentence)) {
      currentSpeaker = 'Doctor';
    } else if (patientCues.test(sentence)) {
      currentSpeaker = 'Patient';
    }

    if (turns.length > 0 && turns[turns.length - 1].speaker === currentSpeaker) {
      turns[turns.length - 1].text += ' ' + sentence;
    } else {
      turns.push({
        speaker: currentSpeaker,
        text: sentence
      });
      // Toggle for next turn if no specific cue
      currentSpeaker = currentSpeaker === 'Doctor' ? 'Patient' : 'Doctor';
    }
  });

  return turns;
};

/**
 * Re-constructs formatted transcript string with Doctor: and Patient: prefixes.
 */
export const toSpeakerTaggedText = (rawText) => {
  const turns = formatSpeakerDialogue(rawText);
  if (turns.length === 0) return rawText;
  return turns.map(t => `${t.speaker}: ${t.text}`).join('\n');
};
