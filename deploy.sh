#!/bin/bash
set -euo pipefail

# --- 設定變數 ---
IMAGE_NAME="iamsurferjason/workerzexit_app:latest"

echo "🚀 開始在本地端打包 (Strategy B)..."

# 1. 先確認是否有登入 Docker Hub (如果沒有請執行 docker login)
if ! docker info > /dev/null 2>&1; then
    echo "❌ 請先啟動您的 Docker Desktop 程式！"
    exit 1
fi

# 2. 執行編譯 (針對 NAS 常用的 x86_64 架構進行跨平台打包)
# 如果您的 NAS 是 ARM 版本，請將下方的 linux/amd64 改為 linux/arm64
echo "📦 正在建立跨平台映像檔 (linux/amd64)... 此過程取決於您的電腦效能，請稍候..."
docker build --platform linux/amd64 -t $IMAGE_NAME .

# 3. 上傳到 Docker Hub
echo "☁️ 正在將成品推送到 Docker Hub..."
docker push $IMAGE_NAME

echo "✅ 打包完成！現在請去 GitHub 提交這份最新的 docker-compose.yml 變更。"
echo "接著回到 NAS Portainer，再次部署時就不會報錯了！"
