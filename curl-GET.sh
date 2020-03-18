#!/usr/bin/env bash

#ENDPOINT='https://api.kth.se'
ENDPOINT='http://localhost:3001'

# curl -S  -S \
#      --header "api_key: $API_KEY_READ" \
#      --header "Accept: application/json" \
#      "$ENDPOINT/api/pipeline/v1/search/active/%2Fkth-azure-app%2F_monitor" | jq

# curl -s -S  \
#      --header "api_key: $API_KEY_READ" \
#      --header "Accept: application/json" \
#      "$ENDPOINT/api/pipeline/v1/latest/active/innovation-api" | jq

# curl -s -S  \
#      --header "api_key: $API_KEY_READ" \
#      --header "Accept: application/json" \
#      "$ENDPOINT/api/pipeline/v1/monitor/active/https%3A%2F%2Fapp.kth.se%2Fkth-azure-app%2F_monitor" | jq


# curl -s -S  \
#      --header "api_key: $API_KEY_READ" \
#      --header "Accept: application/json" \
#      "$ENDPOINT/api/pipeline/v1/latest/active/?importance=low" | jq

curl -s -S  \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "$ENDPOINT/api/pipeline/v1/latest/production/?importance=high" | jq
