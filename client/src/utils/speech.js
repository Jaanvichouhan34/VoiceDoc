let recognition = null;
let shouldContinue = false;

export const startRecognition = (onTranscript, language = 'hi-IN') => {
  shouldContinue = true;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition API not supported in this browser. Please use Chrome.");
    return;
  }

  if (recognition) {
    recognition.stop();
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language;

  let finalTranscript = '';

  recognition.onresult = (event) => {
    let currentInterim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        currentInterim += transcript;
      }
    }
    onTranscript(finalTranscript + currentInterim);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    
    if (event.error === 'network') {
      console.warn("Network error detected, waiting for restart...");
    } else if (event.error === 'not-allowed') {
      alert("Microphone access denied. Please allow microphone access in your browser settings.");
      shouldContinue = false;
    }
  };

  recognition.onend = () => {
    if (shouldContinue) {
      console.log("Speech recognition ended, restarting...");
      setTimeout(() => {
        if (shouldContinue) {
          try {
            recognition.start();
          } catch (e) {
            console.error("Failed to restart recognition:", e);
          }
        }
      }, 500); // Small delay to prevent tight loops
    }
  };

  recognition.start();
};

export const stopRecognition = () => {
  shouldContinue = false;
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
};
