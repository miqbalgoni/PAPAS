const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openaiController');
const schoolController = require('../controllers/schoolController');
const documentController = require('../controllers/documentController');
const { uploadSampleData } = require('../utils/sampleData');

// AI routes (OpenAI or Grok, depending on configuration)
router.post('/chat', openaiController.processMessage);
router.post('/voice', openaiController.processAudio);
router.post('/translate', openaiController.translateText);
router.get('/analyze/document/:documentId', openaiController.analyzeDocument);

// School routes
router.get('/schools', schoolController.getAllSchools);
router.get('/schools/search', schoolController.searchSchools);
router.get('/schools/:id', schoolController.getSchoolById);

// Document routes
router.get('/documents', documentController.getAllDocuments);
router.get('/documents/search', documentController.searchDocuments);
router.get('/documents/category/:category', documentController.getDocumentsByCategory);
router.get('/documents/:id', documentController.getDocumentById);

// Notification subscription
router.post('/subscribe', (req, res) => {
  // Implementation for notification subscription
  const { token, language } = req.body;
  
  // TODO: Store token in Firebase for push notifications
  
  res.json({ success: true, message: 'Subscription successful' });
});

// Sample data upload route (for development and testing)
router.post('/sample-data', async (req, res) => {
  try {
    const result = await uploadSampleData();
    res.json(result);
  } catch (error) {
    console.error('Error in sample data upload route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
