# new-website Docker 部署

这个项目是纯静态前端页面，已经改造成可以直接通过 Docker 和 Nginx 部署，同时提供了 PDF 列表接口和固定下载路径，方便后续维护。

## 目录说明

- `Dockerfile`：构建静态站点镜像
- `docker-compose.yml`：本地或服务器一键启动
- `nginx/default.conf`：Nginx 站点配置
- `data/notices.json`：资讯中心 PDF 列表接口数据源
- `downloads/`：PDF 文件目录

## PDF 接口与下载地址

前端现在不是把 PDF 列表写死在代码里，而是通过接口读取：

```text
GET /api/notices
```

这个接口实际返回的是：

```text
/data/notices.json
```

单个 PDF 的下载路径统一放在：

```text
/downloads/<文件名>.pdf
```

例如：

```text
/downloads/2026-04-shanghai.pdf
```

## 如何维护 PDF

后续你只需要做两件事：

1. 把 PDF 文件上传到 `downloads/` 目录
2. 修改 `data/notices.json`

`data/notices.json` 示例：

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

字段说明：

- `id`：唯一标识，便于管理
- `title`：页面展示标题
- `updatedAt`：更新时间
- `fileName`：下载文件名
- `downloadUrl`：实际下载地址

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
