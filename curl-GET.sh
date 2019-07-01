#!/usr/bin/env bash

# echo "--------------------------- ON PREM ---------------------------"

# curl  -s -S \
#      --header "api_key: $API_KEY_READ" \
#      --header "Content-Type: application/json" \
#      "localhost:3001/api/pipeline/v1/latest/on-prem" | jq


echo ""
echo ""
echo "---------------------------- STAGE ----------------------------"

curl  -s -S \
     --header "api_key: $API_KEY_READ" \
     --header "Content-Type: application/json" \
     "localhost:3001/api/pipeline/v1/latest/stage" | jq

# echo ""
# echo ""
# echo "---------------------------- ACTIVE ----------------------------"

# curl  -s -S \
#      --header "api_key: $API_KEY_READ" \
#      --header "Content-Type: application/json" \
#      "localhost:3001/api/pipeline/v1/latest/active" | jq


curl -s -S  \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "localhost:3001/api/pipeline/v1/monitor/active/https%3A%2F%2Fapp.kth.se%2Fkopps%2F_monitor_core" | jq