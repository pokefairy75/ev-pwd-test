import { useEffect, useState } from 'react'
import { ArrowRight, Database, ExternalLink, KeyRound, Map, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { googleMapsSettingsRepository } from '../lib/googleMaps/googleMapsSettingsRepository'
import { mapMemoRepository } from '../features/mapMemo/repository/mapMemoRepository'

export function SettingsPage() {
  const [memoCount, setMemoCount] = useState<number | null>(null)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void mapMemoRepository.getAll().then((memos) => {
      if (active) setMemoCount(memos.length)
    }).catch((cause: unknown) => {
      if (active) setStorageError(cause instanceof Error ? cause.message : '保存データを確認できませんでした。')
    })
    void googleMapsSettingsRepository.getApiKey().then((key) => {
      if (!active) return
      setApiKey(key)
      setApiKeyConfigured(Boolean(key))
      setSettingsLoading(false)
    }).catch((cause: unknown) => {
      if (!active) return
      setStorageError(cause instanceof Error ? cause.message : 'Google Mapsの設定を読み込めませんでした。')
      setSettingsLoading(false)
    })
    return () => { active = false }
  }, [])

  async function saveApiKey(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const key = apiKey.trim()
    if (!key) {
      setSettingsMessage('APIキーを入力してください。')
      return
    }
    setSettingsSaving(true)
    setStorageError(null)
    setSettingsMessage(null)
    try {
      await googleMapsSettingsRepository.saveApiKey(key)
      setApiKey(key)
      setApiKeyConfigured(true)
      setSettingsMessage('このブラウザーに保存しました。地図を表示中の場合は、ページを再読み込みしてください。')
    } catch (cause) {
      setStorageError(cause instanceof Error ? cause.message : 'APIキーを保存できませんでした。')
    } finally {
      setSettingsSaving(false)
    }
  }

  async function removeApiKey() {
    setSettingsSaving(true)
    setStorageError(null)
    setSettingsMessage(null)
    try {
      await googleMapsSettingsRepository.deleteApiKey()
      setApiKey('')
      setApiKeyConfigured(false)
      setSettingsMessage('このブラウザーからAPIキーを削除しました。地図表示中の場合は再読み込みしてください。キー自体の無効化はGoogle Cloudで行ってください。')
    } catch (cause) {
      setStorageError(cause instanceof Error ? cause.message : 'APIキーを削除できませんでした。')
    } finally {
      setSettingsSaving(false)
    }
  }

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
            <span className="settings-copy"><strong>Google Maps</strong><small>{settingsLoading ? '設定を確認中' : apiKeyConfigured ? 'APIキー設定済み' : 'APIキー未設定'}</small></span>
            <span className={`status-pill${apiKeyConfigured ? ' status-ready' : ''}`}><i />{settingsLoading ? '確認中' : apiKeyConfigured ? '利用可能' : '未設定'}</span>
          </div>
          <form className="settings-api-form" onSubmit={saveApiKey}>
            <label className="field">
              <span>自分のGoogle Maps APIキー</span>
              <input
                autoComplete="off"
                disabled={settingsLoading || settingsSaving}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="AIza..."
                type="password"
                value={apiKey}
              />
            </label>
            <div className="settings-api-actions">
              <button className="button button-primary" type="submit" disabled={settingsLoading || settingsSaving}>
                <KeyRound size={15} /> 保存
              </button>
              {apiKeyConfigured && (
                <button className="button button-secondary" type="button" onClick={removeApiKey} disabled={settingsSaving}>
                  削除
                </button>
              )}
            </div>
          </form>
          {settingsMessage && <p className="settings-message" role="status">{settingsMessage}</p>}
          <p className="settings-security-note">キーはこのブラウザーのIndexedDBに保存されます。暗号化やアカウント同期はされません。同じ端末・ブラウザープロファイルを使える人や、このサイト上で実行されるスクリプトからは参照可能です。Google Cloudでウェブサイト制限とAPI制限を設定してください。</p>
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

      <div className="settings-footnote"><ShieldCheck size={16} /><p>メモとAPIキーはこのブラウザー内に保存されます。ブラウザーのデータを消去すると、保存内容も削除されます。</p></div>
      <div className="version-label">PERSONAL PWA <span>VERSION 0.1</span></div>
    </div>
  )
}
