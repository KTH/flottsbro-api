#!/usr/bin/env bash

ENDPOINT='https://api.kth.se'
#ENDPOINT='http://localhost:3001'

echo " - $ENDPOINT/api/pipeline/v1/search/active/%2Fkth-azure-app%2F_monitor"
curl -S  -S \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "$ENDPOINT/api/pipeline/v1/search/active/%2Fkth-azure-app%2F_monitor" | jq

echo ""
echo ""
echo "----------------------------------------------"
echo ""
echo ""

echo " - $ENDPOINT/api/pipeline/v1/latest/active/innovation-api"
curl -s -S  \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "$ENDPOINT/api/pipeline/v1/latest/active/innovation-api" | jq

echo ""
echo ""
echo "----------------------------------------------"
echo ""
echo ""

echo " - $ENDPOINT/api/pipeline/v1/monitor/active/https%3A%2F%2Fapp.kth.se%2Fkth-azure-app%2F_monitor"
curl -s -S  \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "$ENDPOINT/api/pipeline/v1/monitor/active/https%3A%2F%2Fapp.kth.se%2Fkth-azure-app%2F_monitor" | jq

echo ""
echo ""
echo "----------------------------------------------"
echo ""
echo ""

echo " - $ENDPOINT/api/pipeline/v1/latest/production/?importance=low"
curl -s -S  \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "$ENDPOINT/api/pipeline/v1/latest/production/?importance=low" | jq



echo ""
echo ""
echo "----------------------------------------------"
echo ""
echo ""

echo " - $ENDPOINT/api/pipeline/v1/latest/production/?importance=high"
curl -s -S  \
     --header "api_key: $API_KEY_READ" \
     --header "Accept: application/json" \
     "$ENDPOINT/api/pipeline/v1/latest/production/?importance=high" | jq
