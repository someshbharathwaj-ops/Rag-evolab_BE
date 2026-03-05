import styles from '../styles/Home.module.css';

export default function Sidebar({
  isOpen,
  setIsOpen,
  conversations,
  activeChatId,
  setActiveChatId,
  createNewChat,
  deleteChat,
  formatDate,
}) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        <div>
          <p className={styles.sidebarEyebrow}>Workspace</p>
          <h2 className={styles.sidebarTitle}>Chat Threads</h2>
        </div>
        <button onClick={createNewChat} className={styles.newChatButton}>
          + New
        </button>
      </div>

      <div className={styles.sidebarContent}>
        {conversations.map((chat) => (
          <div
            key={chat.id}
            className={`${styles.chatItem} ${activeChatId === chat.id ? styles.activeChat : ''}`}
            onClick={() => {
              setActiveChatId(chat.id);
              setIsOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveChatId(chat.id);
                setIsOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className={styles.chatItemContent}>
              <span className={styles.chatTitle} title={chat.title}>
                {chat.title}
              </span>
              <span className={styles.chatDate}>{formatDate(chat.createdAt)}</span>
            </div>
            <button
              type="button"
              className={styles.deleteChatButton}
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              aria-label="Delete chat"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
