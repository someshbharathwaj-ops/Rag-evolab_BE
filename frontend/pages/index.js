import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user query to conversation history
    const newUserEntry = { type: 'user', content: query, timestamp: new Date().toLocaleTimeString() };
    setConversationHistory(prev => [...prev, newUserEntry]);
    
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
      
      // Add bot response to conversation history
      const newBotEntry = { type: 'bot', content: botResponse, timestamp: new Date().toLocaleTimeString() };
      setConversationHistory(prev => [...prev, newBotEntry]);
      
      setResponse(botResponse);
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = 'Error occurred while processing your query.';
      setResponse(errorResponse);
      
      // Add error response to conversation history
      const errorEntry = { type: 'error', content: errorResponse, timestamp: new Date().toLocaleTimeString() };
      setConversationHistory(prev => [...prev, errorEntry]);
    } finally {
      setIsLoading(false);
      setQuery(''); // Clear input after submission
    }
  };

  const clearHistory = () => {
    setConversationHistory([]);
    setResponse('');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>RAG Document Assistant</title>
        <meta name="description" content="RAG Application with Next.js frontend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>RAG Document Assistant</h1>
          <p className={styles.description}>Ask questions about your documents</p>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.chatContainer}>
            {/* Conversation History */}
            <div className={styles.conversationHistory}>
              {conversationHistory.length === 0 ? (
                <div className={styles.welcomeMessage}>
                  <p>Ask me anything about your documents!</p>
                  <p>I can help you find information and answer questions based on your uploaded content.</p>
                </div>
              ) : (
                conversationHistory.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`${styles.message} ${styles[entry.type]}`}
                  >
                    <div className={styles.messageHeader}>
                      <span className={styles.sender}>{entry.type === 'user' ? 'You' : 'Assistant'}</span>
                      <span className={styles.timestamp}>{entry.timestamp}</span>
                    </div>
                    <div className={styles.messageContent}>{entry.content}</div>
                  </div>
                ))
              )}
            </div>

            {/* Query Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about your documents..."
                className={styles.textarea}
                rows="3"
                disabled={isLoading}
              />
              <div className={styles.formActions}>
                <button type="submit" disabled={isLoading} className={styles.submitButton}>
                  {isLoading ? (
                    <span className={styles.loadingSpinner}></span>
                  ) : 'Send'}
                </button>
                <button 
                  type="button" 
                  onClick={clearHistory} 
                  className={styles.clearButton}
                  disabled={conversationHistory.length === 0}
                >
                  Clear Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>RAG Document Assistant &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}