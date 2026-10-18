const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
let mapsPromise: Promise<void> | undefined

export function isGoogleMapsConfigured(): boolean {
  return Boolean(apiKey)
}

export function loadGoogleMaps(): Promise<void> {
  if (!apiKey) return Promise.reject(new Error('Google Maps APIキーが設定されていません。'))
  if (window.google?.maps) return Promise.resolve()
  if (mapsPromise) return mapsPromise

  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const callbackName = '__personalPwaGoogleMapsReady'
    const callback = () => {
      delete window.__personalPwaGoogleMapsReady
      resolve()
    }
    window.__personalPwaGoogleMapsReady = callback
    window.gm_authFailure = () => {
      window.dispatchEvent(new Event('personal-pwa-maps-auth-error'))
    }
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${callbackName}&v=weekly`
    script.async = true
    script.onerror = () => {
      delete window.__personalPwaGoogleMapsReady
      mapsPromise = undefined
      reject(new Error('地図を読み込めませんでした。ネットワークとAPIキーの設定を確認してください。'))
    }
    document.head.append(script)
  })

  return mapsPromise
}

declare global {
  interface Window {
    __personalPwaGoogleMapsReady?: () => void
    gm_authFailure?: () => void
  }
}
