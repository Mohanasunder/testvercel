import { useState } from 'react'
import { useUsers } from '../context/UserContext'
import UserForm from '../components/UserForm'

export default function Users() {
  const {
    users, totalUsers, totalPages, page, setPage,
    search, setSearch,
    sortField, sortDir, toggleSort,
    statusFilter, setStatusFilter,
    addUser, updateUser, deleteUser,
  } = useUsers()

  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleSave = (data) => {
    if (editingUser) {
      updateUser(editingUser.id, data)
    } else {
      addUser(data)
    }
    setShowForm(false)
    setEditingUser(null)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    deleteUser(id)
    setConfirmDelete(null)
  }

  const sortIcon = (field) => {
    if (sortField !== field) return ' \u21C5'
    return sortDir === 'asc' ? ' \u2191' : ' \u2193'
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Users</h2>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>+ Add User</button>
      </div>

      <div style={styles.toolbar}>
        <input
          style={styles.searchInput}
          placeholder="Search by name, email or designation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          style={styles.filterSelect}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => toggleSort('firstName')}>
                Name{sortIcon('firstName')}
              </th>
              <th style={styles.th} onClick={() => toggleSort('email')}>
                Email{sortIcon('email')}
              </th>
              <th style={styles.th} onClick={() => toggleSort('designation')}>
                Designation{sortIcon('designation')}
              </th>
              <th style={styles.th} onClick={() => toggleSort('status')}>
                Status{sortIcon('status')}
              </th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.empty}>No users found</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.firstName} {u.lastName}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.designation}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: u.status === 'Active'
                        ? 'rgba(102,187,106,0.15)'
                        : 'rgba(239,83,80,0.15)',
                      color: u.status === 'Active' ? 'var(--success)' : 'var(--danger)',
                    }}>{u.status}</span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleEdit(u)} style={styles.actionBtn}>Edit</button>
                    <button
                      onClick={() => setConfirmDelete(u.id)}
                      style={{ ...styles.actionBtn, color: 'var(--danger)' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <span style={styles.pageInfo}>
          Showing {users.length} of {totalUsers} user{totalUsers !== 1 ? 's' : ''}
        </span>
        <div style={styles.pageBtns}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{ ...styles.pageBtn, opacity: page <= 1 ? 0.4 : 1 }}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                ...styles.pageBtn,
                backgroundColor: page === i + 1 ? 'var(--accent)' : 'transparent',
                color: page === i + 1 ? '#000' : 'var(--text-primary)',
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            style={{ ...styles.pageBtn, opacity: page >= totalPages ? 0.4 : 1 }}
          >
            Next
          </button>
        </div>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => { setShowForm(false); setEditingUser(null) }}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <div style={styles.overlay} onClick={() => setConfirmDelete(null)}>
          <div style={styles.confirmBox} onClick={e => e.stopPropagation()}>
            <p style={{ marginBottom: 20 }}>Are you sure you want to delete this user?</p>
            <div style={styles.confirmActions}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 600,
  },
  addBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: 'var(--accent)',
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
  },
  toolbar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    minWidth: '130px',
  },
  tableWrap: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: 'var(--text-primary)',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
  },
  actionBtn: {
    background: 'none',
    color: 'var(--accent)',
    fontSize: '13px',
    fontWeight: 500,
    marginRight: '12px',
    padding: '4px 0',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 16px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '16px',
  },
  pageInfo: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  pageBtns: {
    display: 'flex',
    gap: '4px',
  },
  pageBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '13px',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  confirmBox: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    padding: '24px',
    maxWidth: '400px',
    width: '90vw',
  },
  confirmActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  deleteBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: 'var(--danger)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
  },
}
