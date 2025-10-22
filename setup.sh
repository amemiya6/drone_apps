#!/bin/bash

echo "ドローン追跡ナビアプリのセットアップを開始します..."
echo

echo "バックエンドの依存関係をインストール中..."
npm install
if [ $? -ne 0 ]; then
    echo "エラー: バックエンドの依存関係のインストールに失敗しました"
    exit 1
fi

echo
echo "フロントエンドの依存関係をインストール中..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "エラー: フロントエンドの依存関係のインストールに失敗しました"
    exit 1
fi
cd ..

echo
echo "セットアップが完了しました！"
echo
echo "アプリケーションを起動するには以下のコマンドを実行してください:"
echo "  npm start"
echo
echo "開発モードで起動するには:"
echo "  npm run dev"
echo
echo "ブラウザで http://localhost:3000 にアクセスしてください"
echo
