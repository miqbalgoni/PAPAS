import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeNotifications } from './src/services/firebase';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/utils/i18n';

// Root component of the application
const App = () => {
  // Initialize push notifications when app loads
  useEffect(() => {
    const setupApp = async () => {
      try {
        await initializeNotifications();
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    setupApp();
  }, []);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <AppNavigator />
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};

export default App;
