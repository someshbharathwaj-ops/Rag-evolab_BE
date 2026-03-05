import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className={styles.codeBlockWrap}>
      <div className={styles.codeBlockHeader}>
        <span>{language || 'code'}</span>
        <button type="button" onClick={copyCode} className={styles.copyButton}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles.codeBlock}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
