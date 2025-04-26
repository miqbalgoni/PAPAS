import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import LanguageSelector from '../components/LanguageSelector';
import { 
  getNotificationStatus, 
  toggleNotifications,
  registerForPushNotifications
} from '../services/firebase';

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const checkNotificationStatus = async () => {
      const status = await getNotificationStatus();
      setNotificationsEnabled(status);
    };
    
    checkNotificationStatus();
  }, []);
  
  const handleNotificationsToggle = async (value) => {
    setLoading(true);
    
    try {
      if (value) {
        // Request permissions and get token
        const token = await registerForPushNotifications();
        
        if (!token) {
          Alert.alert(
            t('settings.notification_permission_title'),
            t('settings.notification_permission_message')
          );
          setNotificationsEnabled(false);
          return;
        }
      }
      
      // Update the setting in storage and state
      await toggleNotifications(value);
      setNotificationsEnabled(value);
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert(
        t('settings.error_title'),
        t('settings.notification_error')
      );
      setNotificationsEnabled(false);
    } finally {
      setLoading(false);
    }
  };
  
  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.papaskashmir.org/privacy-policy');
  };
  
  const openTermsOfService = () => {
    Linking.openURL('https://www.papaskashmir.org/terms-of-service');
  };
  
  const showAboutInfo = () => {
    Alert.alert(
      t('settings.about_title'),
      t('settings.about_message'),
      [{ text: t('common.ok') }]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('settings.subtitle')}</Text>
      </View>
      
      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <LanguageSelector />
      </View>
      
      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>{t('settings.push_notifications')}</Text>
            <Text style={styles.settingDescription}>{t('settings.push_description')}</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            disabled={loading}
            trackColor={{ false: '#D1D1D1', true: '#BED8FB' }}
            thumbColor={notificationsEnabled ? '#4285F4' : '#F5F5F5'}
          />
        </View>
      </View>
      
      {/* About & Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.about_info')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={showAboutInfo}>
          <Feather name="info" size={20} color="#4285F4" />
          <Text style={styles.menuItemText}>{t('settings.about')}</Text>
          <Feather name="chevron-right" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={openPrivacyPolicy}>
          <Feather name="shield" size={20} color="#4285F4" />
          <Text style={styles.menuItemText}>{t('settings.privacy_policy')}</Text>
          <Feather name="chevron-right" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={openTermsOfService}>
          <Feather name="file-text" size={20} color="#4285F4" />
          <Text style={styles.menuItemText}>{t('settings.terms_of_service')}</Text>
          <Feather name="chevron-right" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>
      
      {/* App Info Section */}
      <View style={styles.appInfoContainer}>
        <Text style={styles.appName}>PAPAS Kashmir</Text>
        <Text style={styles.appVersion}>v1.0.0</Text>
        <Text style={styles.appCopyright}>© 2023 PAPAS Association</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 10,
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 12,
    color: '#999999',
  },
});

export default SettingsScreen;
