/**
 * Database Controller
 * Provides data access methods for the application to use PostgreSQL database
 */
const { storage } = require('../storage');

// Get schools with pagination
exports.getSchools = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const schools = await storage.getSchools(page, limit);
    
    return res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });
  } catch (error) {
    console.error('Error getting schools:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving schools',
      error: error.message
    });
  }
};

// Get school by ID
exports.getSchoolById = async (req, res) => {
  try {
    const school = await storage.getSchoolById(req.params.id);
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: school
    });
  } catch (error) {
    console.error('Error getting school:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving school',
      error: error.message
    });
  }
};

// Search schools
exports.searchSchools = async (req, res) => {
  try {
    // Support both query and q parameters for flexibility
    const query = req.query.query || req.query.q;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const schools = await storage.searchSchools(query);
    
    return res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });
  } catch (error) {
    console.error('Error searching schools:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching schools',
      error: error.message
    });
  }
};

// Get documents with pagination
exports.getDocuments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;
    
    const documents = await storage.getDocuments(page, limit, category);
    
    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Error getting documents:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving documents',
      error: error.message
    });
  }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const document = await storage.getDocumentById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Error getting document:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving document',
      error: error.message
    });
  }
};

// Search documents
exports.searchDocuments = async (req, res) => {
  try {
    // Support both query and q parameters for flexibility
    const query = req.query.query || req.query.q;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const documents = await storage.searchDocuments(query);
    
    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Error searching documents:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching documents',
      error: error.message
    });
  }
};

// Save chat message
exports.saveChatMessage = async (req, res) => {
  try {
    const { userId, message, isUser, language } = req.body;
    
    if (!userId || !message || isUser === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const chatMessage = await storage.saveChatMessage(userId, message, isUser, language || 'english');
    
    return res.status(201).json({
      success: true,
      data: chatMessage
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error saving chat message',
      error: error.message
    });
  }
};

// Get chat history for a user
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit) || 50;
    
    const history = await storage.getChatHistory(userId, limit);
    
    return res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving chat history',
      error: error.message
    });
  }
};