const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
async function callGemini(messages, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try gemini-pro first (most stable model)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const systemPrompt = "You are Eventra's helpful AI assistant. You help users find events, book tickets, explore venues, and answer questions about event planning. Be concise, friendly, and professional. Always encourage users to explore our Eventra app for more details.";
  
  // Format conversation history
  const formattedMessages = messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');
  
  const fullPrompt = `${systemPrompt}\n\nConversation:\n${formattedMessages}\nAssistant:`;

  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  const text = response.text();
  
  if (!text || text.trim() === '') {
    throw new Error('Empty response from Gemini');
  }
  
  return text;
}

// Chat endpoint
exports.chat = async (req, res) => {
  try {
    const { messages = [] } = req.body;

    // Validate input
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required and must not be empty',
      });
    }

    const apiKey = (process.env.GOOGLE_GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Chat service is not configured',
        detail: 'GOOGLE_GEMINI_API_KEY is missing',
      });
    }

    try {
      // Try to call Gemini API
      const reply = await callGemini(messages, apiKey);

      res.json({
        success: true,
        message: reply,
      });
    } catch (apiError) {
      console.error('[Chat] API Error:', apiError.message);
      
      // Fallback to mock responses for demo/testing
      const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
      let mockResponse = getMockResponse(lastUserMessage);

      console.log('[Chat] Using fallback mock response');
      
      res.json({
        success: true,
        message: mockResponse,
      });
    }
  } catch (error) {
    console.error('[Chat] Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate response',
      detail: error.message || 'An error occurred while processing your request',
    });
  }
};

// Mock responses for fallback/demo
function getMockResponse(userMessage) {
  const responses = {
    'event': 'We have amazing events coming up! You can explore events by category, date, or location. Would you like to find events in a specific category?',
    'booking': 'To book event tickets, simply go to the Explore section, find the event you like, and click "Book Now". You can pay securely using Razorpay.',
    'venue': 'We have premium venues available for rent. You can browse all venues in the Venues section and contact organizers directly.',
    'price': 'Event prices vary based on the type and duration. You can view specific pricing on each event\'s detail page.',
    'refund': 'Refund policies depend on the event organizer. Check the event details or contact support for specific information.',
    'cancel': 'You can cancel your booking from your profile. Please check the cancellation policy of the specific event.',
    'help': 'I\'m here to help! You can ask me about events, bookings, venues, pricing, or anything related to Eventra.',
  };

  for (const [keyword, response] of Object.entries(responses)) {
    if (userMessage.includes(keyword)) {
      return response;
    }
  }

  return 'Thanks for your question! To get the best answer, please try asking about events, bookings, venues, pricing, or refunds. Or visit our Support page for more help.';
}

// Health check endpoint
exports.health = (req, res) => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  res.json({
    status: 'ok',
    chat: apiKey ? 'configured' : 'not configured',
  });
};
