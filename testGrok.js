/**
 * Test script to verify Grok API integration
 */
require('dotenv').config();
const { OpenAI } = require('openai');

// Check if XAI_API_KEY is available
if (!process.env.XAI_API_KEY) {
  console.error('Error: XAI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Initialize the OpenAI-compatible client with xAI endpoint
const xai = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY
});

// Test a simple chat completion
async function testChat() {
  try {
    console.log('Testing Grok chat completion...');
    const response = await xai.chat.completions.create({
      model: 'grok-2-1212',
      messages: [
        {
          role: 'system',
          content: 'You are an educational assistant for parents in Kashmir, specializing in educational policies and school regulations.'
        },
        {
          role: 'user',
          content: 'What are the key regulations for private school fees in Kashmir?'
        }
      ],
      max_tokens: 300
    });

    console.log('\nResponse from Grok:\n');
    console.log(response.choices[0].message.content);
    console.log('\nModel used:', response.model);
    console.log('Test completed successfully!\n');
    return true;
  } catch (error) {
    console.error('Error testing Grok API:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  const chatResult = await testChat();
  
  if (chatResult) {
    console.log('✅ All tests passed! The Grok API integration is working correctly.');
  } else {
    console.log('❌ Tests failed. Please check your API key and connection.');
  }
}

// Execute the tests
runTests();