import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ChatComponent = ({ message, isUser, isError = false, timestamp }) => {
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '';
  
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.aiContainer,
      isError && styles.errorContainer
    ]}>
      {/* Message Bubble */}
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.aiBubble,
        isError && styles.errorBubble
      ]}>
        {/* Error Icon */}
        {isError && (
          <View style={styles.errorIconContainer}>
            <Feather name="alert-circle" size={16} color="#F44336" />
          </View>
        )}
        
        {/* Message Text */}
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.aiText,
          isError && styles.errorText
        ]}>
          {message}
        </Text>
      </View>
      
      {/* Timestamp */}
      <Text style={[
        styles.timestamp,
        isUser ? styles.userTimestamp : styles.aiTimestamp
      ]}>
        {formattedTime}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  errorContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#4285F4',
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  errorBubble: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#333333',
  },
  errorText: {
    color: '#D32F2F',
  },
  errorIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#90CAF9',
    alignSelf: 'flex-end',
  },
  aiTimestamp: {
    color: '#9E9E9E',
    alignSelf: 'flex-start',
  },
});

export default ChatComponent;
