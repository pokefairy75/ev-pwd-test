import { ArrowLeft, ArrowUpRight, Database, MapPin, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="page about-page">
      <div className="page-backline"><Link className="back-link" to="/"><ArrowLeft size={17} /> ホーム</Link><span className="eyebrow">A LITTLE ABOUT</span></div>
      <div className="about-brand">
        <span className="about-mark"><MapPin size={25} /></span>
        <span className="eyebrow">PERSONAL PWA / 0.1</span>
        <h1>自分だけの、<br />小さな道具箱。</h1>
        <p>欲しい機能を、少しずつ。Personalは日々の記録を自分の手元に残すためのアプリです。</p>
      </div>
      <section className="about-principles">
        <article><span className="principle-icon"><MapPin size={19} /></span><div><strong>場所を残す</strong><p>また行きたい場所や、忘れたくない発見を地図メモに。</p></div></article>
        <article><span className="principle-icon"><Database size={19} /></span><div><strong>端末の中に保存</strong><p>メモはブラウザー内に保存。自分のデータは自分の端末に。</p></div></article>
        <article><span className="principle-icon"><Smartphone size={19} /></span><div><strong>いつもの場所から</strong><p>ホーム画面に追加して、iPhoneアプリのように使えます。</p></div></article>
      </section>
      <div className="about-footer-card">
        <span>FIRST FEATURE</span><strong>地図メモ</strong>
        <Link to="/map">メモを見に行く <ArrowUpRight size={16} /></Link>
      </div>
    </div>
  )
}
