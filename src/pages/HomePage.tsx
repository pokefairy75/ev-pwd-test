import { ArrowRight, Compass, MapPin, Plus, Sprout, Tent, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { MemoCard } from '../features/mapMemo/components/MemoCard'
import { useMapMemos } from '../features/mapMemo/hooks/useMapMemos'

const futureFeatures = [
  { title: 'キャンプ', Icon: Tent, note: 'お気に入りの場所や記録を' },
  { title: '釣り', Icon: Waves, note: '釣果やポイントを' },
  { title: '旅の記録', Icon: Compass, note: 'いつかの旅のために' },
]

export function HomePage() {
  const { memos, loading, error } = useMapMemos()

  return (
    <div className="page home-page">
      <section className="welcome-block">
        <span className="eyebrow">YOUR PERSONAL SPACE</span>
        <h1>好きな場所を、<br /><span>忘れないように。</span></h1>
        <p>日々の小さな発見を、地図と一緒に残していこう。</p>
        <div className="welcome-decoration" aria-hidden="true">
          <span className="decoration-sun" />
          <span className="decoration-hill decoration-hill-back" />
          <span className="decoration-hill decoration-hill-front" />
          <MapPin className="decoration-pin" size={27} fill="currentColor" />
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">START HERE</span>
            <h2>あなたの機能</h2>
          </div>
          <span className="section-count">01</span>
        </div>
        <Link className="feature-card feature-card-map" to="/map">
          <span className="feature-icon"><MapPin size={21} /></span>
          <span className="feature-copy">
            <strong>地図メモ</strong>
            <span>また行きたい場所を記録</span>
          </span>
          <span className="feature-count">{memos.length}<small>件</small></span>
          <ArrowRight className="feature-arrow" size={19} />
        </Link>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ON YOUR LIST</span>
            <h2>これから追加したいもの</h2>
          </div>
          <Sprout size={20} className="section-sprout" />
        </div>
        <div className="future-grid">
          {futureFeatures.map(({ title, Icon, note }, index) => (
            <div className="future-card" key={title}>
              <span className="future-icon"><Icon size={19} /></span>
              <span className="future-index">0{index + 2}</span>
              <strong>{title}</strong>
              <small>{note}</small>
              <span className="coming-soon">いつか</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block recent-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">RECENTLY SAVED</span>
            <h2>最近のメモ</h2>
          </div>
          {memos.length > 0 && <Link className="small-link" to="/map">すべて見る <ArrowRight size={14} /></Link>}
        </div>
        {error ? <p className="inline-error" role="alert">{error}</p> : loading ? (
          <div className="skeleton-row" aria-label="読み込み中" />
        ) : memos.length > 0 ? (
          <div className="memo-list">{memos.slice(0, 3).map((memo) => <MemoCard key={memo.id} memo={memo} compact />)}</div>
        ) : (
          <EmptyState
            icon={<MapPin size={23} />}
            title="最初の場所を残そう"
            description="お気に入りの場所や、また行きたい場所をメモしてみましょう。"
            action={<Link className="button button-secondary" to="/map"><Plus size={16} /> メモを作る</Link>}
          />
        )}
      </section>

      <p className="privacy-note"><span className="privacy-dot" />メモはこの端末の中だけに保存されます</p>
    </div>
  )
}
