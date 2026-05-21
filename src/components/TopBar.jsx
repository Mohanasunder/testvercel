import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../App'

const pageTitles = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/users': 'Users',
  '/settings': 'Settings',
}

export default function TopBar({ sidebarOpen, onToggleSidebar, rightPanelOpen, onToggleRightPanel }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)

  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <header style={styles.topbar}>
      <div style={styles.left}>
        <span style={styles.breadcrumb}>{title}</span>
      </div>

      <div style={styles.right}>
        <button onClick={onToggleRightPanel} style={styles.panelBtn} title="Toggle panel">
          {rightPanelOpen ? '▶' : '◀'}
        </button>

        <div style={styles.profileWrapper}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={styles.profileBtn}
          >
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={styles.userName}>{user?.name}</span>
            <span style={styles.arrow}>{profileOpen ? '▲' : '▼'}</span>
          </button>

          {profileOpen && (
            <>
              <div style={styles.overlay} onClick={() => setProfileOpen(false)} />
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  <strong>{user?.name}</strong>
                  <span style={styles.dropdownEmail}>{user?.name}@consenz.com</span>
                </div>
                <div style={styles.dropdownDivider} />
                <button style={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                  Profile
                </button>
                <button style={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                  Settings
                </button>
                <div style={styles.dropdownDivider} />
                <button
                  style={{ ...styles.dropdownItem, color: 'var(--danger)' }}
                  onClick={() => { setProfileOpen(false); logout() }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

const styles = {
  topbar: {
    height: 'var(--topbar-height)',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    flexShrink: 0,
    zIndex: 101,
    position: 'relative'
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  breadcrumb: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'var(--text-primary)'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  panelBtn: {
    background: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    border: '1px solid var(--border)'
  },
  profileWrapper: {
    position: 'relative'
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    color: 'var(--text-primary)',
    padding: '4px 8px',
    borderRadius: '8px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '14px'
  },
  userName: {
    fontSize: '14px'
  },
  arrow: {
    fontSize: '10px',
    color: 'var(--text-secondary)'
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 200
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    minWidth: '200px',
    zIndex: 201,
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
  },
  dropdownHeader: {
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  dropdownEmail: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'var(--border)',
    margin: '4px 0'
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 16px',
    background: 'none',
    color: 'var(--text-primary)',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  }
}
