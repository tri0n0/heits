import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chatbot.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = ({ onCreatePost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const genAI = new GoogleGenerativeAI('AIzaSyB8J8CQgiHm9-LlzmyPSG7sJ56wgS2qBds');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        text: "🕉 Hi! I'm Devi, your personal assistant. I can help you create posts, find information, or answer any questions you have!",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.chatbot-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const createAutomatedPost = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(
        "Create an engaging Reddit-style post about a random interesting topic. Include both title and content. Do not use asterisks or markdown formatting."
      );
      const response = await result.response;
      const generatedPost = response.text().replace(/\*/g, '');
      
      const postContent = {
        title: generatedPost.split('\n')[0].trim(),
        content: generatedPost.split('\n').slice(1).join('\n').trim(),
        type: 'text'
      };
      
      onCreatePost(postContent);
      
      const botMessage = {
        text: "I've created a new post for you! You can find it in your feed. Would you like me to create another one?",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error creating automated post:', error);
      const errorMessage = {
        text: "I apologize, but I encountered an error while creating the post. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      if (inputText.toLowerCase().includes('create automated post') || 
          inputText.toLowerCase().includes('generate post automatically')) {
        await createAutomatedPost();
        return;
      }
      
      if (inputText.toLowerCase().includes('create post') || 
          inputText.toLowerCase().includes('make post')) {
        const result = await model.generateContent(
          `Create a Reddit-style post based on this request: ${inputText}. Do not use asterisks or markdown formatting.`
        );
        const response = await result.response;
        const generatedPost = response.text().replace(/\*/g, '');
        
        const postContent = {
          title: generatedPost.split('\n')[0].trim(),
          content: generatedPost.split('\n').slice(1).join('\n').trim(),
          type: 'text'
        };
        
        onCreatePost(postContent);
      }

      const result = await model.generateContent(inputText);
      const response = await result.response;
      
      const botMessage = {
        text: response.text().replace(/\*/g, ''),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        text: "🙏 I apologize, but I'm having trouble processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <div className="bot-avatar">
            <span>D</span>
          </div>
        )}
      </button>
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="bot-avatar">
              <span>D</span>
            </div>
            <div className="header-info">
              <h3>Devi</h3>
              <p>{isLoading ? 'Typing...' : 'Online'}</p>
            </div>
          </div>
          
          <div className="chatbot-messages" ref={messagesEndRef}>
            <div className="messages-container">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message-wrapper ${message.sender}`}
                >
                  {message.sender === 'bot' && (
                    <div className="bot-avatar small">
                      <span>D</span>
                    </div>
                  )}
                  <div className="message-bubble">
                    <div className="message-content">
                      {message.text}
                    </div>
                    <div className="message-timestamp">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message-wrapper bot">
                  <div className="bot-avatar small">
                    <span>D</span>
                  </div>
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message Devi..."
            />
            <button 
              onClick={handleSend}
              className="send-button"
              disabled={!inputText.trim()}
            >
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M20.5 3.4L3.4 10.4c-.1.1-.2.2-.2.3 0 .2.1.3.3.3l7.9 1.7 1.7 7.9c0 .2.2.3.3.3.1 0 .2-.1.3-.2l7-17.1c.1-.1 0-.3-.2-.2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
