import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

// Import translations
import en from '../assets/translations/en.json';
import ur from '../assets/translations/ur.json';

// Default namespace
const defaultNS = 'translation';

// Resources
const resources = {
  en: {
    translation: en
  },
  ur: {
    translation: ur
  }
};

// Detect device language
const detectUserLanguage = async () => {
  try {
    // Try to get stored language preference
    const storedLanguage = await AsyncStorage.getItem('language');
    
    if (storedLanguage) {
      return storedLanguage;
    }
    
    // Fall back to device locale (only if it's one of our supported languages)
    const deviceLocale = Localization.locale.split('-')[0];
    
    // Check if the device locale is supported
    if (['en', 'ur'].includes(deviceLocale)) {
      return deviceLocale;
    }
    
    // Default to English
    return 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en';
  }
};

// Change app UI direction based on language
const setAppDirection = (language) => {
  // Set RTL for Urdu
  const shouldBeRTL = language === 'ur';
  
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    
    // Note: In a real app, you might want to reload the app here
    // to ensure all components respect the new direction
  }
};

// Initialize i18n
const initI18n = async () => {
  const language = await detectUserLanguage();
  
  // Configure RTL
  setAppDirection(language);
  
  // Store the detected language
  await AsyncStorage.setItem('language', language);
  
  // Initialize i18next
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
      defaultNS,
      keySeparator: '.',
      interpolation: {
        escapeValue: false
      }
    });
  
  // Listen for language changes
  i18n.on('languageChanged', async (lng) => {
    await AsyncStorage.setItem('language', lng);
    setAppDirection(lng);
  });
};

// Initialize i18n
initI18n();

/**
 * Get current language
 * @returns {string} Current language code
 */
export const getLanguage = () => {
  return i18n.language;
};

/**
 * Change language
 * @param {string} language - Language code ('en' or 'ur')
 */
export const changeLanguage = async (language) => {
  if (['en', 'ur'].includes(language)) {
    await i18n.changeLanguage(language);
  }
};

export default i18n;
