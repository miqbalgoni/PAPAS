/**
 * OpenAI API Integration
 * Provides functionality to interact with OpenAI's API
 */
require('dotenv').config();
const OpenAI = require('openai');

// Initialize the OpenAI client
// Note: We only use this if Grok is not available or configured
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Get an educational response from OpenAI
 * @param {string} message - User message
 * @param {array} previousMessages - Previous chat messages for context
 * @param {string} language - Preferred language (english or urdu)
 * @returns {Promise<string>} - AI response
 */
async function getEducationalResponse(message, previousMessages = [], language = 'english') {
  try {
    // Format previous messages for context
    const formattedPreviousMessages = previousMessages.map(msg => ({
      role: msg.is_user ? 'user' : 'assistant',
      content: msg.message
    }));

    // Create system message based on language preference
    const systemMessage = {
      role: 'system',
      content: `You are an educational assistant for PAPAS (Parent Association of Private Schools) in Kashmir, specializing in educational policies, fee structures, and school regulations. 
      Always be helpful, informative, and concise.
      ${language === 'urdu' ? 'Please respond in Urdu language.' : 'Please respond in English language.'}
      Focus on providing information about Kashmir's education system, fee regulations, student rights, and school policies.
      If you're not sure about specific details, suggest where the parent might find official information.`
    };

    // Format the conversation history including the current user message
    const messages = [
      systemMessage,
      ...formattedPreviousMessages,
      { role: 'user', content: message }
    ];

    // Call GPT-4o model (the newest OpenAI model as of 2024)
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error getting response from OpenAI:', error);
    throw new Error(`Failed to get response from AI: ${error.message}`);
  }
}

/**
 * Translates text between English and Urdu using OpenAI
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language ('english' or 'urdu')
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text, targetLanguage = 'english') {
  try {
    // Skip translation if text is empty
    if (!text || text.trim() === '') {
      return text;
    }

    const fromLanguage = targetLanguage === 'english' ? 'Urdu' : 'English';
    const toLanguage = targetLanguage === 'english' ? 'English' : 'Urdu';

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following ${fromLanguage} text to ${toLanguage}. Maintain the meaning, tone, and formality of the original text. Only respond with the translated text, no additional comments.`
        },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error translating text with OpenAI:', error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}

/**
 * Analyze document content to extract educational information
 * @param {string} text - Document content to analyze
 * @returns {Promise<Object>} - Structured information extracted from text
 */
async function analyzeDocumentContent(text) {
  try {
    // Skip analysis if text is empty
    if (!text || text.trim() === '') {
      return {};
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Extract key educational information from the provided document. 
          Return a JSON object with the following fields:
          - title: A concise title for the document
          - category: The category of the document (e.g., "Fee Fixation", "Registration", "Child Rights", etc.)
          - summary: A brief summary (1-2 sentences)
          - keyPoints: An array of key points as strings
          - relevantFor: Who this information is most relevant for (e.g., "Parents of primary school children", "All parents", etc.)
          `
        },
        { role: 'user', content: text }
      ],
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing document with OpenAI:', error);
    return {
      title: "Document Analysis",
      category: "Unknown",
      summary: "Unable to analyze document content",
      keyPoints: ["Error processing document"],
      relevantFor: "Unknown"
    };
  }
}

/**
 * Transcribe audio to text using OpenAI's Whisper model
 * @param {string} audioBase64 - Base64 encoded audio data
 * @returns {Promise<string>} - Transcribed text
 */
async function transcribeAudio(audioBase64) {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(audioBase64, 'base64');
    
    // Create a temporary file
    const fs = require('fs');
    const path = require('path');
    const tempFilePath = path.join(__dirname, '..', '..', 'temp_audio.webm');
    
    // Write the buffer to a temporary file
    fs.writeFileSync(tempFilePath, buffer);
    
    // Create a readable stream from the file
    const audioReadStream = fs.createReadStream(tempFilePath);
    
    // Transcribe the audio
    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      language: "en" // Default to English
    });
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

module.exports = {
  getEducationalResponse,
  translateText,
  analyzeDocumentContent,
  transcribeAudio
};