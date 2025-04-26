/**
 * Database API Routes
 * Routes for interacting with PostgreSQL database
 */
const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

// School routes
router.get('/schools/search', dbController.searchSchools);
router.get('/schools/:id', dbController.getSchoolById);
router.get('/schools', dbController.getSchools);

// Document routes
router.get('/documents/search', dbController.searchDocuments);
router.get('/documents/:id', dbController.getDocumentById);
router.get('/documents', dbController.getDocuments);

// Chat history routes
router.post('/chat', dbController.saveChatMessage);
router.get('/chat/:userId', dbController.getChatHistory);

module.exports = router;