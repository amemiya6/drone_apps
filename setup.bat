@echo off
echo ドローン追跡ナビアプリのセットアップを開始します...
echo.

echo バックエンドの依存関係をインストール中...
call npm install
if %errorlevel% neq 0 (
    echo エラー: バックエンドの依存関係のインストールに失敗しました
    pause
    exit /b 1
)

echo.
echo フロントエンドの依存関係をインストール中...
cd client
call npm install
if %errorlevel% neq 0 (
    echo エラー: フロントエンドの依存関係のインストールに失敗しました
    pause
    exit /b 1
)
cd ..

echo.
echo セットアップが完了しました！
echo.
echo アプリケーションを起動するには以下のコマンドを実行してください:
echo   npm start
echo.
echo 開発モードで起動するには:
echo   npm run dev
echo.
echo ブラウザで http://localhost:3000 にアクセスしてください
echo.
pause
