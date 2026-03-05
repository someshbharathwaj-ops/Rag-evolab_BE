import MarkdownRenderer from './MarkdownRenderer';
import { extractSources } from '../utils/chatFormat';
import styles from '../styles/Home.module.css';

export default function Message({ message, formatDate, isStreaming }) {
  const sources = extractSources(message.content || '');

  return (
    <article className={`${styles.message} ${styles[message.type]}`}>
      <div className={styles.messageHeader}>
        <span className={styles.sender}>{message.type === 'user' ? 'You' : 'Assistant'}</span>
        {message.timestamp && <span className={styles.timestamp}>{formatDate(message.timestamp)}</span>}
      </div>

      <div className={styles.messageContent}>
        <MarkdownRenderer content={message.content || ''} />
        {isStreaming && <span className={styles.streamingCursor} />}
      </div>

      {sources.length > 0 && message.type === 'assistant' && (
        <details className={styles.citations}>
          <summary className={styles.citationsToggle}>Sources ({sources.length})</summary>
          <ul className={styles.citationsList}>
            {sources.map((source, index) => (
              <li key={source.url} className={styles.citationsItem}>
                <span>[{index + 1}]</span>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}
