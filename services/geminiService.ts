import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VocabWord } from "../types";
import { AUDIO_SAMPLE_RATE } from "../constants";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Text Generation ---

export const generateVocabulary = async (topic: string): Promise<VocabWord[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 30 Turkish vocabulary words related to the topic: "${topic}". 
      Target Level: CEFR A1 (Absolute Beginner).
      
      Strict Rules:
      1. Words must be suitable for a complete beginner.
      2. Example sentences must be VERY SHORT and SIMPLE (Subject-Object-Verb structure where possible).
      3. Do not use complex grammar or long sentences. Keep it basic.
      
      For each word, provide:
      1. The Turkish word.
      2. The Traditional Chinese translation.
      3. A pronunciation guide (phonetic approximation).
      4. A simple A1-level example sentence.
      5. The Chinese translation of that sentence.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              turkish: { type: Type.STRING },
              chinese: { type: Type.STRING },
              pronunciation: { type: Type.STRING },
              exampleSentence: { type: Type.STRING },
              exampleTranslation: { type: Type.STRING },
            },
            required: ["turkish", "chinese", "pronunciation", "exampleSentence", "exampleTranslation"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as VocabWord[];
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    throw error;
  }
};

// --- Audio Generation (TTS) ---

// Helper to decode base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to manually decode raw PCM data (Gemini returns 16-bit PCM, 24kHz)
// Browser's decodeAudioData expects a file header (WAV/MP3), so we must do this manually for raw PCM.
function decodePCMData(
  data: Uint8Array,
  ctx: AudioContext
): AudioBuffer {
  const sampleRate = AUDIO_SAMPLE_RATE;
  const numChannels = 1;
  
  // Create Int16 view of the byte buffer safely
  // Ensure we are reading the correct byte range
  const int16Data = new Int16Array(data.buffer, data.byteOffset, data.length / 2);
  
  // Create the AudioBuffer
  const buffer = ctx.createBuffer(numChannels, int16Data.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Normalize 16-bit integers to [-1.0, 1.0] float
  for (let i = 0; i < int16Data.length; i++) {
    channelData[i] = int16Data[i] / 32768.0;
  }
  
  return buffer;
}

let audioContext: AudioContext | null = null;

export const playTurkishTTS = async (text: string): Promise<void> => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: AUDIO_SAMPLE_RATE,
      });
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Use Modality.AUDIO strictly and ensure contents is an array of parts
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{
        parts: [{ text: text }],
      }],
      config: {
        responseModalities: [Modality.AUDIO], 
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const base64Audio = candidate?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      console.error("Gemini TTS Response missing audio. Full response:", response);
      // Check if we got text instead (fallback behavior of the model)
      const textPart = candidate?.content?.parts?.[0]?.text;
      if (textPart) {
        console.error("Received text response instead of audio:", textPart);
      }
      throw new Error("No audio data received from Gemini TTS API");
    }

    const audioBytes = decode(base64Audio);
    // Use manual PCM decoding
    const audioBuffer = decodePCMData(audioBytes, audioContext);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();

  } catch (error) {
    console.error("Error playing TTS:", error);
    // We throw here so the UI can decide whether to show an alert
    throw error; 
  }
};
