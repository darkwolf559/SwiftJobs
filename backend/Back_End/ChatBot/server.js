// server.js - Backend server for the chatbot
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint to handle chatbot messages
app.post('/api/chat', async (req, res) => {
  try {
    // Get conversation history from request body
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Messages are required and must be an array' 
      });
    }

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Send response back to client
    res.json({
      success: true,
      data: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    
    // Send detailed error to client
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No additional details available'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chatbot API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Chatbot backend server running on port ${PORT}`);
});