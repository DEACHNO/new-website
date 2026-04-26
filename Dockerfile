FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY index.html ./index.html
COPY styles.css ./styles.css
COPY script.js ./script.js
COPY data ./data
COPY downloads ./downloads

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
