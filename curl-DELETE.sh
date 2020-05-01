#!/usr/bin/env bash


curl -s -S  \
     -X DELETE \
     --header "api_key: $API_KEY_WRITE" \
     --header "Accept: application/json" \
     "https://api.kth.se/api/pipeline/v1/active/office365optin" | jq

