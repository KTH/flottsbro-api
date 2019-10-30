#!/usr/bin/env bash

curl -s -S  \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "http://localhost:3001/api/pipeline/v1/latest/active/innovation-api" | jq


#curl -s -S  \
#     --header "api_key: $API_KEY_READ" \
#     --header "Accept: application/json" \
#     "http://localhost:3001/api/pipeline/v1/monitor/active/https%3A%2F%2Fapp.kth.se%2Fkth-azure-app%2F_monitor" | jq
