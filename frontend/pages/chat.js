import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';
import WelcomeScreen from '../components/WelcomeScreen';
import { extractSources } from '../utils/chatFormat';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      if (parsed.length > 0) {
        setActiveChatId(parsed[0].id);
      }
    } else {
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

  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeChatId, isLoading, streamingMessageId]);

  const scrollToBottom = () => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const updateChatById = (chatId, updater) => {
    setConversations((prev) =>
      prev.map((chat) => (chat.id === chatId ? updater(chat) : chat))
    );
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

  const createTitleFromQuery = (text) => {
    if (text.length <= 36) return text;
    return `${text.substring(0, 36)}...`;
  };

  const streamAssistantMessage = async (chatId, messageId, fullText) => {
    setStreamingMessageId(messageId);
    const step = Math.max(2, Math.ceil(fullText.length / 140));

    for (let index = 0; index <= fullText.length; index += step) {
      const nextChunk = fullText.slice(0, index);
      updateChatById(chatId, (chat) => ({
        ...chat,
        messages: chat.messages.map((message) =>
          message.id === messageId ? { ...message, content: nextChunk } : message
        ),
      }));
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 12));
    }

    updateChatById(chatId, (chat) => ({
      ...chat,
      messages: chat.messages.map((message) =>
        message.id === messageId ? { ...message, content: fullText } : message
      ),
    }));
    setStreamingMessageId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const question = query.trim();
    const chatId = activeChatId;
    const currentChat = conversations.find((chat) => chat.id === chatId);
    if (!currentChat) return;

    const newUserMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...currentChat.messages, newUserMessage];
    const updatedChat = {
      ...currentChat,
      messages: updatedMessages,
      title: currentChat.title === 'New Chat' ? createTitleFromQuery(question) : currentChat.title,
    };

    setQuery('');
    updateChatById(chatId, () => updatedChat);

    setIsLoading(true);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: question }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || data?.error || `Request failed with status ${res.status}`);
      }
      const botResponse = data.response || 'No response received';

      const assistantMessageId = `${Date.now().toString()}-assistant`;
      const newBotMessage = {
        id: assistantMessageId,
        type: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      };

      updateChatById(chatId, (chat) => ({
        ...chat,
        messages: [...chat.messages, newBotMessage],
      }));
      setIsLoading(false);
      await streamAssistantMessage(chatId, assistantMessageId, botResponse);
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = error?.message || 'Error occurred while processing your query.';
      const errorMessageId = `${Date.now().toString()}-error`;
      const errorBotMessage = {
        id: errorMessageId,
        type: 'error',
        content: '',
        timestamp: new Date().toISOString()
      };

      updateChatById(chatId, (chat) => ({
        ...chat,
        messages: [...chat.messages, errorBotMessage],
      }));
      setIsLoading(false);
      await streamAssistantMessage(chatId, errorMessageId, errorResponse);
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentChat = getCurrentChat();
  const latestAssistantMessage = [...(currentChat?.messages || [])]
    .reverse()
    .find((message) => message.type === 'assistant');
  const latestSources = extractSources(latestAssistantMessage?.content || '');

  return (
    <div className={styles.container}>
      <Head>
        <title>RAG Command Interface</title>
        <meta name="description" content="Futuristic RAG and LLM chat interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        conversations={conversations}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        formatDate={formatDate}
      />

      <div className={styles.mainContent}>
        <ChatHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentTitle={currentChat?.title || 'RAG Command Interface'}
        />

        <div className={styles.chatGrid}>
          <main className={styles.chatArea}>
            {currentChat && currentChat.messages.length > 0 ? (
              <div className={styles.messagesContainer} ref={messagesContainerRef}>
                {currentChat.messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    formatDate={formatDate}
                    isStreaming={streamingMessageId === message.id}
                  />
                ))}
                {isLoading && !streamingMessageId && (
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
              </div>
            ) : (
              <WelcomeScreen onPromptSelect={setQuery} />
            )}

            <ChatInput
              query={query}
              setQuery={setQuery}
              handleSubmit={handleSubmit}
              isLoading={isLoading || Boolean(streamingMessageId)}
            />
          </main>

          <aside className={styles.sourcesPanel}>
            <div className={styles.sourcesHeader}>Latest Sources</div>
            {latestSources.length > 0 ? (
              <ul className={styles.sourcesList}>
                {latestSources.map((source, index) => (
                  <li key={source.url} className={styles.sourceItem}>
                    <span className={styles.sourceIndex}>[{index + 1}]</span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.sourceLink}
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.sourcesEmpty}>
                No citation links detected yet in the latest assistant response.
              </p>
            )}
          </aside>

          {sidebarOpen && (
            <button
              type="button"
              className={styles.sidebarBackdrop}
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className={styles.chatAmbientGlow}></div>
          <div className={styles.chatAmbientGlowSecondary}></div>
        </div>
      </div>
    </div>
  );
}
