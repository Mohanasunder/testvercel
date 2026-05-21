import { useState } from 'react'

export default function RightPanel({ open, onToggle }) {
  const [activeTab, setActiveTab] = useState('notifications')

  return (
    <aside style={{
      ...styles.panel,
      width: open ? 'var(--right-panel-width)' : '0',
      padding: open ? '16px' : '0',
      borderLeft: open ? '1px solid var(--border)' : 'none'
    }}>
      {open && (
        <>
          <div style={styles.header}>
            <span style={styles.headerTitle}>Panel</span>
            <button onClick={onToggle} style={styles.closeBtn}>✕</button>
          </div>
          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                borderBottom: activeTab === 'notifications' ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === 'notifications' ? 'var(--accent)' : 'var(--text-secondary)'
              }}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button
              style={{
                ...styles.tab,
                borderBottom: activeTab === 'activity' ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === 'activity' ? 'var(--accent)' : 'var(--text-secondary)'
              }}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </div>

          <div style={styles.content}>
            {activeTab === 'notifications' && (
              <div style={styles.emptyState}>No new notifications</div>
            )}
            {activeTab === 'activity' && (
              <div style={styles.emptyState}>No recent activity</div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}

const styles = {
  panel: {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    zIndex: 100,
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  closeBtn: {
    background: 'none',
    color: 'var(--text-secondary)',
    fontSize: '16px',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  tabs: {
    display: 'flex',
    gap: '0',
    borderBottom: '1px solid var(--border)',
    marginBottom: '16px'
  },
  tab: {
    flex: 1,
    padding: '12px 8px',
    background: 'none',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'color 0.2s'
  },
  content: {
    flex: 1,
    overflow: 'auto'
  },
  emptyState: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    padding: '40px 16px',
    fontSize: '14px'
  }
}
