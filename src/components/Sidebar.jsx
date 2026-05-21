import { NavLink, useLocation } from 'react-router-dom'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
  { path: '/reports', label: 'Reports', icon: '📋' },
  { path: '/users', label: 'Users', icon: '👥' },
  { path: '/settings', label: 'Settings', icon: '⚙️' }
]

export default function Sidebar({ open, onToggle }) {
  const location = useLocation()

  return (
    <aside style={{
      ...styles.sidebar,
      width: open ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)'
    }}>
      <div style={styles.logoSection}>
        {open ? (
          <span style={styles.logoText}>Consenz</span>
        ) : (
          <span style={styles.logoIcon}>C</span>
        )}
        <button onClick={onToggle} style={styles.toggleBtn}>
          {open ? '◀' : '▶'}
        </button>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.menuItem,
              backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
              justifyContent: open ? 'flex-start' : 'center'
            })}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            {open && <span style={styles.menuLabel}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    zIndex: 100,
    overflow: 'hidden'
  },
  logoSection: {
    height: 'var(--topbar-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    borderBottom: '1px solid var(--border)'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--accent)',
    whiteSpace: 'nowrap'
  },
  logoIcon: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--accent)'
  },
  toggleBtn: {
    background: 'none',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    padding: '4px',
    border: '1px solid var(--border)',
    borderRadius: '4px'
  },
  nav: {
    flex: 1,
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    transition: 'background-color 0.2s',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    minHeight: '40px'
  },
  menuIcon: {
    fontSize: '18px',
    flexShrink: 0,
    width: '24px',
    textAlign: 'center'
  },
  menuLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}
