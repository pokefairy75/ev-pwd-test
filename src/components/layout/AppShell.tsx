import { Link, NavLink, Outlet } from 'react-router-dom'
import { CircleHelp, House, MapPin, Settings } from 'lucide-react'

const navigation = [
  { to: '/', label: 'ホーム', Icon: House, end: true },
  { to: '/map', label: '地図メモ', Icon: MapPin, end: false },
  { to: '/settings', label: '設定', Icon: Settings, end: false },
]

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Personal ホーム">
          <span className="brand-mark"><MapPin size={19} strokeWidth={2.4} /></span>
          <span>Personal<span className="brand-period">.</span></span>
        </Link>
        <Link className="about-link" to="/about" aria-label="アプリについて">
          <CircleHelp size={19} />
        </Link>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="メインナビゲーション">
        {navigation.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}>
            <Icon size={20} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
