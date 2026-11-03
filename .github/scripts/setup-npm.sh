#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"
if [[ -f .npm-version ]]; then
  npm_version="$(cat .npm-version)"
else
  npm_version="$(node -p "require('./package.json').packageManager.slice(4)")"
fi
[[ "$npm_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "Expected an exact npm version" >&2; exit 1; }
config=(--min-release-age=30)
if [[ -f .npmrc ]]; then
  config+=(--userconfig "$repo_root/.npmrc")
fi
npm install --global --ignore-scripts "${config[@]}" "npm@$npm_version"
[[ "$(npm --version)" == "$npm_version" ]]
