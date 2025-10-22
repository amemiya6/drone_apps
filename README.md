# ドローン追跡ナビアプリ

リアルタイムでドローンを追跡するナビゲーションアプリケーションです。

## 🚁 機能

- **リアルタイム追跡**: WebSocket通信による低遅延ドローン位置追跡
- **インタラクティブマップ**: OpenStreetMapを使用した美しい地図表示
- **軌跡表示**: ドローンの移動経路をリアルタイムで可視化
- **詳細情報**: 位置、高度、速度、方向、バッテリー残量の表示
- **統計情報**: 複数ドローンの統計データとサマリー
- **シミュレーション**: デモ用ドローンシミュレーション機能
- **レスポンシブデザイン**: モバイルデバイス対応

## 🛠️ 技術スタック

### バックエンド
- **Node.js**: JavaScriptランタイム
- **Express**: Webサーバーフレームワーク
- **Socket.IO**: リアルタイム双方向通信
- **CORS**: クロスオリジンリソース共有

### フロントエンド
- **React**: UIライブラリ
- **Leaflet**: インタラクティブマップライブラリ
- **React-Leaflet**: React用Leafletコンポーネント
- **Socket.IO Client**: WebSocket通信クライアント

## 📦 セットアップ

### 必要な環境
- Node.js (v16以上)
- npm

### インストール手順

1. **リポジトリをクローン**:
```bash
git clone <repository-url>
cd drone_apps
```

2. **依存関係をインストール**:
```bash
# バックエンドとフロントエンドの両方をインストール
npm run install-all
```

3. **アプリケーションを起動**:
```bash
# 本番モード
npm start

# 開発モード（推奨）
npm run dev
```

4. **ブラウザでアクセス**:
```
http://localhost:3000
```

### 開発モード

```bash
# バックエンド開発サーバー（自動再起動）
npm run dev

# フロントエンド開発サーバー（別ターミナル）
npm run client
```

## 🎮 使用方法

### 基本操作

1. **アプリケーション起動**
   - ブラウザで `http://localhost:3000` にアクセス
   - サーバー接続状態を確認

2. **シミュレーション開始**
   - 右側のコントロールパネルで「シミュレーション開始」をクリック
   - デモドローンが自動的に追加され、ランダムに移動開始

3. **ドローン追跡**
   - 地図上のドローンマーカーをクリックして詳細情報を表示
   - 左側のドローン一覧から選択して追跡
   - 軌跡ラインでドローンの移動経路を確認

4. **統計情報確認**
   - コントロールパネルでリアルタイム統計を確認
   - 総ドローン数、アクティブ数、平均速度・高度を表示

### 高度な機能

- **複数ドローン対応**: 複数のドローンを同時に追跡
- **軌跡表示**: 各ドローンの移動経路を色分けして表示
- **バッテリー監視**: バッテリー残量の視覚的表示
- **リアルタイム更新**: 1秒間隔での位置情報更新

## 🔧 API仕様

### WebSocket イベント

#### クライアント → サーバー
- `startSimulation`: シミュレーション開始
- `stopSimulation`: シミュレーション停止
- `getDrone`: 特定ドローン情報取得

#### サーバー → クライアント
- `droneUpdate`: ドローン位置更新
- `allDrones`: 全ドローン情報
- `simulationStarted`: シミュレーション開始通知
- `simulationStopped`: シミュレーション停止通知

### REST API

- `GET /api/drones`: 全ドローン情報取得
- `GET /api/drones/:id`: 特定ドローン情報取得

## 📊 データ構造

### ドローンオブジェクト
```javascript
{
  id: "drone-001",
  position: {
    lat: 35.6762,
    lng: 139.6503,
    altitude: 50,
    timestamp: 1640995200000
  },
  speed: 15.5,        // km/h
  heading: 45,        // 度
  battery: 85.2,       // %
  status: "active",    // active/inactive
  trajectory: [...],   // 位置履歴配列
  lastUpdate: 1640995200000
}
```

## 🚀 デプロイ

### Heroku
```bash
# Heroku CLIをインストール後
heroku create your-app-name
git push heroku main
```

### Docker
```bash
# Dockerfileを作成後
docker build -t drone-tracker .
docker run -p 3000:3000 drone-tracker
```

## 🔍 トラブルシューティング

### よくある問題

1. **サーバーに接続できない**
   - ポート3000が使用中でないか確認
   - ファイアウォール設定を確認

2. **地図が表示されない**
   - インターネット接続を確認
   - LeafletのCDNがアクセス可能か確認

3. **WebSocket接続エラー**
   - ブラウザのWebSocketサポートを確認
   - プロキシ設定を確認

### ログ確認
```bash
# サーバーログを確認
npm run dev

# ブラウザの開発者ツールでコンソールログを確認
```

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は `LICENSE` ファイルを参照してください。

## 📞 サポート

問題や質問がある場合は、GitHubのIssuesページで報告してください。

---

**開発者**: amemiya-tadashi  
**バージョン**: 1.0.0  
**最終更新**: 2024年