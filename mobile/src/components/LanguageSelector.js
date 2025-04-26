import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  const isEnglish = i18n.language === 'en';
  const isUrdu = i18n.language === 'ur';
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('settings.select_language')}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            isEnglish && styles.activeLanguageButton
          ]}
          onPress={() => changeLanguage('en')}
        >
          <Text 
            style={[
              styles.languageText,
              isEnglish && styles.activeLanguageText
            ]}
          >
            English
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.languageButton,
            isUrdu && styles.activeLanguageButton
          ]}
          onPress={() => changeLanguage('ur')}
        >
          <Text 
            style={[
              styles.languageText,
              isUrdu && styles.activeLanguageText
            ]}
          >
            اردو
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
  },
  activeLanguageButton: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  languageText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  activeLanguageText: {
    color: '#FFFFFF',
  },
});

export default LanguageSelector;
