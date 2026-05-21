import { useState } from 'react'

export default function UserForm({ user, onClose, onSave }) {
  const isEdit = !!user
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    designation: user?.designation || '',
    status: user?.status || 'Active',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [changePwd, setChangePwd] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.designation.trim()) errs.designation = 'Designation is required'

    const checkPwd = isEdit ? changePwd : true
    if (checkPwd) {
      if (!form.password) {
        errs.password = 'Password is required'
      } else {
        if (form.password.length < 8) errs.password = 'Minimum 8 characters required'
        else if (!/(?=.*[a-z])/.test(form.password)) errs.password = 'Must contain at least 1 lowercase character'
        else if (!/(?=.*[A-Z])/.test(form.password)) errs.password = 'Must contain at least 1 uppercase character'
        else if (!/(?=.*\d)/.test(form.password)) errs.password = 'Must contain at least 1 numeric character'
        else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(form.password)) errs.password = 'Must contain at least 1 symbol'

        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const { password, confirmPassword, ...rest } = form
    const data = isEdit && !changePwd ? { ...rest } : { ...rest, password }

    if (isEdit) {
      data.password = changePwd ? password : undefined
    }

    onSave(isEdit ? { ...data } : { ...rest, password })
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{isEdit ? 'Edit User' : 'Add User'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>First Name</label>
              <input
                style={styles.input}
                value={form.firstName}
                onChange={handleChange('firstName')}
                placeholder="First name"
              />
              {errors.firstName && <span style={styles.error}>{errors.firstName}</span>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Last Name</label>
              <input
                style={styles.input}
                value={form.lastName}
                onChange={handleChange('lastName')}
                placeholder="Last name"
              />
              {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              value={form.email}
              onChange={handleChange('email')}
              placeholder="Email"
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Designation</label>
            <input
              style={styles.input}
              value={form.designation}
              onChange={handleChange('designation')}
              placeholder="Designation"
            />
            {errors.designation && <span style={styles.error}>{errors.designation}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Status</label>
            <select style={styles.input} value={form.status} onChange={handleChange('status')}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {isEdit && (
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={changePwd}
                onChange={e => setChangePwd(e.target.checked)}
              />
              <span style={{ marginLeft: 8 }}>Change password</span>
            </label>
          )}

          {(!isEdit || changePwd) && (
            <>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Password</label>
                  <input
                    style={styles.input}
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    placeholder="Password"
                  />
                  {errors.password && <span style={styles.error}>{errors.password}</span>}
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    style={styles.input}
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
                </div>
              </div>
              <div style={styles.hint}>
                Password must be at least 8 characters with 1 lowercase, 1 uppercase, 1 number, and 1 symbol.
              </div>
            </>
          )}

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.saveBtn}>{isEdit ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    width: '520px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid var(--border)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
  },
  closeBtn: {
    background: 'none',
    color: 'var(--text-secondary)',
    fontSize: '24px',
    padding: '0 4px',
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    width: '100%',
  },
  error: {
    fontSize: '12px',
    color: 'var(--danger)',
  },
  hint: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer',
    color: 'var(--text-primary)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  saveBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: 'var(--accent)',
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
  },
}
