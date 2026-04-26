把可下载的 PDF 文件放到这个目录。

当前前端和接口默认会读取这些路径：

- `/downloads/2026-04-shidao-lianyungang-qingdao.pdf`
- `/downloads/2026-04-tianjin-dalian.pdf`
- `/downloads/2026-04-taicang.pdf`
- `/downloads/2026-04-shanghai.pdf`
- `/downloads/2026-04-ningbo-zhapu.pdf`
- `/downloads/2026-03-shanghai.pdf`
- `/downloads/2026-03-shidao-lianyungang-qingdao.pdf`
- `/downloads/2026-03-taicang.pdf`
- `/downloads/2026-03-tianjin-dalian.pdf`
- `/downloads/2026-03-ningbo-zhapu.pdf`

新增或替换 PDF 时：

1. 把 PDF 文件上传到本目录。
2. 修改 `data/notices.json` 中对应记录的 `title`、`updatedAt`、`fileName`、`downloadUrl`。
3. 重新执行 `docker compose up -d --build`。
