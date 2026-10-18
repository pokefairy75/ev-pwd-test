# 自分専用PWA 設計書

- Version: 0.1.0
- Status: Draft
- Last Updated: 2026-10-18

---

## 1. プロジェクト概要

### 1.1 プロジェクト名

仮称：Personal PWA

正式名称は後日決定する。

### 1.2 概要

個人利用を目的とした、自分専用のPWA（Progressive Web App）を開発する。

アプリのホーム画面から複数の機能へアクセスできる構成とし、今後必要になった機能を段階的に追加できるように設計する。

第一弾の機能として「地図メモ」を実装する。

### 1.3 基本コンセプト

> 「自分が欲しい機能を、自分で追加していけるアプリ」

以下を基本方針とする。

- 個人利用を前提とする
- iPhoneで快適に利用できること
- PWAとしてホーム画面から起動できること
- 基本的にサーバーを必要としないこと
- データは端末内に保存すること
- 新しい機能を追加しやすい構造にすること
- 開発そのものをフロントエンド技術の学習機会とすること

---

# 2. 開発目的

## 2.1 アプリ開発上の目的

日常生活の中で必要になった機能を、一つのアプリに集約する。

将来的には以下のような機能追加を想定する。

- 地図メモ
- 旅行管理
- キャンプ管理
- 釣り情報管理
- TODO
- 写真・記録
- その他、必要になった機能

ただし、具体的な追加機能は現時点では決定しない。

## 2.2 技術学習上の目的

これまで主にPHPを使用してきたため、本プロジェクトを通して以下の技術を学習する。

- TypeScript
- React
- Vite
- React Router
- PWA
- IndexedDB
- 現代的なフロントエンド開発
- コンポーネント指向UI設計

---

# 3. 対象環境

## 3.1 対象端末

第一対象：

- iPhone
- Safari

将来的には以下への対応も検討する。

- iPad
- PC
- Android

ただし、初期バージョンではiPhoneを最優先とする。

## 3.2 利用形態

SafariからWebアプリへアクセスし、「ホーム画面に追加」することでPWAとして利用する。

想定利用フロー：

```text
Safari
↓
Webアプリへアクセス
↓
ホーム画面に追加
↓
iPhoneのホーム画面から起動
↓
Personal PWAを利用
```

---

# 4. システム構成

## 4.1 全体構成

```text
┌─────────────────────────────────────┐
│              iPhone                 │
│                                     │
│  ┌───────────────────────────────┐  │
│  │          Personal PWA         │  │
│  │                               │  │
│  │  React + TypeScript           │  │
│  │       │                       │  │
│  │       ├─ Home                 │  │
│  │       ├─ Map Memo             │  │
│  │       ├─ Future Features      │  │
│  │       └─ Settings             │  │
│  │                               │  │
│  │       │                       │  │
│  │       ├─ Google Maps API      │  │
│  │       │                       │  │
│  │       └─ IndexedDB            │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

## 4.2 サーバー

初期バージョンでは独自バックエンドを構築しない。

```text
Frontend
    ↓
IndexedDB
```

という構成を基本とする。

PHPによるバックエンドは初期バージョンでは使用しない。

---

# 5. 技術スタック

| 分類 | 技術 | 用途 |
|---|---|---|
| 言語 | TypeScript | アプリケーション開発 |
| UI | React | UI構築 |
| Build Tool | Vite | 開発環境・ビルド |
| Routing | React Router | ページ遷移 |
| CSS | Tailwind CSS | UIスタイリング |
| 地図 | Google Maps JavaScript API | 地図表示 |
| Storage | IndexedDB | ローカルデータ保存 |
| PWA | Web App Manifest / Service Worker | PWA化 |
| Version Control | Git | ソースコード管理 |
| Repository | GitHub | リポジトリ管理 |

---

# 6. 技術選定理由

## 6.1 TypeScript

JavaScriptに静的型付けを追加する。

採用理由：

- 型によるバグ防止
- IDEによる補完が強力
- 大規模化しやすい
- Reactとの相性が良い
- PHP経験者が型の概念を活かしやすい

---

## 6.2 React

UI構築にReactを使用する。

採用理由：

- コンポーネント指向で開発できる
- 現代的なフロントエンド開発を学習できる
- 将来的な機能追加に向いている
- エコシステムが充実している

---

## 6.3 Vite

React + TypeScriptの開発環境としてViteを使用する。

採用理由：

- 起動が高速
- 設定が比較的シンプル
- Reactとの組み合わせが一般的
- 開発時のフィードバックが速い

---

## 6.4 React Router

複数ページ・複数機能を管理するために使用する。

想定：

```text
/
├── /map
├── /map/:id
├── /settings
└── ...
```

---

## 6.5 IndexedDB

アプリ内データの保存先としてIndexedDBを使用する。

採用理由：

- ブラウザ内で利用可能
- 比較的大容量のデータを保存可能
- オフライン利用と相性が良い
- サーバー不要
- 個人用アプリという用途に適している

---

# 7. Google Maps

## 7.1 採用

地図表示にはGoogle Maps JavaScript APIを使用する。

## 7.2 利用方針

個人利用を前提とし、無料利用枠内での運用を目指す。

ただし、Google Maps Platformは利用量に応じた課金が発生する可能性があるため、完全無料を保証するものではない。

## 7.3 APIキー

Google Cloud PlatformでAPIキーを発行する。

APIキーには可能な限り適切な利用制限を設定する。

## 7.4 想定利用機能

初期バージョンでは以下を利用する。

- 地図表示
- 地図移動
- ズーム
- 現在地表示
- マーカー表示
- マーカー選択

将来的に以下を検討する。

- 現在地への移動
- 地図クリックによるメモ作成
- 複数マーカー表示
- マーカーのカテゴリ分け
- 地図上での検索

---

# 8. アプリ全体構成

## 8.1 ページ構成

```text
/
├── Home
│
├── /map
│   └── 地図メモ
│
├── /map/:id
│   └── メモ詳細
│
├── /settings
│   └── 設定
│
└── /about
    └── アプリ情報
```

将来的には、

```text
/
├── Home
├── Map Memo
├── Camping
├── Fishing
├── Travel
├── TODO
├── Photo
└── Settings
```

のように拡張する。

---

# 9. ホーム画面

## 9.1 目的

アプリ内の各機能への入口となる。

## 9.2 初期画面

```text
┌───────────────────────┐
│      Personal PWA     │
│                       │
│  ┌─────────────────┐  │
│  │   📍 地図メモ    │  │
│  └─────────────────┘  │
│                       │
│  ┌─────────────────┐  │
│  │   ⚙ 設定        │  │
│  └─────────────────┘  │
│                       │
└───────────────────────┘
```

将来的には機能追加に伴いメニューを増やす。

---

# 10. 地図メモ機能

## 10.1 概要

地図上の任意の場所にメモを登録し、後から確認・編集できるようにする。

## 10.2 基本フロー

```text
地図を開く
  ↓
場所を選択
  ↓
メモ作成
  ↓
タイトル・本文を入力
  ↓
保存
  ↓
IndexedDBへ保存
  ↓
地図上にマーカー表示
```

---

# 11. 地図メモ画面

## 11.1 画面構成

```text
┌───────────────────────┐
│ ← 地図メモ            │
├───────────────────────┤
│                       │
│                       │
│       Google Maps     │
│                       │
│        📍             │
│                       │
│                 ＋    │
├───────────────────────┤
│  メモ一覧              │
└───────────────────────┘
```

## 11.2 主な操作

- 地図移動
- ズーム
- 現在地表示
- マーカー選択
- 新規メモ作成
- メモ一覧表示

---

# 12. メモデータ

## 12.1 初期データモデル

```typescript
type MapMemo = {
  id: string
  title: string
  content: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}
```

## 12.2 将来拡張候補

```typescript
type MapMemo = {
  id: string
  title: string
  content: string
  latitude: number
  longitude: number
  category?: string
  tags?: string[]
  images?: string[]
  createdAt: string
  updatedAt: string
}
```

※初期実装では必要以上に項目を増やさない。

---

# 13. IndexedDB設計

## 13.1 Database

データベース名：

```text
personal-pwa
```

## 13.2 Object Store

初期：

```text
mapMemos
```

将来的には、

```text
mapMemos
settings
photos
camping
fishing
...
```

などを追加する。

## 13.3 概念図

```text
personal-pwa
│
├── mapMemos
│    ├── memo001
│    ├── memo002
│    └── memo003
│
├── settings
│
└── future...
```

---

# 14. データアクセス層

Reactコンポーネントから直接IndexedDBを操作しない。

以下のようなデータアクセス層を設ける。

```text
React Component
       ↓
Repository
       ↓
IndexedDB
```

例：

```text
MapMemoRepository

├── getAll()
├── getById()
├── create()
├── update()
└── delete()
```

これにより、将来的に保存先を変更しやすくする。

---

# 15. ディレクトリ構成

初期構成：

```text
src/
├── app/
│   ├── App.tsx
│   └── routes.tsx
│
├── components/
│   ├── common/
│   └── layout/
│
├── features/
│   └── mapMemo/
│       ├── components/
│       ├── pages/
│       ├── repository/
│       ├── types/
│       └── hooks/
│
├── pages/
│   ├── HomePage.tsx
│   ├── SettingsPage.tsx
│   └── AboutPage.tsx
│
├── lib/
│   ├── db/
│   └── googleMaps/
│
├── hooks/
│
├── types/
│
├── utils/
│
├── styles/
│
└── main.tsx
```

---

# 16. コンポーネント設計

## 16.1 基本方針

UIは可能な限り再利用可能なコンポーネントとして実装する。

例：

```text
components/
├── Button
├── Modal
├── Header
├── BottomNavigation
├── Card
└── Input
```

機能固有のコンポーネントは各feature配下に配置する。

例：

```text
features/mapMemo/components/
├── MapView
├── MapMarker
├── MemoForm
├── MemoList
└── MemoCard
```

---

# 17. 画面遷移

```text
              ┌──────────────┐
              │    Home      │
              └──────┬───────┘
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
      地図メモ      設定       その他
          │
          ↓
       地図画面
          │
          ↓
      メモ選択
          │
          ↓
      メモ詳細
          │
      ┌───┴───┐
      ↓       ↓
    編集     削除
```

---

# 18. PWA設計

## 18.1 必須要素

- Web App Manifest
- Service Worker
- HTTPS環境
- アイコン
- アプリ名
- 起動設定

## 18.2 Manifest

想定設定：

```json
{
  "name": "Personal PWA",
  "short_name": "Personal",
  "display": "standalone",
  "start_url": "/",
  "orientation": "portrait"
}
```

実際の値は実装時に決定する。

## 18.3 Service Worker

目的：

- 静的ファイルのキャッシュ
- オフライン起動
- PWAとしての基本的な動作

---

# 19. オフライン対応

本アプリはローカルデータを中心とするため、可能な限りオフラインでも利用できる設計とする。

ただしGoogle Mapsなど外部サービスに依存する機能については、完全なオフライン動作を保証しない。

### オフライン時

```text
利用可能
├── 保存済みメモの閲覧
├── メモの編集
├── メモの削除
└── ローカルデータ操作

制限あり
└── Google Maps表示
```

---

# 20. セキュリティ

## 20.1 個人情報

本アプリは個人利用を前提とする。

初期バージョンではサーバーへ個人データを送信しない。

## 20.2 APIキー

Google Maps APIキーをソースコードに直接ハードコードしない。

環境変数等を利用して管理する。

ただし、フロントエンドアプリに組み込まれるAPIキーは完全な秘密情報にはならないため、Google Cloud側で利用制限を設定する。

## 20.3 データバックアップ

IndexedDBは端末依存のため、将来的にデータのエクスポート・インポート機能を追加することを検討する。

---

# 21. バックアップ・データ移行

初期バージョンでは実装しない。

将来的に以下を検討する。

```text
IndexedDB
    ↓
JSON Export
    ↓
ファイル保存
```

復元：

```text
JSON
    ↓
Import
    ↓
IndexedDB
```

これにより端末変更時のデータ移行を可能にする。

---

# 22. Google Maps APIコスト対策

Google Maps Platformの無料利用枠内で運用することを目標とする。

以下を意識する。

- 不要なAPI呼び出しを行わない
- 地図コンポーネントを必要以上に再生成しない
- APIキーに利用制限を設定する
- Google Cloud Consoleで利用状況を確認する
- 必要に応じて利用量の監視を行う

将来的に利用量が増えた場合は、OpenStreetMap / MapLibre等への変更も検討する。

---

# 23. エラーハンドリング

最低限以下を考慮する。

## Google Maps

- APIキー不正
- API利用制限
- ネットワークエラー
- 地図読み込み失敗

## IndexedDB

- DB初期化失敗
- 保存失敗
- 読み込み失敗
- データ破損

## GPS

- 位置情報取得拒否
- 位置情報取得失敗
- タイムアウト

ユーザーにとって原因が分かりやすいエラーメッセージを表示する。

---

# 24. コーディング方針

## 24.1 TypeScript

可能な限り型を明示する。

`any`の使用は原則避ける。

## 24.2 React

コンポーネントは可能な限り小さく保つ。

責務を明確にする。

## 24.3 状態管理

初期バージョンではReact標準のstate / context等で対応する。

アプリ規模が大きくなった場合に状態管理ライブラリの導入を検討する。

## 24.4 コメント

コードを読めば分かる内容についてはコメントを書かない。

「なぜそうしているのか」が分かりにくい部分にはコメントを残す。

---

# 25. テスト方針

初期バージョンでは最低限の動作確認を行う。

### 手動確認

- iPhone Safariで起動できる
- ホーム画面から起動できる
- 地図が表示される
- 現在地が取得できる
- メモを登録できる
- メモが保存される
- アプリ再起動後もメモが残る
- メモを編集できる
- メモを削除できる

将来的に以下を導入する。

- Unit Test
- Component Test
- E2E Test

---

# 26. Git運用

## 26.1 ブランチ

初期段階ではシンプルな構成とする。

```text
main
  │
  ├── feature/map-memo
  ├── feature/pwa
  └── feature/settings
```

## 26.2 コミット

1コミット1目的を基本とする。

例：

```text
feat: add home page
feat: add map memo model
feat: add google maps
feat: add memo creation
fix: fix memo persistence
refactor: improve map memo repository
```

---

# 27. 開発ロードマップ

## Phase 0：プロジェクト準備

- [ ] Gitリポジトリ作成
- [ ] Viteプロジェクト作成
- [ ] React導入
- [ ] TypeScript導入
- [ ] Tailwind CSS導入
- [ ] Git初期設定

---

## Phase 1：アプリ基盤

- [ ] Home画面
- [ ] 共通Layout
- [ ] React Router
- [ ] 基本ナビゲーション
- [ ] PWA設定
- [ ] iPhoneでの起動確認

---

## Phase 2：データ基盤

- [ ] IndexedDB導入
- [ ] DB初期化処理
- [ ] Repository設計
- [ ] MapMemo型定義
- [ ] CRUD実装

---

## Phase 3：地図

- [ ] Google Cloud設定
- [ ] APIキー設定
- [ ] Google Maps表示
- [ ] 現在地取得
- [ ] マーカー表示
- [ ] マーカー選択

---

## Phase 4：地図メモ

- [ ] メモ作成
- [ ] メモ編集
- [ ] メモ削除
- [ ] メモ一覧
- [ ] メモ詳細
- [ ] 地図とメモの連携

---

## Phase 5：UX改善

- [ ] ローディング表示
- [ ] エラー表示
- [ ] 空状態表示
- [ ] モーダル
- [ ] レスポンシブ対応
- [ ] iPhone UI最適化

---

## Phase 6：バックアップ

- [ ] JSON Export
- [ ] JSON Import
- [ ] データバックアップ方法検討

---

# 28. 将来拡張

将来的に以下の機能追加を想定する。

```text
Personal PWA
│
├── 🗺 地図メモ
│
├── ⛺ キャンプ
│
├── 🎣 釣り
│
├── ✈️ 旅行
│
├── 📝 TODO
│
├── 📷 写真
│
└── ⚙️ 設定
```

ただし、新機能は必要になった時点で追加する。

最初から全機能を実装しない。

---

# 29. 将来的な技術変更候補

アプリが成長した場合、以下を検討する。

### データ量が増えた場合

IndexedDBの設計を見直す。

必要に応じてDexie等のライブラリ導入を検討する。

### 状態管理が複雑になった場合

Zustand等の状態管理ライブラリを検討する。

### クラウド同期が必要になった場合

以下を候補とする。

- Supabase
- Firebase
- 自作API

ただし、現時点では導入しない。

### Google Mapsのコストが問題になった場合

以下を検討する。

- MapLibre
- OpenStreetMap
- その他の地図サービス

---

# 30. 初期リリースのゴール

Version 0.1では以下を達成する。

```text
iPhone
  ↓
ホーム画面からPWA起動
  ↓
Home
  ↓
地図メモ
  ↓
Google Maps表示
  ↓
場所を選択
  ↓
メモ作成
  ↓
IndexedDBへ保存
  ↓
アプリを閉じる
  ↓
再度起動
  ↓
メモが残っている
```

これをVersion 0.1の完成条件とする。

---

# 31. 設計上の重要な原則

本プロジェクトでは以下を重要視する。

### 1. 最初から作り込みすぎない

必要になった機能だけ追加する。

### 2. 機能単位で分離する

新機能追加によって既存機能が壊れにくい構造にする。

### 3. データアクセスを分離する

Reactコンポーネントから直接IndexedDBを操作しない。

### 4. UIとロジックを分離する

可能な限り表示と処理を分離する。

### 5. iPhoneでの使いやすさを優先する

PC向けWebアプリを単純に縮小するのではなく、スマートフォンでの操作を前提にUIを設計する。

### 6. 将来の変更を恐れない

最初から完璧な設計を目指さず、実装・利用しながら改善する。

---

# 32. 未決定事項

以下は開発開始後に決定する。

- [ ] 正式なアプリ名
- [ ] アプリアイコン
- [ ] カラーテーマ
- [ ] フォント
- [ ] ナビゲーション方式
- [ ] 地図メモのUI詳細
- [ ] メモ入力方式
- [ ] タグ・カテゴリ仕様
- [ ] 写真添付仕様
- [ ] バックアップ仕様
- [ ] データ削除仕様
- [ ] Google Maps APIの具体的な利用範囲

---

# 33. Version 0.1 完成イメージ

最終的に、iPhone上で以下のような体験を実現する。

```text
┌───────────────────────┐
│       Personal        │
│                       │
│   📍 地図メモ          │
│                       │
│   ⛺ Coming Soon       │
│                       │
│   🎣 Coming Soon       │
│                       │
│   ⚙️ 設定              │
│                       │
└───────────────────────┘

            ↓

┌───────────────────────┐
│ ← 地図メモ             │
├───────────────────────┤
│                       │
│       Google Maps     │
│                       │
│         📍            │
│                       │
│                 ＋    │
├───────────────────────┤
│  最近のメモ            │
│                       │
│  📍 小樽運河           │
│  📍 支笏湖             │
│  📍 ○○キャンプ場       │
└───────────────────────┘

            ↓

┌───────────────────────┐
│       メモ詳細         │
├───────────────────────┤
│                       │
│  小樽運河              │
│                       │
│  夕方に来ると良さそう。 │
│  次回は夜景を見る。     │
│                       │
│  📍 43.xxxxx, 141.xxxx │
│                       │
│     [編集] [削除]      │
│                       │
└───────────────────────┘
```

---

# 34. 今後の進め方

本設計書をベースとして、以下の順番で実装する。

1. 開発環境構築
2. React / TypeScriptの基礎確認
3. Home画面作成
4. React Router導入
5. PWA化
6. IndexedDB導入
7. Google Maps導入
8. 地図メモ実装
9. iPhone実機確認
10. UI改善
11. Version 0.1リリース

設計は実装状況に応じて随時更新する。

---

# Appendix A：用語

| 用語 | 説明 |
|---|---|
| PWA | Web技術を利用してアプリのように利用できるWebアプリ |
| React | UI構築のためのJavaScriptライブラリ |
| TypeScript | JavaScriptに型システムを追加した言語 |
| Vite | フロントエンド開発用ビルドツール |
| IndexedDB | ブラウザ内にデータを保存する仕組み |
| Service Worker | Webアプリのバックグラウンド処理などを担う仕組み |
| Google Maps JavaScript API | Google MapsをWebアプリに組み込むためのAPI |
| CRUD | Create / Read / Update / Delete |
