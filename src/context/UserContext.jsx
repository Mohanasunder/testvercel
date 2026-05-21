import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const UserContext = createContext()

export function useUsers() {
  return useContext(UserContext)
}

const initialUsers = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', designation: 'Developer', status: 'Active' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', designation: 'Designer', status: 'Active' },
  { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', designation: 'Manager', status: 'Inactive' },
  { id: 4, firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', designation: 'Analyst', status: 'Active' },
  { id: 5, firstName: 'Alex', lastName: 'Brown', email: 'alex@example.com', designation: 'Developer', status: 'Active' },
  { id: 6, firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com', designation: 'Designer', status: 'Inactive' },
  { id: 7, firstName: 'Chris', lastName: 'Wilson', email: 'chris@example.com', designation: 'Manager', status: 'Active' },
  { id: 8, firstName: 'Lisa', lastName: 'Taylor', email: 'lisa@example.com', designation: 'Analyst', status: 'Active' },
  { id: 9, firstName: 'David', lastName: 'Anderson', email: 'david@example.com', designation: 'Developer', status: 'Active' },
  { id: 10, firstName: 'Emma', lastName: 'Thomas', email: 'emma@example.com', designation: 'Designer', status: 'Active' },
  { id: 11, firstName: 'James', lastName: 'Jackson', email: 'james@example.com', designation: 'Manager', status: 'Inactive' },
  { id: 12, firstName: 'Olivia', lastName: 'White', email: 'olivia@example.com', designation: 'Analyst', status: 'Active' },
  { id: 13, firstName: 'Robert', lastName: 'Harris', email: 'robert@example.com', designation: 'Developer', status: 'Active' },
  { id: 14, firstName: 'Sophia', lastName: 'Martin', email: 'sophia@example.com', designation: 'Designer', status: 'Inactive' },
  { id: 15, firstName: 'William', lastName: 'Garcia', email: 'william@example.com', designation: 'Manager', status: 'Active' },
]

export default function UserProvider({ children }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('firstName')
  const [sortDir, setSortDir] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const addUser = useCallback((user) => {
    setUsers(prev => [...prev, { ...user, id: Date.now() }])
  }, [])

  const updateUser = useCallback((id, data) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u))
  }, [])

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }, [])

  const filtered = useMemo(() => {
    let result = [...users]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(u =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.designation.toLowerCase().includes(q)
      )
    }
    if (statusFilter) {
      result = result.filter(u => u.status === statusFilter)
    }
    result.sort((a, b) => {
      const aVal = (a[sortField] || '').toString().toLowerCase()
      const bVal = (b[sortField] || '').toString().toLowerCase()
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    return result
  }, [users, search, sortField, sortDir, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const safePage = Math.min(page, totalPages)
  const safePaginated = safePage !== page
    ? filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
    : paginated

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const value = useMemo(() => ({
    users: safePaginated,
    totalUsers: filtered.length,
    totalPages,
    page: safePage,
    setPage,
    search,
    setSearch: (v) => { setSearch(v); setPage(1) },
    sortField,
    sortDir,
    toggleSort,
    statusFilter,
    setStatusFilter: (v) => { setStatusFilter(v); setPage(1) },
    addUser,
    updateUser,
    deleteUser,
    pageSize,
  }), [safePaginated, filtered.length, totalPages, safePage, search, sortField, sortDir, statusFilter, addUser, updateUser, deleteUser, pageSize])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
