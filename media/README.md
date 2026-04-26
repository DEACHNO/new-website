把网站图片素材放到这个目录。

建议后续统一从这里维护这些图片：

- 头部 Logo
- 首页首屏背景图
- 资讯中心首屏背景图
- 服务项目介绍的 3 张图片

接口配置文件是：

- `data/site-assets.json`

图片访问路径统一写成：

- `/media/logo.png`
- `/media/home-hero.jpg`
- `/media/news-hero.jpg`
- `/media/service-booking.jpg`
- `/media/service-customs.jpg`
- `/media/service-warehouse.jpg`

维护步骤：

1. 把图片上传到本目录
2. 修改 `data/site-assets.json` 中对应的 `imageUrl` 或 `backgroundImageUrl`
3. 重新执行 `docker compose up -d --build`
