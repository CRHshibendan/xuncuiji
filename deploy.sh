#!/bin/bash
# 寻萃集 腾讯云部署脚本
# 用法：在服务器上执行  bash deploy.sh

set -e

echo "===== 寻萃集 部署开始 ====="

# 1. 安装 Node.js 18+（如果没装）
if ! command -v node &> /dev/null; then
  echo "安装 Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# 2. 安装 PM2
if ! command -v pm2 &> /dev/null; then
  echo "安装 PM2..."
  sudo npm install -g pm2
fi

# 3. 安装 Nginx
if ! command -v nginx &> /dev/null; then
  echo "安装 Nginx..."
  sudo apt-get install -y nginx
fi

# 4. 拉取代码
APP_DIR=/var/www/xuncuiji
if [ ! -d "$APP_DIR" ]; then
  echo "克隆代码..."
  sudo mkdir -p /var/www
  sudo git clone https://github.com/CRHshibendan/xuncuiji.git $APP_DIR
  sudo chown -R $USER:$USER $APP_DIR
else
  echo "更新代码..."
  cd $APP_DIR
  git pull
fi

cd $APP_DIR

# 5. 安装依赖
echo "安装依赖..."
npm install --production

# 6. 配置 .env（如果不存在）
if [ ! -f .env ]; then
  echo "请输入 DeepSeek API Key："
  read -r API_KEY
  echo "DEEPSEEK_API_KEY=$API_KEY" > .env
  echo "PORT=3000" >> .env
fi

# 7. 启动服务（PM2）
echo "启动服务..."
pm2 delete xuncuiji 2>/dev/null || true
pm2 start server.js --name xuncuiji
pm2 save
pm2 startup | tail -1

# 8. 配置 Nginx 反向代理
echo "配置 Nginx..."
sudo cp deploy/nginx.conf /etc/nginx/sites-available/xuncuiji.conf
sudo ln -sf /etc/nginx/sites-available/xuncuiji.conf /etc/nginx/sites-enabled/xuncuiji.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "===== 部署完成 ====="
echo "网站地址：http://xuncuiji.cn"
echo "查看日志：pm2 logs xuncuiji"
echo ""
echo "⚠️  别忘了在腾讯云 DNS 把 xuncuiji.cn 解析到这台服务器的公网 IP"
echo "⚠️  如需 HTTPS，运行：sudo certbot --nginx -d xuncuiji.cn -d www.xuncuiji.cn"
