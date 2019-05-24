#!/usr/bin/env bash

echo "--------------------------- ON PREM ---------------------------"

curl  -s -S \
     --header "api_key: $API_KEY_READ" \
     --header "Content-Type: application/json" \
     "localhost:3001/api/pipeline/v1/latest/on-prem" | jq


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

echo "--------------------------- TEST-CLUSTER ---------------------------"

curl  -s -S \
     --header "api_key: $API_KEY_READ" \
     --header "Content-Type: application/json" \
     "localhost:3001/api/pipeline/v1/latest/test-cluster" | jq


