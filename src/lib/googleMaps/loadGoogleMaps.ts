let mapsPromise: Promise<void> | undefined
let mapsApiKey: string | undefined

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (window.google?.maps) {
    return mapsApiKey === apiKey
      ? Promise.resolve()
      : Promise.reject(new Error('APIキーを変更した場合は、ページを再読み込みして地図を再表示してください。'))
  }
  if (mapsPromise) {
    return mapsApiKey === apiKey
      ? mapsPromise
      : Promise.reject(new Error('APIキーを変更した場合は、ページを再読み込みして地図を再表示してください。'))
  }
  if (!apiKey) return Promise.reject(new Error('Google Maps APIキーが設定されていません。'))

  mapsApiKey = apiKey
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
      mapsApiKey = undefined
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
