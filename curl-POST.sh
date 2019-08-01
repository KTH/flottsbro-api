#!/usr/bin/env bash

# curl --request POST --data \
# '{
#     "applicationName" : "social",
#     "cluster" : "on-prem",
#     "version" : "4.29.1-344",
#     "importance" : "medium",
#     "publicNameSwedish" : "Social",
#     "publicNameEnglish" : "Social",
#     "descriptionSwedish": "Course and programme webs and more",
#     "descriptionEnglish": "Kurs och programwebbar",
#     "applicationUrl" : "https://www.kth.se/social",
#     "monitorPattern": "APPLICATION_STATUS: OK",
#     "monitorUrl" : "https://www.kth.se/social/_monitor",
#     "team" : "team-e-larande"
# }' \
# --silent \
# --header "api_key: $API_KEY_WRITE"  \
# --header "Content-Type: application/json" \
# https://api.kth.se/api/pipeline/v1/latest/on-prem | jq


curl --request POST --data \
'{
  "created": 1550835623.0807972,
  "applicationName": "kth-azure-app",
  "cluster": "stage",
  "version": "2.10.344_99bf09f",
  "imageName": "kth-azure-app",
  "applicationUrl": "https://app-r.referens.sys.kth.se/kth-azure-app/",
  "applicationPath": "/kth-azure-app/",
  "monitorUrl": "https://app-r.referens.sys.kth.se/kth-azure-app/_monitor",
  "monitorPattern": "APPLICATION_STATUS: OK",
  "importance": "medium",
  "publicNameSwedish": "Continuous delivery referens applikation",
  "publicNameEnglish": "Continuous Delivery Reference Application",
  "descriptionSwedish": "Referens applikation för KTH:s Docker kluster i Azure. Om denna tjänst har diftsörning har hela klustret problem.",
  "descriptionEnglish": "Reference application for KTHs Docker clusters.",
  "friendlyName": "Continuous Delivery Reference Application"
}' \
--silent \
--header "api_key: $API_KEY_WRITE"  \
--header "Content-Type: application/json" \
localhost:3001/api/pipeline/v1/latest/stage
