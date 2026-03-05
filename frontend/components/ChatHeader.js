import styles from '../styles/Home.module.css';

export default function ChatHeader({ sidebarOpen, setSidebarOpen, currentTitle }) {
  return (
    <header className={styles.header}>
      <button
        className={styles.menuButton}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={styles.headerSection}>
        <div className={styles.logoContainer}>R</div>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>RAG Command Interface</h1>
          <p className={styles.subtitle}>{currentTitle}</p>
        </div>
      </div>

      <div className={styles.headerBadge}>Retriever + LLM</div>
    </header>
  );
}
