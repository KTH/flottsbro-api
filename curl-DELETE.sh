#!/usr/bin/env bash


curl -s -S  \
     -X DELETE \
     --header "api_key: $API_KEY_WRITE" \
     --header "Accept: application/json" \
     "http://localhost:3001/api/pipeline/v1/active/innovation-web" | jq