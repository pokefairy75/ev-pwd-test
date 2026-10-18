import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatDate } from '../components/MemoCard'
import { MemoForm } from '../components/MemoForm'
import { mapMemoRepository } from '../repository/mapMemoRepository'
import type { MapMemo, MapMemoInput } from '../types/mapMemo'

export function MapMemoDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [memo, setMemo] = useState<MapMemo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    void mapMemoRepository.getById(id).then((result) => {
      if (active) setMemo(result ?? null)
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'メモを読み込めませんでした。')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [id])

  async function saveMemo(input: MapMemoInput) {
    const updated = await mapMemoRepository.update(id, input)
    setMemo(updated)
    setFormOpen(false)
  }

  async function deleteMemo() {
    if (!window.confirm('この場所メモを削除しますか？この操作は取り消せません。')) return
    setDeleting(true)
    setError(null)
    try {
      await mapMemoRepository.delete(id)
      navigate('/map', { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'メモを削除できませんでした。')
      setDeleting(false)
    }
  }

  if (loading) return <div className="page detail-page"><div className="skeleton-row" aria-label="読み込み中" /></div>

  return (
    <div className="page detail-page">
      <div className="page-backline">
        <Link className="back-link" to="/map"><ArrowLeft size={17} /> 地図メモ</Link>
        <span className="eyebrow">PLACE DETAIL</span>
      </div>
      {error && <p className="inline-error" role="alert">{error}</p>}
      {!memo ? (
        <div className="not-found-state">
          <span className="not-found-icon"><MapPin size={24} /></span>
          <h1>メモが見つかりません</h1>
          <p>削除されたか、URLが正しくない可能性があります。</p>
          <Link className="button button-secondary" to="/map">メモ一覧に戻る</Link>
        </div>
      ) : (
        <>
          <div className="detail-topline"><span className="detail-label"><MapPin size={14} /> SAVED PLACE</span><span className="detail-date"><CalendarDays size={14} /> {formatDate(memo.updatedAt)}</span></div>
          <h1 className="detail-title">{memo.title}</h1>
          {memo.content ? <p className="detail-content">{memo.content}</p> : <p className="detail-content detail-content-empty">この場所についてのメモはありません。</p>}
          <section className="coordinate-card">
            <div className="coordinate-card-icon"><MapPin size={18} /></div>
            <div><span>LOCATION</span><strong>{memo.latitude.toFixed(6)}, {memo.longitude.toFixed(6)}</strong></div>
            <a href={`https://www.google.com/maps/search/?api=1&query=${memo.latitude},${memo.longitude}`} target="_blank" rel="noreferrer" aria-label="Google Mapsで開く"><ExternalLink size={17} /></a>
          </section>
          <div className="detail-timestamps">
            <span>作成 {formatDate(memo.createdAt)}</span>
            <span>更新 {formatDate(memo.updatedAt)}</span>
          </div>
          <div className="detail-actions">
            <button className="button button-primary" type="button" onClick={() => setFormOpen(true)}><Pencil size={16} /> 編集する</button>
            <button className="button button-danger" type="button" onClick={() => void deleteMemo()} disabled={deleting}><Trash2 size={16} /> {deleting ? '削除中…' : '削除'}</button>
          </div>
        </>
      )}
      {formOpen && memo && (
        <MemoForm
          memo={memo}
          initialPosition={{ latitude: memo.latitude, longitude: memo.longitude }}
          onClose={() => setFormOpen(false)}
          onSave={saveMemo}
        />
      )}
    </div>
  )
}
