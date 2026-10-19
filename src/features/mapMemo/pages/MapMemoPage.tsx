import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Crosshair, MapPin, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '../../../components/common/EmptyState'
import { MapView } from '../components/MapView'
import { MemoCard } from '../components/MemoCard'
import { MemoForm } from '../components/MemoForm'
import { useMapMemos } from '../hooks/useMapMemos'
import { mapMemoRepository } from '../repository/mapMemoRepository'
import { googleMapsSettingsRepository } from '../../../lib/googleMaps/googleMapsSettingsRepository'
import type { MapMemoInput } from '../types/mapMemo'

type Position = { latitude: number; longitude: number }
const DEFAULT_POSITION: Position = { latitude: 35.6812, longitude: 139.7671 }

export function MapMemoPage() {
  const navigate = useNavigate()
  const { memos, loading, error, refresh } = useMapMemos()
  const [center, setCenter] = useState(DEFAULT_POSITION)
  const [formPosition, setFormPosition] = useState(DEFAULT_POSITION)
  const [formOpen, setFormOpen] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [googleMapsConfigured, setGoogleMapsConfigured] = useState(false)
  const [googleMapsSettingsError, setGoogleMapsSettingsError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void googleMapsSettingsRepository.getApiKey().then((apiKey) => {
      if (active) setGoogleMapsConfigured(Boolean(apiKey))
    }).catch((cause: unknown) => {
      if (active) setGoogleMapsSettingsError(cause instanceof Error ? cause.message : 'Google Mapsの設定を読み込めませんでした。')
    })
    return () => { active = false }
  }, [])

  const openFormAt = useCallback((position: Position) => {
    setFormPosition(position)
    setFormOpen(true)
  }, [])

  const selectMemo = useCallback((id: string) => {
    navigate(`/map/${id}`)
  }, [navigate])

  function locateMe() {
    setLocationError(null)
    if (!navigator.geolocation) {
      setLocationError('このブラウザーでは位置情報を利用できません。')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = { latitude: coords.latitude, longitude: coords.longitude }
        setCenter(position)
        setFormPosition(position)
        setLocating(false)
      },
      (cause) => {
        const messages: Record<number, string> = {
          1: '位置情報の利用が許可されていません。ブラウザーの設定をご確認ください。',
          2: '現在地を取得できませんでした。電波状況をご確認ください。',
          3: '位置情報の取得がタイムアウトしました。もう一度お試しください。',
        }
        setLocationError(messages[cause.code] ?? '現在地を取得できませんでした。')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function saveMemo(input: MapMemoInput) {
    await mapMemoRepository.create(input)
    await refresh()
    setFormOpen(false)
  }

  return (
    <div className="page map-page">
      <div className="page-backline">
        <Link className="back-link" to="/"><ArrowLeft size={17} /> ホーム</Link>
        <span className="eyebrow">YOUR PLACES</span>
      </div>
      <div className="page-title-row">
        <div>
          <h1>地図メモ<span className="title-dot">.</span></h1>
          <p>心にとまった場所を、ここに。</p>
        </div>
        <button className="round-add-button" type="button" onClick={() => openFormAt(center)} aria-label="新しいメモを作成">
          <Plus size={22} />
        </button>
      </div>

      <section className="map-panel" aria-label="場所を選ぶ地図">
        <div className="map-toolbar">
          <span><span className="live-dot" /> {memos.length} PLACES</span>
          <button className="map-control" type="button" onClick={locateMe} disabled={locating}>
            <Crosshair size={15} /> {locating ? '取得中…' : '現在地'}
          </button>
        </div>
        <MapView memos={memos} center={center} onChoosePosition={openFormAt} onSelectMemo={selectMemo} />
        <div className="map-hint">
          <MapPin size={14} />
          {googleMapsConfigured ? '地図をタップして場所を選択' : '設定画面でAPIキーを登録すると地図を利用できます'}
        </div>
      </section>
      {locationError && <p className="inline-error" role="alert">{locationError}</p>}
      {googleMapsSettingsError && <p className="inline-error" role="alert">{googleMapsSettingsError}</p>}

      <section className="section-block map-memo-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ALL YOUR NOTES</span>
            <h2>保存した場所 <span className="heading-number">{String(memos.length).padStart(2, '0')}</span></h2>
          </div>
        </div>
        {error ? <p className="inline-error" role="alert">{error}</p> : loading ? (
          <div className="skeleton-row" aria-label="読み込み中" />
        ) : memos.length ? (
          <div className="memo-list">{memos.map((memo) => <MemoCard key={memo.id} memo={memo} />)}</div>
        ) : (
          <EmptyState
            icon={<MapPin size={23} />}
            title="まだ場所がありません"
            description="現在地や地図上の場所を選んで、最初のメモを作成しましょう。"
            action={<button className="button button-primary" type="button" onClick={() => openFormAt(center)}><Plus size={16} /> 場所をメモする</button>}
          />
        )}
      </section>

      {formOpen && (
        <MemoForm
          initialPosition={formPosition}
          onClose={() => setFormOpen(false)}
          onSave={saveMemo}
        />
      )}
    </div>
  )
}
