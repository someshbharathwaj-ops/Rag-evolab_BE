import { useRef, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function ChatInput({ query, setQuery, handleSubmit, isLoading }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [query]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.inputArea}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputShell}>
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question about your indexed documents..."
            className={styles.textarea}
            rows="1"
            maxLength={4000}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={styles.sendButton}
            aria-label="Send message"
          >
            {isLoading ? <div className={styles.loadingSpinnerSmall}></div> : 'Send'}
          </button>
        </div>
        <p className={styles.inputHint}>Enter to send, Shift + Enter for a new line</p>
      </form>
    </div>
  );
}
