import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '../components/ThemeToggle';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversations from localStorage on component mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      if (parsed.length > 0) {
        setActiveChatId(parsed[0].id);
      }
    } else {
      // Create initial chat if no conversations exist
      const initialChat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
      };
      setConversations([initialChat]);
      setActiveChatId(initialChat.id);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeChatId, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setConversations(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
  };

  const deleteChat = (chatId) => {
    const updatedConversations = conversations.filter(chat => chat.id !== chatId);
    setConversations(updatedConversations);
    
    if (activeChatId === chatId && updatedConversations.length > 0) {
      setActiveChatId(updatedConversations[0].id);
    } else if (updatedConversations.length === 0) {
      const initialChat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
      };
      setConversations([initialChat]);
      setActiveChatId(initialChat.id);
    }
  };

  const getCurrentChat = () => {
    return conversations.find(chat => chat.id === activeChatId);
  };

  const updateChatTitle = (chatId, title) => {
    setConversations(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, title } : chat
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const currentChat = getCurrentChat();
    if (!currentChat) return;

    // Add user query to conversation
    const newUserMessage = { 
      id: Date.now().toString(), 
      type: 'user', 
      content: query, 
      timestamp: new Date().toISOString() 
    };
    
    // Update the chat with the new message
    const updatedMessages = [...currentChat.messages, newUserMessage];
    const updatedChat = { ...currentChat, messages: updatedMessages };
    
    setConversations(prev => 
      prev.map(chat => chat.id === activeChatId ? updatedChat : chat)
    );

    setIsLoading(true);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      const botResponse = data.response || 'No response received';
      
      // Add bot response to conversation
      const newBotMessage = { 
        id: Date.now().toString(), 
        type: 'assistant', 
        content: botResponse, 
        timestamp: new Date().toISOString() 
      };

      const finalMessages = [...updatedMessages, newBotMessage];
      const finalChat = { 
        ...updatedChat, 
        messages: finalMessages,
        title: updatedChat.title === 'New Chat' ? query.substring(0, 30) + (query.length > 30 ? '...' : '') : updatedChat.title
      };
      
      setConversations(prev => 
        prev.map(chat => chat.id === activeChatId ? finalChat : chat)
      );
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = 'Error occurred while processing your query.';
      
      // Add error response to conversation
      const errorBotMessage = { 
        id: Date.now().toString(), 
        type: 'error', 
        content: errorResponse, 
        timestamp: new Date().toISOString() 
      };

      const finalMessages = [...updatedMessages, errorBotMessage];
      const finalChat = { 
        ...updatedChat, 
        messages: finalMessages,
        title: updatedChat.title === 'New Chat' ? query.substring(0, 30) + (query.length > 30 ? '...' : '') : updatedChat.title
      };
      
      setConversations(prev => 
        prev.map(chat => chat.id === activeChatId ? finalChat : chat)
      );
    } finally {
      setIsLoading(false);
      setQuery(''); // Clear input after submission
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentChat = getCurrentChat();

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className={styles.container}>
        <Head>
          <title>RAG Document Assistant</title>
          <meta name="description" content="Professional RAG System for Document Analysis" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Sidebar for chat history */}
        <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <button onClick={createNewChat} className={styles.newChatButton}>
              + New Chat
            </button>
          </div>
          <div className={styles.sidebarContent}>
            {conversations.map(chat => (
              <div 
                key={chat.id} 
                className={`${styles.chatItem} ${activeChatId === chat.id ? styles.activeChat : ''}`}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setSidebarOpen(false);
                }}
              >
                <div className={styles.chatItemContent}>
                  <div className={styles.chatTitle}>{chat.title}</div>
                  <div className={styles.chatDate}>{formatDate(chat.createdAt)}</div>
                </div>
                <button 
                  className={styles.deleteChatButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  aria-label="Delete chat"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <button 
              className={styles.menuButton}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <div className={styles.headerSection}>
              <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>📚</div>
              </div>
              <h1 className={styles.title}>RAG Document Assistant</h1>
            </div>
            <div className={styles.themeToggleContainer}>
              <ThemeToggle />
            </div>
          </div>

          <div className={styles.chatArea}>
            {currentChat && currentChat.messages.length > 0 ? (
              <div className={styles.messagesContainer}>
                {currentChat.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`${styles.message} ${styles[message.type]}`}
                  >
                    <div className={styles.messageHeader}>
                      <span className={styles.sender}>{message.type === 'user' ? 'You' : 'Assistant'}</span>
                      <span className={styles.timestamp}>{formatDate(message.timestamp)}</span>
                    </div>
                    <div className={styles.messageContent}>{message.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles.message} ${styles.assistant}`}>
                    <div className={styles.messageHeader}>
                      <span className={styles.sender}>Assistant</span>
                    </div>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className={styles.welcomeScreen}>
                <div className={styles.welcomeContent}>
                  <div className={styles.logoContainerLarge}>
                    <div className={styles.logoIcon}>📚</div>
                  </div>
                  <h1 className={styles.title}>RAG Document Assistant</h1>
                  <p className={styles.description}>
                    Advanced Retrieval-Augmented Generation for intelligent document analysis and Q&A
                  </p>
                  <div className={styles.quickPrompts}>
                    <div className={styles.promptCard}>
                      <h3>🔍 Summarize Key Points</h3>
                      <p>Summarize the main findings from the research papers</p>
                    </div>
                    <div className={styles.promptCard}>
                      <h3>🤖 Compare Models</h3>
                      <p>Compare the different models discussed in the documents</p>
                    </div>
                    <div className={styles.promptCard}>
                      <h3>💡 Technical Details</h3>
                      <p>Explain the technical methodologies used</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Input area */}
            <div className={styles.inputArea}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Message RAG Document Assistant..."
                  className={styles.textarea}
                  rows="1"
                  disabled={isLoading}
                  maxLength={2000}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className={styles.inputIcons}>
                  <button 
                    type="button" 
                    className={styles.iconButton}
                    disabled
                    aria-label="Attach file"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 14C21 16.7614 18.7614 19 16 19H8C5.23858 19 3 16.7614 3 14V6C3 3.23858 5.23858 1 8 1H12.5858C13.8169 1 14.9992 1.48046 15.8787 2.35996L19.6401 6.12132C20.5196 6.99996 21 8.18303 21 9.41421V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18 6H15C13.8954 6 13 6.89543 13 8V16C13 17.1046 13.8954 18 15 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className={styles.iconButton}
                    disabled
                    aria-label="Voice input"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16C14.2091 16 16 14.2091 16 12V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 10V12C4 15.3137 6.68629 18 10 18H14C17.3137 18 20 15.3137 20 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 22H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading || !query.trim()} 
                  className={styles.sendButton}
                >
                  {isLoading ? (
                    <div className={styles.loadingSpinnerSmall}></div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}