#!/usr/bin/env bash

# curl -S  \
#      --header "api_key: $API_KEY_READ" \
#      --header "Accept: application/json" \
#      "https://api.kth.se/api/pipeline/v1/search/active/%2Fkth-azure-app%2F_monitor" | jq

# curl -s -S  \
#      --header "api_key: $API_KEY_READ" \
#      --header "Accept: application/json" \
#      "https://api.kth.se/api/pipeline/v1/latest/active/innovation-api" | jq

# curl -s -S  \
#      --header "api_key: $API_KEY_READ" \
#      --header "Accept: application/json" \
#      "https://api-r.referens.sys.kth.se/api/pipeline/v1/monitor/stage/https%3A%2F%2Fapp.kth.se%2Fkth-azure-app%2F_monitor" | jq


curl -S --HTTP1.1 \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "https://api-r.referens.sys.kth.se/api/pipeline/v1/latest/reference" | jq

