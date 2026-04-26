# new-website Docker 部署

这个项目是纯静态前端页面，已经改造成可以直接通过 Docker 和 Nginx 部署，同时提供了两类可维护接口：

- PDF 列表接口
- 网站图片素材接口

## 目录说明

- `Dockerfile`：构建静态站点镜像
- `docker-compose.yml`：本地或服务器一键启动
- `nginx/default.conf`：Nginx 站点配置
- `data/notices.json`：资讯中心 PDF 列表数据源
- `data/site-assets.json`：网站图片素材配置数据源
- `downloads/`：PDF 文件目录
- `media/`：图片素材目录

## 接口说明

### 1. PDF 列表接口

```text
GET /api/notices
```

对应数据文件：

```text
/data/notices.json
```

PDF 下载路径：

```text
/downloads/<文件名>.pdf
```

### 2. 网站图片素材接口

```text
GET /api/site-assets
```

对应数据文件：

```text
/data/site-assets.json
```

图片访问路径：

```text
/media/<文件名>
```

例如：

```text
/media/home-hero.jpg
/media/news-hero.jpg
/media/service-booking.jpg
```

## 如何维护 PDF

后续你只需要做两件事：

1. 把 PDF 文件上传到 `downloads/` 目录
2. 修改 `data/notices.json`

示例：

```json
{
  "items": [
    {
      "id": "2026-04-shanghai",
      "title": "2026年4月 上海港 船期表",
      "updatedAt": "2026-03-27 13:24",
      "fileName": "2026-04-shanghai.pdf",
      "downloadUrl": "/downloads/2026-04-shanghai.pdf"
    }
  ]
}
```

## 如何维护网站图片

后续你只需要做两件事：

1. 把图片文件上传到 `media/` 目录
2. 修改 `data/site-assets.json`

示例：

```json
{
  "brand": {
    "logoImageUrl": "/media/logo.png"
  },
  "homeHero": {
    "title": "专业成就可能",
    "subtitle": "让精准履约，驱动你的全球化交付。",
    "backgroundImageUrl": "/media/home-hero.jpg"
  },
  "newsHero": {
    "title": "通知与船舶计划",
    "subtitle": "我们将提供最新资讯和船期表等相关通知",
    "backgroundImageUrl": "/media/news-hero.jpg"
  },
  "services": {
    "booking": {
      "imageUrl": "/media/service-booking.jpg",
      "imageAlt": "订舱服务"
    },
    "customs": {
      "imageUrl": "/media/service-customs.jpg",
      "imageAlt": "清关查验"
    },
    "warehouse": {
      "imageUrl": "/media/service-warehouse.jpg",
      "imageAlt": "仓储配送服务"
    }
  }
}
```

当前前端已支持这些图片配置：

- 顶部 Logo
- 首页首屏背景图
- 资讯中心首屏背景图
- 服务项目介绍的三张切换图片

如果某个图片地址为空，前端会自动使用当前内置的默认视觉样式，不会报错。

## 本地构建运行

```bash
docker build -t new-website:latest .
docker run -d --name new-website -p 80:80 --restart unless-stopped new-website:latest
```

浏览器访问：

```text
http://localhost
```

## 使用 Docker Compose

```bash
docker compose up -d --build
```

停止服务：

```bash
docker compose down
```

## Linux 云服务器部署

以下命令适用于 Ubuntu / Debian 类服务器。

### 1. 安装 Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. 上传项目

可以用 `git clone` 或 `scp` 上传到服务器，例如：

```bash
git clone <你的仓库地址> /opt/new-website
cd /opt/new-website
```

### 3. 启动容器

```bash
docker compose up -d --build
```

## Git Push 后自动部署

项目已内置自动部署文件：

- 工作流：[.github/workflows/deploy.yml](/d:/web/new-website/.github/workflows/deploy.yml)
- 服务器部署脚本：[scripts/deploy.sh](/d:/web/new-website/scripts/deploy.sh)

实现方式是：

1. 你 `git push` 到 `main` 或 `master`
2. GitHub Actions 自动触发
3. Actions 通过 SSH 登录服务器
4. 服务器执行 `git pull`
5. 自动执行 `docker compose up -d --build`

### 服务器首次准备

先在服务器上完成一次初始化：

```bash
mkdir -p /opt/new-website
git clone <你的仓库地址> /opt/new-website
cd /opt/new-website
docker compose up -d --build
```

### GitHub Secrets 配置

你需要在 GitHub 仓库的 `Settings > Secrets and variables > Actions` 中添加这些 Secrets：

- `SERVER_HOST`
  你的服务器 IP 或域名
- `SERVER_PORT`
  SSH 端口，默认一般是 `22`
- `SERVER_USER`
  服务器登录用户，例如 `root` 或 `ubuntu`
- `SERVER_SSH_KEY`
  用于登录服务器的私钥内容
- `SERVER_APP_DIR`
  服务器项目目录，例如 `/opt/new-website`
- `SERVER_APP_BRANCH`
  自动部署分支，例如 `main`

### 服务器 SSH 公钥配置

把和 `SERVER_SSH_KEY` 对应的公钥加入服务器：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "<你的公钥内容>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 自动部署脚本做了什么

服务器上的部署脚本会自动执行：

```bash
git fetch --all --prune
git checkout <部署分支>
git pull --ff-only origin <部署分支>
docker compose up -d --build
```

### 手动触发

除了推送触发，这个工作流也支持在 GitHub Actions 页面手动点 `Run workflow`。

### 4. 放行防火墙端口

如果服务器开启了防火墙，需要放行 80 端口：

```bash
sudo ufw allow 80/tcp
```

如果你希望直接映射到 8080，可以把 `docker-compose.yml` 里的端口改成：

```yaml
ports:
  - "8080:80"
```

然后访问：

```text
http://你的服务器IP:8080
```

## 常用运维命令

查看容器状态：

```bash
docker ps
```

查看日志：

```bash
docker logs -f new-website
```

重建并更新：

```bash
docker compose up -d --build
```

停止并删除容器：

```bash
docker compose down
```

## 反向代理说明

如果后续你准备把它挂到域名下，并且由 Nginx、宝塔、Caddy 或 Traefik 统一转发，只需要把容器端口保留为 `80`，外层代理到这个容器即可。
