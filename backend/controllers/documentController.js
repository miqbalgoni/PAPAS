/**
 * Document Controller
 * Handles API requests related to educational documents
 */

const { sampleDocuments } = require('../utils/sampleData');

// When Firebase is not available, use the sample data directly
const USE_SAMPLE_DATA = true;

/**
 * Get all documents with pagination
 */
exports.getAllDocuments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    
    if (USE_SAMPLE_DATA) {
      // Use sample data
      const paginatedDocuments = sampleDocuments.slice(startIndex, startIndex + limit);
      
      return res.json({
        success: true,
        count: sampleDocuments.length,
        page,
        totalPages: Math.ceil(sampleDocuments.length / limit),
        data: paginatedDocuments
      });
    }
    
    // Firebase implementation would go here
    
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

/**
 * Get document by ID
 */
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Document ID is required'
      });
    }
    
    if (USE_SAMPLE_DATA) {
      // Find document in sample data
      const document = sampleDocuments.find(doc => doc.id === id);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }
      
      return res.json({
        success: true,
        data: document
      });
    }
    
    // Firebase implementation would go here
    
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching document details',
      error: error.message
    });
  }
};

/**
 * Get documents by category
 */
exports.getDocumentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Document category is required'
      });
    }
    
    if (USE_SAMPLE_DATA) {
      // Filter documents by category
      const filteredDocuments = sampleDocuments.filter(doc => doc.category === category);
      
      return res.json({
        success: true,
        count: filteredDocuments.length,
        data: filteredDocuments
      });
    }
    
    // Firebase implementation would go here
    
  } catch (error) {
    console.error('Error fetching documents by category:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching documents by category',
      error: error.message
    });
  }
};

/**
 * Search documents by title or content
 */
exports.searchDocuments = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    if (USE_SAMPLE_DATA) {
      // Search in sample data
      const searchTerm = query.toLowerCase();
      const results = sampleDocuments.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm) || 
        doc.content.toLowerCase().includes(searchTerm) ||
        doc.summary.toLowerCase().includes(searchTerm)
      );
      
      return res.json({
        success: true,
        count: results.length,
        data: results
      });
    }
    
    // Firebase implementation would go here
    
  } catch (error) {
    console.error('Error searching documents:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching documents',
      error: error.message
    });
  }
};