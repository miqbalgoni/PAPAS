/**
 * OpenAI Controller
 * Handles integration with AI services (OpenAI and xAI's Grok)
 */
const { storage } = require('../storage');
const openai = require('../utils/openai');
const grok = require('../utils/grok');
const mockResponses = require('../utils/mockResponses');

// Configuration for which AI service to use
const USE_GROK = process.env.USE_GROK === 'true'; // Only use Grok if explicitly enabled
const USE_MOCK_RESPONSES = process.env.NODE_ENV === 'development' || process.env.USE_MOCK_RESPONSES === 'true';

// Process a chat message
exports.processMessage = async (req, res) => {
  try {
    const { userId, message, language = 'english' } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: 'User ID and message are required'
      });
    }

    // Save the user message to chat history
    await storage.saveChatMessage(userId, message, true, language);

    // Get chat history for context (limit to last 10 messages for token efficiency)
    const chatHistory = await storage.getChatHistory(userId, 10);

    // Get AI response using appropriate service
    let aiResponse;
    let usedService = 'openai';
    
    try {
      if (USE_GROK) {
        aiResponse = await grok.getEducationalResponse(message, chatHistory, language);
        usedService = 'grok';
      } else {
        aiResponse = await openai.getEducationalResponse(message, chatHistory, language);
      }
    } catch (error) {
      console.log('Primary AI service failed, falling back to OpenAI:', error.message);
      
      try {
        // Fall back to OpenAI if Grok fails
        aiResponse = await openai.getEducationalResponse(message, chatHistory, language);
      } catch (openaiError) {
        console.log('OpenAI fallback failed:', openaiError.message);
        
        if (USE_MOCK_RESPONSES) {
          // Last resort: use mock responses for development
          console.log('Using mock responses for development');
          aiResponse = await mockResponses.getEducationalResponse(message, chatHistory, language);
          usedService = 'mock';
        } else {
          // Re-throw the error if mock responses are not enabled
          throw openaiError;
        }
      }
    }

    // Save the AI response to chat history
    const savedResponse = await storage.saveChatMessage(userId, aiResponse, false, language);

    return res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        messageId: savedResponse.id
      }
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing message',
      error: error.message
    });
  }
};

// Process audio input
exports.processAudio = async (req, res) => {
  try {
    const { userId, audio, language = 'english' } = req.body;

    if (!userId || !audio) {
      return res.status(400).json({
        success: false,
        message: 'User ID and audio data are required'
      });
    }

    // Transcribe audio using appropriate service
    let transcription;
    
    try {
      // Currently only OpenAI has transcription capability
      transcription = await openai.transcribeAudio(audio);
    } catch (error) {
      console.log('Error transcribing audio with OpenAI:', error.message);
      
      if (USE_MOCK_RESPONSES) {
        // Use mock transcription for development
        console.log('Using mock transcription for development');
        transcription = await mockResponses.transcribeAudio(audio);
      } else {
        // Re-throw the error if mock responses are not enabled
        throw error;
      }
    }

    // Process the transcribed text as a regular message
    // Save the transcribed message to chat history
    await storage.saveChatMessage(userId, transcription, true, language);

    // Get chat history for context
    const chatHistory = await storage.getChatHistory(userId, 10);

    // Get AI response
    let aiResponse;
    let usedService = 'openai';
    
    try {
      if (USE_GROK) {
        aiResponse = await grok.getEducationalResponse(transcription, chatHistory, language);
        usedService = 'grok';
      } else {
        aiResponse = await openai.getEducationalResponse(transcription, chatHistory, language);
      }
    } catch (error) {
      console.log('Primary AI service failed for audio response, falling back to OpenAI:', error.message);
      // Fall back to OpenAI if Grok fails
      aiResponse = await openai.getEducationalResponse(transcription, chatHistory, language);
    }

    // Save the AI response to chat history
    const savedResponse = await storage.saveChatMessage(userId, aiResponse, false, language);

    return res.status(200).json({
      success: true,
      data: {
        transcription,
        message: aiResponse,
        messageId: savedResponse.id
      }
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing audio',
      error: error.message
    });
  }
};

// Translate text between English and Urdu
exports.translateText = async (req, res) => {
  try {
    const { text, targetLanguage = 'english' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text to translate is required'
      });
    }

    // Use appropriate service for translation
    let translatedText;
    let usedService = 'openai';
    
    try {
      if (USE_GROK) {
        translatedText = await grok.translateText(text, targetLanguage);
        usedService = 'grok';
      } else {
        translatedText = await openai.translateText(text, targetLanguage);
      }
    } catch (error) {
      console.log('Primary AI service failed for translation, falling back to OpenAI:', error.message);
      // Fall back to OpenAI if Grok fails
      translatedText = await openai.translateText(text, targetLanguage);
    }

    return res.status(200).json({
      success: true,
      data: {
        original: text,
        translated: translatedText,
        language: targetLanguage
      }
    });
  } catch (error) {
    console.error('Error translating text:', error);
    return res.status(500).json({
      success: false,
      message: 'Error translating text',
      error: error.message
    });
  }
};

// Analyze document content
exports.analyzeDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    
    // Get the document content from the database
    const document = await storage.getDocumentById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Use appropriate service for document analysis
    let analysis;
    let usedService = 'openai';
    
    try {
      if (USE_GROK) {
        analysis = await grok.analyzeDocumentContent(document.content);
        usedService = 'grok';
      } else {
        analysis = await openai.analyzeDocumentContent(document.content);
      }
    } catch (error) {
      console.log('Primary AI service failed for document analysis, falling back to OpenAI:', error.message);
      // Fall back to OpenAI if Grok fails
      analysis = await openai.analyzeDocumentContent(document.content);
    }
    
    return res.status(200).json({
      success: true,
      data: {
        documentId,
        documentTitle: document.title,
        analysis
      }
    });
  } catch (error) {
    console.error('Error analyzing document:', error);
    return res.status(500).json({
      success: false,
      message: 'Error analyzing document',
      error: error.message
    });
  }
};