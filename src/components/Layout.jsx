import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import RightPanel from './RightPanel'
import Dashboard from '../pages/Dashboard'
import Users from '../pages/Users'
import UserProvider from '../context/UserContext'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

  return (
    <div style={styles.container}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{
        ...styles.main,
        marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)'
      }}>
        <TopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          rightPanelOpen={rightPanelOpen}
          onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        />

        <div style={{
          ...styles.content,
          marginRight: rightPanelOpen ? 'var(--right-panel-width)' : '0'
        }}>
          <UserProvider>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </UserProvider>
        </div>
      </div>

      <RightPanel open={rightPanelOpen} onToggle={() => setRightPanelOpen(!rightPanelOpen)} />
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    transition: 'margin-left 0.3s ease',
    minWidth: 0
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
    transition: 'margin-right 0.3s ease'
  }
}
