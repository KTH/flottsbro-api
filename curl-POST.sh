#!/usr/bin/env bash

curl --request POST --data \
'{
    "applicationName" : "social",
    "cluster" : "on-prem",
    "version" : "master-4.29.0-343",
    "created": "1561651200",
    "importance" : "medium",
    "publicNameSwedish" : "Social",
    "publicNameEnglish" : "Social",
    "descriptionSwedish": "Course and programme webs and more",
    "descriptionEnglish": "Kurs och programwebbar",
    "applicationUrl" : "https://www.kth.se/social",
    "monitorPattern": "APPLICATION_STATUS: OK",
    "monitorUrl" : "https://www.kth.se/social/_monitor",
    "team" : "team-e-larande"
}' \
--silent \
--header "api_key: $API_KEY_WRITE"  \
--header "Content-Type: application/json" \
https://api.kth.se/api/pipeline/v1/latest/on-prem | jq

