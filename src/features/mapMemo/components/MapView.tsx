import { useEffect, useRef, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { loadGoogleMaps } from '../../../lib/googleMaps/loadGoogleMaps'
import { googleMapsSettingsRepository } from '../../../lib/googleMaps/googleMapsSettingsRepository'
import type { MapMemo } from '../types/mapMemo'

type Position = { latitude: number; longitude: number }
type MapViewProps = {
  memos: MapMemo[]
  center: Position
  onSelectMemo: (id: string) => void
  onChoosePosition: (position: Position) => void
}

export function MapView({ memos, center, onSelectMemo, onChoosePosition }: MapViewProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [googleMapsConfigured, setGoogleMapsConfigured] = useState(false)

  useEffect(() => {
    let active = true
    const handleAuthError = () => setLoadError('Google Maps APIキーを認証できませんでした。キーの制限と有効化設定を確認してください。')
    window.addEventListener('personal-pwa-maps-auth-error', handleAuthError)
    void googleMapsSettingsRepository.getApiKey().then(async (apiKey) => {
      if (!active) return
      setGoogleMapsConfigured(Boolean(apiKey))
      if (!apiKey || !hostRef.current) return
      await loadGoogleMaps(apiKey)
      if (!active || !hostRef.current || mapRef.current) return
      const map = new google.maps.Map(hostRef.current, {
        center: { lat: center.latitude, lng: center.longitude },
        zoom: 11,
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
      })
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) onChoosePosition({ latitude: event.latLng.lat(), longitude: event.latLng.lng() })
      })
      mapRef.current = map
      setMapReady(true)
    }).catch((cause: unknown) => {
      if (active) setLoadError(cause instanceof Error ? cause.message : '地図を読み込めませんでした。')
    })
    return () => {
      active = false
      window.removeEventListener('personal-pwa-maps-auth-error', handleAuthError)
    }
  }, [center.latitude, center.longitude, onChoosePosition])

  useEffect(() => {
    if (mapReady) mapRef.current?.setCenter({ lat: center.latitude, lng: center.longitude })
  }, [center.latitude, center.longitude, mapReady])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map) return
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = memos.map((memo) => {
      const marker = new google.maps.Marker({
        map,
        position: { lat: memo.latitude, lng: memo.longitude },
        title: memo.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#244b3c',
          fillOpacity: 1,
          strokeColor: '#f8f7f0',
          strokeWeight: 3,
          scale: 9,
        },
      })
      marker.addListener('click', () => onSelectMemo(memo.id))
      return marker
    })
  }, [mapReady, memos, onSelectMemo])

  if (!googleMapsConfigured || loadError) {
    return (
      <div className="map-unavailable">
        <div className="map-pattern" aria-hidden="true">
          <span className="map-road map-road-one" />
          <span className="map-road map-road-two" />
          <span className="map-road map-road-three" />
          <span className="map-river" />
        </div>
        <div className="map-notice">
          <span className="map-notice-icon"><WifiOff size={17} /></span>
          <div>
            <strong>{loadError ? '地図を表示できません' : '地図の準備ができていません'}</strong>
            <p>{loadError ?? 'Google Maps APIキーを設定すると地図を表示できます。メモは座標を入力して保存できます。'}</p>
          </div>
        </div>
      </div>
    )
  }

  return <div className="google-map" ref={hostRef} aria-label="地図。地図をタップしてメモの場所を選択" />
}
