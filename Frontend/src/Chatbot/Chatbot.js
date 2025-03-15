import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env'; // Import the API key from the environment variables

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Function to send user message and get response
  const sendMessage = async () => {
    if (!inputText.trim().length === 0) return; // Ignore empty messages

    // Add user message to the chat
    const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInputText(''); // Clear input field

    try {
      // Send message to OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', // Or 'gpt-4'
          messages: [{ role: 'user', content: inputText }],
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`, // Using the API key from the environment variable
            'Content-Type': 'application/json',
          },
        }
      );

      // Get chatbot response
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.choices[0].message.content,
        sender: 'bot',
      };

      // Add bot message to chat
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Input & Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          returnKeyType="send"  // Makes return key look like "Send"
          onSubmitEditing={sendMessage} // Calls function when return key is pressed
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 15, 
    backgroundColor: '#EAF4F4', 
  },
  message: { 
    padding: 12, 
    borderRadius: 18, 
    marginVertical: 6, 
    maxWidth: '80%', 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    elevation: 2, 
  },

  userMessage: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#007AFF', 
    borderBottomRightRadius: 5, 
  },
  botMessage: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#DCF8C6', 
    borderBottomLeftRadius: 5, 
  },
  messageText: { 
    color: '#333', 
    fontSize: 16, 
    fontWeight: '500', 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10, 
    padding: 10, 
    borderTopWidth: 1, 
    borderColor: '#ddd', 
    backgroundColor: '#fff', 
  },
  input: { 
    flex: 1, 
    padding: 12, 
    borderWidth: 1, 
    borderRadius: 25, 
    borderColor: '#ccc', 
    backgroundColor: '#fff', 
    fontSize: 16, 
  },
  sendButton: { 
    marginLeft: 10, 
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    backgroundColor: '#007AFF', 
    borderRadius: 25, 
    shadowColor: '#007AFF', 
    shadowOpacity: 0.4, 
    shadowRadius: 4, 
    elevation: 3, 
  },
  sendText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16, 
  }
});

export default Chatbot;