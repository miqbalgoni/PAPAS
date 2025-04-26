/**
 * Test script to verify OpenAI API integration
 */
require('dotenv').config();
const OpenAI = require('openai');

// Check if OPENAI_API_KEY is available
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test a simple chat completion
async function testChat() {
  try {
    console.log('Testing OpenAI chat completion...');
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
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

    console.log('\nResponse from OpenAI:\n');
    console.log(response.choices[0].message.content);
    console.log('\nModel used:', response.model);
    console.log('Test completed successfully!\n');
    return true;
  } catch (error) {
    console.error('Error testing OpenAI API:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  const chatResult = await testChat();
  
  if (chatResult) {
    console.log('✅ All tests passed! The OpenAI API integration is working correctly.');
  } else {
    console.log('❌ Tests failed. Please check your API key and connection.');
  }
}

// Execute the tests
runTests();