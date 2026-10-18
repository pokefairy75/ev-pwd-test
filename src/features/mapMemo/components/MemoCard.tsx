import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MapMemo } from '../types/mapMemo'

type MemoCardProps = { memo: MapMemo; compact?: boolean }

export function MemoCard({ memo, compact = false }: MemoCardProps) {
  return (
    <Link className={`memo-card${compact ? ' memo-card-compact' : ''}`} to={`/map/${memo.id}`}>
      <span className="memo-pin"><MapPin size={17} /></span>
      <span className="memo-card-copy">
        <strong>{memo.title}</strong>
        <span>{memo.content || `${memo.latitude.toFixed(4)}, ${memo.longitude.toFixed(4)}`}</span>
        <small>{formatDate(memo.updatedAt)}</small>
      </span>
      <ArrowUpRight className="memo-arrow" size={17} />
    </Link>
  )
}

export function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '日時不明'
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
