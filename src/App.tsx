import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import HomePage from './pages/HomePage'
import ToolPage from './pages/ToolPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tools/:slug" element={<ToolPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
