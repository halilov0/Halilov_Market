import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function Layout() {
  return (
    <div className="adm">
      <Sidebar />
      <div className="adm-main">
        <TopBar />
        <div className="adm-page">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
