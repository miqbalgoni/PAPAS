import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const VoiceComponent = ({ message }) => {
  const { t, i18n } = useTranslation();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);
  
  const getTextToSpeech = async () => {
    if (!message) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Create TTS request URL - in a real app, this would call your backend
      // which would use a service like Google TTS, Azure Speech Service, etc.
      // For demo, we'll simulate with a fake URL
      const apiEndpoint = 'https://api.example.com/tts';
      const language = i18n.language === 'ur' ? 'ur-PK' : 'en-US';
      
      // In a real implementation, you would:
      // 1. Send the text to your backend
      // 2. Your backend would call a TTS service
      // 3. Your backend would return the audio URL or base64
      
      // For this demo, we'll just display the text and simulate audio loading
      setTimeout(() => {
        setLoading(false);
        // In a real app, you would load the actual audio from the API response
      }, 1000);
      
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setError(t('voice.tts_error'));
      setLoading(false);
    }
  };
  
  const togglePlayback = async () => {
    if (loading) return;
    
    if (sound === null) {
      await getTextToSpeech();
      // In a real implementation, you would use the returned audio URL:
      // await playAudio(audioUrl);
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };
  
  // This would be implemented in a real app to play the received audio
  const playAudio = async (audioUri) => {
    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);
      
      // Set up sound playback finished callback
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setError(t('voice.playback_error'));
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Message Text */}
      <Text style={styles.messageText}>{message}</Text>
      
      {/* Audio Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.playButton, loading && styles.disabledButton]}
          onPress={togglePlayback}
          disabled={loading || !message}
        >
          {loading ? (
            <Feather name="loader" size={18} color="#FFFFFF" />
          ) : isPlaying ? (
            <Feather name="pause" size={18} color="#FFFFFF" />
          ) : (
            <Feather name="play" size={18} color="#FFFFFF" />
          )}
          <Text style={styles.playButtonText}>
            {loading ? t('voice.loading') : 
             isPlaying ? t('voice.pause') : t('voice.play')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={16} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 15,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  playButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 5,
  },
  errorText: {
    color: '#D32F2F',
    marginLeft: 5,
    fontSize: 14,
  },
});

export default VoiceComponent;
