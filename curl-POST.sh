#!/usr/bin/env bash

curl --request POST --data \
'{
    "applicationName" : "cortina",
    "cluster" : "on-prem",
    "version" : "10.0.14-fbea0b6",
    "importance" : "high",
    "publicNameEnglish" : "KTH Websites (CMS)",
    "applicationUrl" : "https://www.kth.se/",
    "monitorUrl" : "https://www.kth.se/_monitor",
    "team" : "team-kth-webb"
}' \
--silent \
--header "api_key: $API_KEY_WRITE"  \
--header "Content-Type: application/json" \
https://api.kth.se/api/pipeline/v1/latest/on-prem | jq

