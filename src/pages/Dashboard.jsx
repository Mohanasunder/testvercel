export default function Dashboard() {
  const cards = [
    { title: 'Total Users', value: '2,847', change: '+12%', color: 'var(--accent)' },
    { title: 'Active Sessions', value: '1,423', change: '+8%', color: 'var(--success)' },
    { title: 'Revenue', value: '$48,290', change: '+23%', color: '#ffa726' },
    { title: 'Pending Tasks', value: '47', change: '-5%', color: 'var(--danger)' }
  ]

  return (
    <div>
      <h2 style={styles.pageTitle}>Dashboard</h2>

      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.title} style={styles.card}>
            <span style={styles.cardLabel}>{card.title}</span>
            <div style={styles.cardValue}>{card.value}</div>
            <span style={{ ...styles.cardChange, color: card.color }}>
              {card.change} this month
            </span>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recent Activity</h3>
        <div style={styles.activityList}>
          {[
            'New user registered',
            'Report generated for Q2',
            'System update completed',
            'User permissions updated',
            'New project created'
          ].map((item, i) => (
            <div key={i} style={styles.activityItem}>
              <div style={styles.activityDot} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  pageTitle: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid var(--border)'
  },
  cardLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)'
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 700,
    margin: '8px 0'
  },
  cardChange: {
    fontSize: '12px',
    fontWeight: 500
  },
  section: {
    backgroundColor: 'var(--bg-secondary)',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid var(--border)'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px'
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: 'var(--text-primary)'
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    flexShrink: 0
  }
}
