/**
 * Firebase Admin SDK configuration
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp();
      console.log('Firebase Admin initialized successfully');
    }
    return admin;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

// Get Firestore database instance
const getFirestore = () => {
  try {
    initializeFirebase();
    return admin.firestore();
  } catch (error) {
    console.error('Error getting Firestore:', error);
    throw error;
  }
};

module.exports = {
  admin,
  initializeFirebase,
  getFirestore
};