#!/usr/bin/env bash
# Usage: ./run-test.sh get.ts

set -a            # auto-export every variable set from here on
source .env.local # load our secrets (e.g. API_TOKEN) as env vars
set +a            # stop auto-exporting, back to normal

k6 run "$1"       # run the k6 script passed as the first argument
