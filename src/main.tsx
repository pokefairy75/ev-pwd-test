import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './styles.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('アプリのルート要素が見つかりません。')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
    scope: import.meta.env.BASE_URL,
  }).catch((cause: unknown) => {
    console.error('Service Workerを登録できませんでした。', cause)
  })
}
