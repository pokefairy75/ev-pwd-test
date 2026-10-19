import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { MapMemoDetailPage } from '../features/mapMemo/pages/MapMemoDetailPage'
import { MapMemoPage } from '../features/mapMemo/pages/MapMemoPage'
import { AboutPage } from '../pages/AboutPage'
import { HomePage } from '../pages/HomePage'
import { SettingsPage } from '../pages/SettingsPage'

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="map" element={<MapMemoPage />} />
          <Route path="map/:id" element={<MapMemoDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
