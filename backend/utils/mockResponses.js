/**
 * Mock responses for testing and development when AI services are unavailable
 * 
 * Note: These are only used when both Grok and OpenAI services are not available
 * and only during development. In production, the app should be configured
 * with valid API keys.
 */

const mockEducationalResponses = [
  {
    topic: 'fees',
    response: "According to Kashmir's Fee Fixation Committee (FFC) regulations, private schools must adhere to the fee structure approved by the committee. Schools cannot increase fees arbitrarily and must justify any proposed increases with detailed financial statements. The committee evaluates these proposals based on factors like infrastructure improvements, teacher salaries, and educational quality. Parents can report violations to the FFC or the Directorate of School Education Kashmir."
  },
  {
    topic: 'admission',
    response: "School admissions in Kashmir are regulated to ensure fairness and transparency. Private schools must reserve 25% of seats for economically disadvantaged students as per the Right to Education Act. Schools are required to publish their admission criteria and schedule well in advance. Screening tests for young children (pre-primary and primary) are prohibited. Parents should check if the school has proper recognition from the J&K Board of School Education before seeking admission."
  },
  {
    topic: 'curriculum',
    response: "Schools in Kashmir should follow either the J&K Board of School Education curriculum or recognized national boards like CBSE or ICSE. The curriculum must include compulsory subjects like English, Mathematics, Science, Social Studies, and a regional language option. Additionally, schools are required to provide adequate physical education and arts education. The Director of School Education Kashmir monitors curriculum implementation across schools."
  },
  {
    topic: 'rights',
    response: "Children in Kashmir have several educational rights protected by law. These include the right to free and compulsory education until age 14, protection from physical punishment or mental harassment, right to non-discrimination in education, and special provisions for differently-abled children. The J&K School Education Act along with the Right to Education Act safeguard these rights. Parents can file complaints with the local education department or child rights commission if these rights are violated."
  },
  {
    topic: 'default',
    response: "I understand you have a question about education in Kashmir. While I don't have specific information on this particular topic, I can suggest contacting the Directorate of School Education Kashmir or the Fee Fixation Committee for accurate and up-to-date information. The Parent Association of Private Schools (PAPAS) in Kashmir can also provide guidance on educational policies and regulations affecting students and parents."
  }
];

/**
 * Get a mock educational response based on the message content
 * @param {string} message - User message
 * @param {array} previousMessages - Not used in mock implementation
 * @param {string} language - Language preference
 * @returns {Promise<string>} - Mock AI response
 */
function getEducationalResponse(message, previousMessages = [], language = 'english') {
  // Convert message to lowercase for matching
  const lowerMessage = message.toLowerCase();
  
  // Match keywords to determine the response topic
  let topic = 'default';
  
  if (lowerMessage.includes('fee') || lowerMessage.includes('payment') || lowerMessage.includes('cost')) {
    topic = 'fees';
  } else if (lowerMessage.includes('admission') || lowerMessage.includes('enroll') || lowerMessage.includes('join')) {
    topic = 'admission';
  } else if (lowerMessage.includes('curriculum') || lowerMessage.includes('syllabus') || lowerMessage.includes('course')) {
    topic = 'curriculum';
  } else if (lowerMessage.includes('right') || lowerMessage.includes('protect') || lowerMessage.includes('law')) {
    topic = 'rights';
  }
  
  // Find matching response
  const matchedResponse = mockEducationalResponses.find(r => r.topic === topic);
  
  // Add development mode notification
  const devNotice = "[Note: This is a development mode response. Connect a valid AI service API key for production use.]";
  
  // Simulate async behavior
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${matchedResponse.response}\n\n${devNotice}`);
    }, 500);
  });
}

/**
 * Mock translation between English and Urdu
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language
 * @returns {Promise<string>} - Mocked translated text
 */
function translateText(text, targetLanguage = 'english') {
  // For development purposes, we'll just add a prefix to indicate translation
  const translation = targetLanguage === 'urdu' 
    ? `[Urdu translation would appear here] ${text}` 
    : `[English translation would appear here] ${text}`;
  
  const devNotice = "[Note: This is a development mode translation. Connect a valid AI service API key for actual translation.]";
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${translation}\n\n${devNotice}`);
    }, 300);
  });
}

/**
 * Mock document content analysis
 * @param {string} text - Document content to analyze
 * @returns {Promise<Object>} - Mocked analysis result
 */
function analyzeDocumentContent(text) {
  // Create a simple mock analysis based on text length
  const mockAnalysis = {
    title: "Document Analysis (Development Mode)",
    category: text.length > 1000 ? "Comprehensive Policy" : "Brief Guideline",
    summary: "This is a mock document analysis for development purposes.",
    keyPoints: [
      "This analysis is for development and testing only",
      "Connect a valid AI service API key for production use",
      "The document appears to be " + (text.length > 500 ? "lengthy and detailed" : "brief and concise")
    ],
    relevantFor: "Developers testing the application"
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnalysis);
    }, 700);
  });
}

/**
 * Mock audio transcription
 * @param {string} audioBase64 - Base64 encoded audio data
 * @returns {Promise<string>} - Mocked transcription
 */
function transcribeAudio(audioBase64) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is a mock transcription for development purposes. Connect a valid AI service API key for actual transcription.");
    }, 1000);
  });
}

module.exports = {
  getEducationalResponse,
  translateText,
  analyzeDocumentContent,
  transcribeAudio
};