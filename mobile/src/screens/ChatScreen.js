import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { sendChatMessage } from '../services/api';
import ChatComponent from '../components/ChatComponent';

const ChatScreen = () => {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatHistory.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (message.trim() === '') return;
    
    // Add user message to chat history
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatHistory(prevHistory => [...prevHistory, userMessage]);
    setMessage('');
    setLoading(true);
    
    try {
      // Send message to backend
      const response = await sendChatMessage(
        message, 
        i18n.language === 'ur' ? 'urdu' : 'english',
        chatHistory
      );
      
      if (response.success) {
        // Add AI response to chat history
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          isUser: false,
          timestamp: new Date()
        };
        
        setChatHistory(prevHistory => [...prevHistory, aiMessage]);
      } else {
        // Handle error response
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: t('chat.error_message'),
          isUser: false,
          isError: true,
          timestamp: new Date()
        };
        
        setChatHistory(prevHistory => [...prevHistory, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message to chat history
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: t('chat.error_message'),
        isUser: false,
        isError: true,
        timestamp: new Date()
      };
      
      setChatHistory(prevHistory => [...prevHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderChatBubble = ({ item }) => (
    <ChatComponent 
      message={item.text}
      isUser={item.isUser}
      isError={item.isError}
      timestamp={item.timestamp}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{t('chat.header')}</Text>
      </View>
      
      <View style={styles.chatContainer}>
        {chatHistory.length === 0 ? (
          <View style={styles.emptyChatContainer}>
            <Feather name="message-circle" size={50} color="#CCCCCC" />
            <Text style={styles.emptyChatText}>{t('chat.empty_chat')}</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={chatHistory}
            renderItem={renderChatBubble}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={t('chat.input_placeholder')}
          placeholderTextColor="#999999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.disabledButton]}
          onPress={handleSend}
          disabled={!message.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Feather name="send" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatList: {
    paddingVertical: 10,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChatText: {
    marginTop: 10,
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4285F4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
});

export default ChatScreen;
