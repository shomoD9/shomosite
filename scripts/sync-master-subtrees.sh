#!/usr/bin/env bash
# This script is the manual bridge from the private `master` repo into Shomosite.
# It exists separately because the private vault should stay the upstream content
# authority while this repo remains the downstream public renderer. It talks to a
# sparse local clone of `master`, fetches only `prose/` and `product/`, and then
# copies those trees into this repo without touching unrelated files.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SYNC_DIR="${ROOT_DIR}/.sync-cache/master"
REPO_URL="${1:-git@github.com:shomoD9/master.git}"
BRANCH="${2:-main}"

mkdir -p "${ROOT_DIR}/.sync-cache"

if [[ ! -d "${SYNC_DIR}/.git" ]]; then
  # The first clone is sparse from the start so the private vault does not get copied wholesale.
  git clone --filter=blob:none --sparse "${REPO_URL}" "${SYNC_DIR}"
fi

git -C "${SYNC_DIR}" sparse-checkout set prose product
git -C "${SYNC_DIR}" fetch origin "${BRANCH}"
git -C "${SYNC_DIR}" checkout "${BRANCH}"
git -C "${SYNC_DIR}" pull --ff-only origin "${BRANCH}"

mkdir -p "${ROOT_DIR}/prose" "${ROOT_DIR}/product"

# The sync is intentionally non-destructive: new upstream material lands here, but local files are not auto-pruned.
rsync -a "${SYNC_DIR}/prose/" "${ROOT_DIR}/prose/"
rsync -a "${SYNC_DIR}/product/" "${ROOT_DIR}/product/"

printf '\nSynced prose/ and product/ from %s (%s).\n' "${REPO_URL}" "${BRANCH}"
