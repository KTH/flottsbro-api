#!/usr/bin/env bash

echo "--------------------------- ON PREM ---------------------------"

curl  -s -S \
     --header "api_key: $API_KEY_READ" \
     --header "Content-Type: application/json" \
     "localhost:3001/api/pipeline/v1/latest/on-prem" | jq


echo ""
echo ""
echo "---------------------------- INTEGRAL ----------------------------"

curl  -s -S \
    --header "api_key: $API_KEY_READ" \
    --header "Content-Type: application/json" \
    "localhost:3001/api/pipeline/v1/latest/integral" | jq


echo ""
echo ""
echo "---------------------------- STAGE ----------------------------"

curl  -s -S \
     --header "api_key: $API_KEY_READ" \
     --header "Content-Type: application/json" \
     "localhost:3001/api/pipeline/v1/latest/stage" | jq

echo ""
echo ""
echo "---------------------------- ACTIVE ----------------------------"

curl  -s -S \
     --header "api_key: $API_KEY_READ" \
     --header "Content-Type: application/json" \
      "localhost:3001/api/pipeline/v1/latest/active" | jq

echo ""
echo ""
echo "---------------------------- Get by absolute monitor url  ----------------------------"

curl -s -S  \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "https://api.kth.se/api/pipeline/v1/monitor/active/https%3A%2F%2Fapp.kth.se%2Fkth-azure-app%2F_monitor" | jq

echo ""
echo ""
echo "---------------------------- Search by starting path '/kth-azure-app/'  ----------------------------"

curl -s -S  \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "https://api.kth.se/api/pipeline/v1/search/active/%2Fkth-azure-app%2F" | jq



