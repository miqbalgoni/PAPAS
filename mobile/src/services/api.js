import { Alert } from 'react-native';
import { getLanguage } from '../utils/i18n';

// Base URL for API requests
const API_URL = process.env.API_URL || 'http://localhost:8000/api';

/**
 * Generic function to make API requests
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {object} data - Request body data
 * @returns {Promise} - API response
 */
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const url = `${API_URL}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Network error occurred');
    }
    
    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      success: false,
      message: error.message || 'An error occurred while communicating with the server',
    };
  }
};

/**
 * Send a chat message to the AI
 * @param {string} message - User message
 * @param {string} language - Language (english/urdu)
 * @param {Array} chatHistory - Previous chat messages
 * @returns {Promise} - AI response
 */
export const sendChatMessage = async (message, language = 'english', chatHistory = []) => {
  const formattedHistory = chatHistory.map(msg => ({
    text: msg.text,
    isUser: msg.isUser,
  }));
  
  return apiRequest('/chat', 'POST', {
    message,
    language,
    chatHistory: formattedHistory,
  });
};

/**
 * Send a voice recording to the AI
 * @param {string} audio - Base64 encoded audio
 * @param {string} language - Language (english/urdu)
 * @returns {Promise} - AI response
 */
export const sendVoiceMessage = async (audio, language = 'english') => {
  return apiRequest('/voice', 'POST', {
    audio,
    language,
  });
};

/**
 * Get a list of documents
 * @param {number} page - Page number
 * @param {number} limit - Documents per page
 * @param {string} category - Document category
 * @returns {Promise} - Documents list
 */
export const getDocuments = async (page = 1, limit = 20, category = null) => {
  let endpoint = `/documents?page=${page}&limit=${limit}`;
  
  if (category) {
    endpoint += `&type=${encodeURIComponent(category)}`;
  }
  
  return apiRequest(endpoint);
};

/**
 * Get a specific document by ID
 * @param {string} id - Document ID
 * @returns {Promise} - Document details
 */
export const getDocumentById = async (id) => {
  return apiRequest(`/documents/${id}`);
};

/**
 * Search for documents
 * @param {string} query - Search query
 * @returns {Promise} - Search results
 */
export const searchDocuments = async (query) => {
  return apiRequest(`/documents/search?query=${encodeURIComponent(query)}`);
};

/**
 * Get a list of schools
 * @param {number} page - Page number
 * @param {number} limit - Schools per page
 * @returns {Promise} - Schools list
 */
export const getSchools = async (page = 1, limit = 20) => {
  return apiRequest(`/schools?page=${page}&limit=${limit}`);
};

/**
 * Get a specific school by ID
 * @param {string} id - School ID
 * @returns {Promise} - School details
 */
export const getSchoolById = async (id) => {
  return apiRequest(`/schools/${id}`);
};

/**
 * Search for schools
 * @param {string} query - Search query
 * @returns {Promise} - Search results
 */
export const searchSchools = async (query) => {
  return apiRequest(`/schools/search?query=${encodeURIComponent(query)}`);
};

/**
 * Get featured documents for the home screen
 * @returns {Promise} - Featured documents
 */
export const getFeaturedDocuments = async () => {
  return apiRequest('/documents?limit=5');
};

/**
 * Subscribe for push notifications
 * @param {string} token - Firebase device token
 * @param {string} language - Preferred language
 * @returns {Promise} - Subscription result
 */
export const subscribeToNotifications = async (token, language = 'english') => {
  return apiRequest('/subscribe', 'POST', {
    token,
    language,
  });
};

export default {
  sendChatMessage,
  sendVoiceMessage,
  getDocuments,
  getDocumentById,
  searchDocuments,
  getSchools,
  getSchoolById,
  searchSchools,
  getFeaturedDocuments,
  subscribeToNotifications
};
