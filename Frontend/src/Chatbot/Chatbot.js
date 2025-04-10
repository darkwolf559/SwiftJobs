import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import GeminiAPI from '../../GeminiAPI';

// Swift Jobs app knowledge
const SWIFT_JOBS_KNOWLEDGE = `
Swift Jobs is an app designed to reduce searching time for jobs and make the experience user-friendly. The app helps users find relevant job opportunities quickly based on their profile information.

Navigation:
- To view or edit your profile in Swift Jobs, tap the menu icon (three horizontal lines) in the top left corner of the app, then select 'View Profile' from the menu.
- The Swift Jobs main menu is accessed by tapping the three horizontal lines (hamburger menu) in the top left corner, with options including: View Profile, Categories, Notification, Companies, Bookmark, View Jobs, Featured Jobs, Invite Friend, and Log Out.
- To browse job categories, open the main menu and select 'Categories'.
- To view job postings, open the main menu and select 'View Jobs' or 'Featured Jobs'.
- To browse companies with job listings, open the main menu and select 'Companies'.

Features:
- Job recommendations are based on the skills and experience listed in your profile. For better recommendations, ensure your profile is complete.
- Job matches compare your profile's skills, experience, and education with job requirements.
- You can bookmark jobs by tapping the bookmark icon on any listing and access them via the 'Bookmark' menu option.
- Enable notifications to receive alerts about matching job postings via the 'Notification' menu.
- Update your skills by going to 'View Profile' > 'Skills' section.
- The application process involves reviewing job details, clicking 'APPLY', reviewing your pre-filled application, and submitting.
- Invite friends using the 'Invite Friend' option in the main menu.
`;

const Chatbot = ({ apiKey = GeminiAPI }) => { // Use env variable as default
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  
  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: "Hi there! I'm the Swift Jobs assistant. How can I help you navigate the app or find job opportunities today?",
          sender: 'bot'
        }
      ]);
    }
  }, []);

  // Function to reset chat conversation
  const resetChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "Chat has been reset. How can I help you with Swift Jobs today?",
        sender: 'bot'
      }
    ]);
  };

  // Function to send user message and get response directly from Gemini API
  const sendMessage = async () => {
    // Check if message is empty
    if (inputText.trim().length === 0) return;

    // Check if API key is provided
    if (!apiKey) {
      Alert.alert('API Key Required', 'Please provide a Gemini API key to use the chatbot.');
      return;
    }

    // Add user message to the chat
    const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Clear input field
    setInputText('');
    
    // Prepare conversation history for context
    const conversationHistory = [
      // Initial system message with app knowledge
      { 
        role: 'model', 
        parts: [{ 
          text: "I am an AI assistant for Swift Jobs. I have the following information about the app to help users:" + SWIFT_JOBS_KNOWLEDGE
        }]
      },
      // Add previous conversation for context
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      // Add current user message
      { role: 'user', parts: [{ text: inputText }] }
    ];

    setIsLoading(true);

    try {
      // Make a direct request to the Gemini API using Gemini 1.5 Flash model
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        {
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          // Add system instruction to ensure responses reference Swift Jobs app
          systemInstruction: {
            parts: [{
              text: "You are a helpful assistant for Swift Jobs, an app designed to reduce searching time for jobs. When answering questions, provide clear step-by-step instructions with specific UI elements to tap or interact with. Reference the three-line menu in the top left corner for accessing main features. Be concise but thorough in your explanations. Emphasize how Swift Jobs saves time in the job search process."
            }]
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          }
        }
      );

      // Extract the response text from Gemini's response
      let botResponse = '';
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        botResponse = response.data.candidates[0].content.parts[0].text;
      } else {
        botResponse = "Sorry, I couldn't generate a response. Please try again.";
      }

      // Get chatbot response
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
      };

      // Add bot message to chat
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      // Log detailed error information
      console.error('Error details:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response data'
      });
      
      // Add error message to chat with more details
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message || "Unknown error"}. Please make sure your API key is valid and try again.`,
        sender: 'bot',
        isError: true,
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format timestamp
  const getMessageTime = () => {
    const now = new Date();
    return now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
  };

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Render the chat bubbles with appropriate styling
  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AI</Text>
            </View>
          </View>
        )}
        
        <View style={[
          styles.message, 
          isUser ? styles.userMessage : styles.botMessage,
          item.isError && styles.errorMessage
        ]}>
          <Text style={[
            styles.messageText, 
            isUser && styles.userMessageText,
            item.isError && styles.errorMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>
            {getMessageTime()}
          </Text>
        </View>
        
        {isUser && (
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, styles.userAvatar]}>
              <Text style={styles.avatarText}>You</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Background */}
      {LinearGradient ? (
        <LinearGradient
          colors={['#5E1F7B', '#B44B8A', '#FF6B98']}
          style={styles.gradientBackground}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
        />
      ) : (
        <View style={styles.gradientBackground} />
      )}
      
      <StatusBar barStyle="light-content" backgroundColor="#5E1F7B" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header with title and reset button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Swift Jobs Assistant</Text>
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetChat}
            disabled={isLoading}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          contentContainerStyle={styles.messagesContainer}
        />

        {/* Input & Send Button */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            value={inputText}
            onChangeText={setInputText}
            editable={!isLoading}
          />
          {isLoading ? (
            <View style={styles.loadingButton}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.sendButton, inputText.trim().length === 0 && styles.disabledButton]} 
              onPress={sendMessage}
              disabled={inputText.trim().length === 0}
            >
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Updated styles to include header styling
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFAFA', 
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FF6B98', // Fallback color if LinearGradient isn't available
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  message: { 
    padding: 12, 
    borderRadius: 20, 
    maxWidth: '70%', 
    minWidth: 80,
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, 
  },
  userMessage: { 
    backgroundColor: '#B44B8A', 
    borderBottomRightRadius: 4, 
  },
  botMessage: { 
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 4, 
  },
  errorMessage: {
    backgroundColor: '#FFDDDD',
  },
  messageText: { 
    color: '#333', 
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  errorMessageText: {
    color: '#CC0000',
  },
  timeText: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userTimeText: {
    color: 'rgba(255,255,255,0.8)',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    backgroundColor: '#B44B8A',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    paddingVertical: 10, 
    borderTopWidth: 1, 
    borderColor: '#EEEEEE', 
    backgroundColor: '#fff', 
  },
  input: { 
    flex: 1, 
    padding: 12, 
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButton: { 
    marginLeft: 10,
    paddingVertical: 12, 
    paddingHorizontal: 18, 
    backgroundColor: '#B44B8A', 
    borderRadius: 25, 
    shadowColor: '#5E1F7B', 
    shadowOpacity: 0.4, 
    shadowRadius: 4, 
    elevation: 3, 
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0.1,
  },
  loadingButton: {
    marginLeft: 10,
    paddingVertical: 12, 
    paddingHorizontal: 18, 
    backgroundColor: '#B44B8A', 
    borderRadius: 25,
  },
  sendText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16, 
  },
});

export default Chatbot;