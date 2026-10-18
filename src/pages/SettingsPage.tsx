import { useEffect, useState } from 'react'
import { ArrowRight, Database, ExternalLink, Map, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { isGoogleMapsConfigured } from '../lib/googleMaps/loadGoogleMaps'
import { mapMemoRepository } from '../features/mapMemo/repository/mapMemoRepository'

export function SettingsPage() {
  const [memoCount, setMemoCount] = useState<number | null>(null)
  const [storageError, setStorageError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void mapMemoRepository.getAll().then((memos) => {
      if (active) setMemoCount(memos.length)
    }).catch((cause: unknown) => {
      if (active) setStorageError(cause instanceof Error ? cause.message : '保存データを確認できませんでした。')
    })
    return () => { active = false }
  }, [])

  return (
    <div className="page settings-page">
      <div className="page-backline"><span className="eyebrow">PREFERENCES</span></div>
      <div className="page-title-row">
        <div><h1>設定<span className="title-dot">.</span></h1><p>自分のアプリを整える。</p></div>
      </div>

      <section className="settings-group">
        <span className="eyebrow">APP STATUS</span>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-icon"><Database size={18} /></span>
            <span className="settings-copy"><strong>端末内のメモ</strong><small>IndexedDBに保存</small></span>
            <span className="settings-value">{memoCount === null ? '…' : `${memoCount}件`}</span>
          </div>
          <div className="settings-divider" />
          <div className="settings-row">
            <span className="settings-icon"><Map size={18} /></span>
            <span className="settings-copy"><strong>Google Maps</strong><small>{isGoogleMapsConfigured() ? 'APIキー設定済み' : 'APIキー未設定'}</small></span>
            <span className={`status-pill${isGoogleMapsConfigured() ? ' status-ready' : ''}`}><i />{isGoogleMapsConfigured() ? '利用可能' : '未設定'}</span>
          </div>
          {storageError && <p className="inline-error settings-error" role="alert">{storageError}</p>}
        </div>
      </section>

      <section className="settings-group">
        <span className="eyebrow">HOW TO USE</span>
        <div className="settings-card settings-links">
          <Link className="settings-row settings-link-row" to="/about">
            <span className="settings-icon"><Smartphone size={18} /></span>
            <span className="settings-copy"><strong>ホーム画面に追加</strong><small>Safariからアプリとして使う</small></span>
            <ArrowRight size={17} className="row-arrow" />
          </Link>
          <div className="settings-divider" />
          <a className="settings-row settings-link-row" href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noreferrer">
            <span className="settings-icon"><ShieldCheck size={18} /></span>
            <span className="settings-copy"><strong>地図APIキーの設定方法</strong><small>Google Cloudでキーを発行する</small></span>
            <ExternalLink size={16} className="row-arrow" />
          </a>
        </div>
      </section>

      <div className="settings-footnote"><ShieldCheck size={16} /><p>メモの内容はサーバーへ送信されません。ブラウザーのデータを消去すると、保存したメモも削除されます。</p></div>
      <div className="version-label">PERSONAL PWA <span>VERSION 0.1</span></div>
    </div>
  )
}
