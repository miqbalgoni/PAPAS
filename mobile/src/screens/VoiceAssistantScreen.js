import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import VoiceComponent from '../components/VoiceComponent';
import { sendVoiceMessage } from '../services/api';

const VoiceAssistantScreen = () => {
  const { t, i18n } = useTranslation();
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Request permissions for audio recording
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            t('voice.permission_title'),
            t('voice.permission_message')
          );
        }
      } catch (err) {
        console.error('Failed to get recording permissions', err);
      }
    })();

    // Clean up recording on unmount
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Clear previous messages
      setMessage('');
      setAiResponse('');

      // Configure audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert(t('voice.recording_error'), err.message);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    setIsRecording(false);
    setIsProcessing(true);
    
    try {
      await recording.stopAndUnloadAsync();
      
      // Get recording URI
      const uri = recording.getURI();
      setRecording(null);
      
      // Read the audio file as base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Send to server for processing
      const language = i18n.language === 'ur' ? 'urdu' : 'english';
      const response = await sendVoiceMessage(`data:audio/webm;base64,${base64Audio}`, language);
      
      if (response.success) {
        setMessage(response.transcription || t('voice.transcription_error'));
        setAiResponse(response.message);
      } else {
        setMessage(t('voice.processing_error'));
      }
    } catch (err) {
      console.error('Failed to stop recording or process audio', err);
      setMessage(t('voice.processing_error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelRecording = async () => {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to cancel recording', err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{t('voice.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('voice.subtitle')}</Text>
        </View>
        
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
            <Text style={styles.processingText}>{t('voice.processing')}</Text>
          </View>
        )}
        
        {message ? (
          <View style={styles.resultContainer}>
            <View style={styles.transcriptionContainer}>
              <Text style={styles.sectionTitle}>{t('voice.your_question')}</Text>
              <Text style={styles.transcriptionText}>{message}</Text>
            </View>
            
            <View style={styles.aiResponseContainer}>
              <Text style={styles.sectionTitle}>{t('voice.ai_response')}</Text>
              <VoiceComponent message={aiResponse} />
            </View>
          </View>
        ) : (
          <View style={styles.instructionsContainer}>
            <Feather name="mic" size={70} color="#4285F4" style={styles.micIcon} />
            <Text style={styles.instructionsText}>
              {t('voice.instructions')}
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.controlsContainer}>
        {isRecording ? (
          <View style={styles.recordingControls}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={cancelRecording}
            >
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>{t('voice.recording')}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.stopButton}
              onPress={stopRecording}
            >
              <Feather name="check" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.recordButton, (isProcessing) && styles.disabledButton]}
            onPress={startRecording}
            disabled={isProcessing}
          >
            <Feather name="mic" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  instructionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  micIcon: {
    marginBottom: 20,
  },
  instructionsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    padding: 20,
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF5252',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    color: '#FF5252',
    fontWeight: 'bold',
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  processingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
  },
  resultContainer: {
    marginTop: 20,
  },
  transcriptionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  aiResponseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
});

export default VoiceAssistantScreen;
