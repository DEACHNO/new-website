#!/usr/bin/env sh
set -eu

APP_DIR="${APP_DIR:-/opt/new-website}"
APP_BRANCH="${APP_BRANCH:-main}"

echo "[deploy] app dir: ${APP_DIR}"
echo "[deploy] branch: ${APP_BRANCH}"

if [ ! -d "${APP_DIR}" ]; then
  echo "[deploy] directory not found: ${APP_DIR}" >&2
  exit 1
fi

cd "${APP_DIR}"

if [ ! -d ".git" ]; then
  echo "[deploy] ${APP_DIR} is not a git repository" >&2
  exit 1
fi

git fetch --all --prune

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "${CURRENT_BRANCH}" != "${APP_BRANCH}" ]; then
  git checkout "${APP_BRANCH}"
fi

git pull --ff-only origin "${APP_BRANCH}"

if docker compose version >/dev/null 2>&1; then
  docker compose up -d --build
elif command -v docker-compose >/dev/null 2>&1; then
  docker-compose up -d --build
else
  echo "[deploy] docker compose is not installed" >&2
  exit 1
fi

echo "[deploy] deployment completed"
