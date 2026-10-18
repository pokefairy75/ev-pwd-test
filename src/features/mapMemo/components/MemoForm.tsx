import { useState, type FormEvent } from 'react'
import { Crosshair, X } from 'lucide-react'
import type { MapMemo, MapMemoInput } from '../types/mapMemo'

type MemoFormProps = {
  memo?: MapMemo
  initialPosition: { latitude: number; longitude: number }
  onClose: () => void
  onSave: (input: MapMemoInput) => Promise<void>
}

export function MemoForm({ memo, initialPosition, onClose, onSave }: MemoFormProps) {
  const [title, setTitle] = useState(memo?.title ?? '')
  const [content, setContent] = useState(memo?.content ?? '')
  const [latitude, setLatitude] = useState(String(memo?.latitude ?? initialPosition.latitude))
  const [longitude, setLongitude] = useState(String(memo?.longitude ?? initialPosition.longitude))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const lat = Number(latitude)
    const lng = Number(longitude)
    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      setError('緯度は -90〜90、経度は -180〜180 の範囲で入力してください。')
      return
    }
    setBusy(true)
    try {
      await onSave({ title: title.trim(), content: content.trim(), latitude: lat, longitude: lng })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'メモを保存できませんでした。')
    } finally {
      setBusy(false)
    }
  }

  function useCurrentPosition() {
    setLocationError(null)
    if (!navigator.geolocation) {
      setLocationError('このブラウザーでは位置情報を利用できません。')
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLatitude(coords.latitude.toFixed(6))
        setLongitude(coords.longitude.toFixed(6))
      },
      (cause) => {
        const messages: Record<number, string> = {
          1: '位置情報の利用が許可されていません。ブラウザーの設定をご確認ください。',
          2: '現在地を取得できませんでした。電波状況をご確認ください。',
          3: '位置情報の取得がタイムアウトしました。もう一度お試しください。',
        }
        setLocationError(messages[cause.code] ?? '現在地を取得できませんでした。')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onClose()
    }}>
      <section className="memo-dialog" role="dialog" aria-modal="true" aria-labelledby="memo-form-title">
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">{memo ? 'UPDATE A PLACE' : 'SAVE A PLACE'}</span>
            <h2 id="memo-form-title">{memo ? 'メモを編集' : '場所をメモ'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} disabled={busy} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>
        <form className="memo-form" onSubmit={(event) => void handleSubmit(event)}>
          <label className="field">
            <span>タイトル <i>必須</i></span>
            <input autoFocus maxLength={80} required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例：また行きたいカフェ" />
          </label>
          <label className="field">
            <span>メモ</span>
            <textarea maxLength={2000} rows={4} value={content} onChange={(event) => setContent(event.target.value)} placeholder="気づいたことや次回の予定をメモ…" />
          </label>
          <div className="form-section-heading">
            <span>場所</span>
            <button className="text-button" type="button" onClick={useCurrentPosition}>
              <Crosshair size={15} /> 現在地を使う
            </button>
          </div>
          <div className="coordinate-grid">
            <label className="field">
              <span>緯度</span>
              <input inputMode="decimal" required type="number" step="any" min="-90" max="90" value={latitude} onChange={(event) => setLatitude(event.target.value)} />
            </label>
            <label className="field">
              <span>経度</span>
              <input inputMode="decimal" required type="number" step="any" min="-180" max="180" value={longitude} onChange={(event) => setLongitude(event.target.value)} />
            </label>
          </div>
          {locationError && <p className="inline-error" role="alert">{locationError}</p>}
          {error && <p className="inline-error" role="alert">{error}</p>}
          <div className="dialog-actions">
            <button className="button button-secondary" type="button" onClick={onClose} disabled={busy}>キャンセル</button>
            <button className="button button-primary" type="submit" disabled={busy}>{busy ? '保存中…' : '保存する'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
