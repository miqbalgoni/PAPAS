import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where,
  limit
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import Constants from 'expo-constants';
import { subscribeToNotifications } from './api';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let db;
let messaging;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  // Only initialize messaging on web platforms
  if (Platform.OS === 'web') {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Initialize notifications for the app
 */
export const initializeNotifications = async () => {
  try {
    // Check if notifications are already enabled
    const notificationsEnabled = await getNotificationStatus();
    
    if (notificationsEnabled) {
      await registerForPushNotifications();
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

/**
 * Register for push notifications
 * @returns {Promise<string|null>} - Device token or null if failed
 */
export const registerForPushNotifications = async () => {
  try {
    // Check permissions first
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // If not granted, request permission
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return null;
    }
    
    // Get Expo push token
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4285F4',
      });
    }
    
    // Get push token
    const pushTokenData = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    token = pushTokenData.data;
    
    // Save the token locally
    await AsyncStorage.setItem('pushToken', token);
    await AsyncStorage.setItem('notificationsEnabled', 'true');
    
    // Register with your server
    const language = await AsyncStorage.getItem('language') || 'english';
    await subscribeToNotifications(token, language);
    
    return token;
  } catch (error) {
    console.error('Error registering for notifications:', error);
    return null;
  }
};

/**
 * Get the current notification status
 * @returns {Promise<boolean>} - Whether notifications are enabled
 */
export const getNotificationStatus = async () => {
  try {
    const status = await AsyncStorage.getItem('notificationsEnabled');
    return status === 'true';
  } catch (error) {
    console.error('Error getting notification status:', error);
    return false;
  }
};

/**
 * Toggle notifications on/off
 * @param {boolean} enabled - Whether to enable notifications
 * @returns {Promise<boolean>} - Success status
 */
export const toggleNotifications = async (enabled) => {
  try {
    await AsyncStorage.setItem('notificationsEnabled', enabled ? 'true' : 'false');
    
    if (enabled) {
      await registerForPushNotifications();
    }
    
    return true;
  } catch (error) {
    console.error('Error toggling notifications:', error);
    return false;
  }
};

/**
 * Get documents from Firestore
 * @param {string} collectionName - Firestore collection name
 * @param {number} limitCount - Number of documents to retrieve
 * @returns {Promise<Array>} - Array of documents
 */
export const getFirestoreDocuments = async (collectionName, limitCount = 10) => {
  try {
    if (!db) throw new Error('Firestore not initialized');
    
    const querySnapshot = await getDocs(
      query(collection(db, collectionName), limit(limitCount))
    );
    
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return documents;
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    return [];
  }
};

/**
 * Get a document by ID from Firestore
 * @param {string} collectionName - Firestore collection name
 * @param {string} documentId - Document ID
 * @returns {Promise<Object|null>} - Document data or null
 */
export const getFirestoreDocumentById = async (collectionName, documentId) => {
  try {
    if (!db) throw new Error('Firestore not initialized');
    
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting ${collectionName} document:`, error);
    return null;
  }
};

export default {
  app,
  db,
  initializeNotifications,
  registerForPushNotifications,
  getNotificationStatus,
  toggleNotifications,
  getFirestoreDocuments,
  getFirestoreDocumentById
};
