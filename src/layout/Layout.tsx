import { Link, Outlet } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-mark">QA</span>
          <span className="brand-name">Набір інструментів</span>
        </Link>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>
          Набір інструментів для тест-дизайну та QA. Усі дані
          обробляються локально у вашому браузері — нічого не надсилається на
          сервер.
        </p>
      </footer>
    </div>
  )
}
