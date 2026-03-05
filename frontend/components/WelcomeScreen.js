import styles from '../styles/Home.module.css';

const starterPrompts = [
  'Summarize the core insights from the uploaded material.',
  'Compare the methods discussed in section 2 and section 4.',
  'Generate a concise implementation checklist from the docs.',
];

export default function WelcomeScreen({ onPromptSelect }) {
  return (
    <section className={styles.welcomeScreen}>
      <div className={styles.welcomeContent}>
        <p className={styles.kicker}>RAG-Enhanced Reasoning</p>
        <h2 className={styles.welcomeTitle}>Ask grounded questions. Get structured answers.</h2>
        <p className={styles.description}>
          This interface is optimized for retrieval-backed responses with markdown formatting,
          code rendering, and source-aware outputs.
        </p>

        <div className={styles.quickPrompts}>
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className={styles.promptCard}
              onClick={() => onPromptSelect(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
