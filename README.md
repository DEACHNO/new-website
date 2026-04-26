# new-website

仓库地址：

```text
https://github.com/DEACHNO/new-website
```

这是一个静态网站项目，已经支持：

- Docker 部署
- Linux 云服务器部署
- GitHub Actions 自动部署
- PDF 列表数据维护
- 网站图片素材数据维护

## 项目结构

- `index.html`：页面入口
- `script.js`：前端逻辑
- `styles.css`：页面样式
- `data/notices.json`：资讯中心 PDF 列表数据
- `data/site-assets.json`：网站图片素材配置
- `downloads/`：PDF 下载目录
- `media/`：图片素材目录
- `Dockerfile`：容器镜像构建文件
- `docker-compose.yml`：容器编排文件
- `nginx/default.conf`：Nginx 配置
- `.github/workflows/deploy.yml`：GitHub 自动部署工作流
- `scripts/deploy.sh`：服务器更新脚本

## 本地运行

如果只是本地预览静态页面，可以直接用任意静态服务器。

例如使用 VS Code Live Server、Vite Preview 或任意 HTTP 服务都可以。

如果要用 Docker 本地运行：

```bash
docker build -t new-website:latest .
docker run -d --name new-website -p 8080:80 --restart unless-stopped new-website:latest
```

打开：

```text
http://127.0.0.1:8080
```

也可以直接使用 Compose：

```bash
docker compose up -d --build
```

停止：

```bash
docker compose down
```

## 数据接口

### PDF 列表接口

```text
GET /api/notices
```

本地静态运行时会自动回退读取：

```text
/data/notices.json
```

### 网站图片素材接口

```text
GET /api/site-assets
```

本地静态运行时会自动回退读取：

```text
/data/site-assets.json
```

## 如何维护 PDF

1. 把 PDF 放到 `downloads/`
2. 更新 `data/notices.json`

示例：

```json
{
  "items": [
    {
      "id": "2026-05-shanghai",
      "title": "2026年5月 上海港 船期表",
      "updatedAt": "2026-04-24 09:32",
      "fileName": "2026-05-shanghai.pdf",
      "downloadUrl": "/downloads/2026-05-shanghai.pdf"
    }
  ]
}
```

## 如何维护图片素材

1. 把图片放到 `media/`
2. 更新 `data/site-assets.json`

示例：

```json
{
  "homeHero": {
    "title": "专业成就可能",
    "subtitle": "精准安排每一段航程，连接你的全球交付计划。",
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
    }
  }
}
```

## Linux 服务器首次部署

以下示例以 Ubuntu / Debian 为例。

### 1. 安装 Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. 拉取项目

```bash
mkdir -p /opt/new-website
git clone https://github.com/DEACHNO/new-website.git /opt/new-website
cd /opt/new-website
```

### 3. 启动项目

```bash
docker compose up -d --build
```

### 4. 查看状态

```bash
docker ps
docker logs -f new-website
```

### 5. 放行端口

如果服务器开启了防火墙：

```bash
sudo ufw allow 80/tcp
```

浏览器访问：

```text
http://你的服务器IP
```

如果你不想占用 80 端口，可以修改 `docker-compose.yml`：

```yaml
ports:
  - "8080:80"
```

然后访问：

```text
http://你的服务器IP:8080
```

## 服务器手动更新指令

以后每次你修改代码并推送后，如果想手动到服务器更新，可以执行：

```bash
cd /opt/new-website
git pull --ff-only origin main
docker compose up -d --build
```

如果你的默认分支不是 `main`，把上面的 `main` 改成实际分支名。

## Git Push 后自动部署

项目已经内置：

- GitHub Actions 工作流：`.github/workflows/deploy.yml`
- 服务器部署脚本：`scripts/deploy.sh`

自动部署流程：

1. 你推送代码到 `main` 或 `master`
2. GitHub Actions 自动触发
3. Actions 通过 SSH 登录服务器
4. 服务器执行 `git pull`
5. 服务器执行 `docker compose up -d --build`

### GitHub 仓库 Secrets 配置

到这里配置：

```text
GitHub 仓库 -> Settings -> Secrets and variables -> Actions
```

新增这些 Secrets：

- `SERVER_HOST`：服务器 IP 或域名
- `SERVER_PORT`：SSH 端口，通常是 `22`
- `SERVER_USER`：服务器用户，例如 `root` 或 `ubuntu`
- `SERVER_SSH_KEY`：服务器 SSH 私钥内容
- `SERVER_APP_DIR`：项目部署目录，例如 `/opt/new-website`
- `SERVER_APP_BRANCH`：部署分支，例如 `main`

### 服务器 SSH 公钥配置

把和 `SERVER_SSH_KEY` 对应的公钥加入服务器：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "<你的公钥内容>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 服务器需要先初始化一次

自动部署生效前，服务器上至少要先 clone 一次仓库：

```bash
mkdir -p /opt/new-website
git clone https://github.com/DEACHNO/new-website.git /opt/new-website
cd /opt/new-website
docker compose up -d --build
```

### 自动部署脚本实际执行内容

脚本等价于：

```bash
cd /opt/new-website
git fetch --all --prune
git checkout main
git pull --ff-only origin main
docker compose up -d --build
```

### 手动触发工作流

除了 `git push` 触发，也可以在 GitHub Actions 页面手动点击：

```text
Run workflow
```

## 常用命令

查看运行中的容器：

```bash
docker ps
```

查看日志：

```bash
docker logs -f new-website
```

重建更新：

```bash
docker compose up -d --build
```

停止容器：

```bash
docker compose down
```

## 反向代理

如果后续你要挂域名，可以让外层 Nginx / 宝塔 / Caddy 反向代理到这个容器。

例如容器监听 80，则外层代理到：

```text
http://127.0.0.1:80
```

如果你改成了 `8080:80`，则代理到：

```text
http://127.0.0.1:8080
```
