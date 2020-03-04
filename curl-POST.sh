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
  "applicationName": "Annual Bibliometric Monitoring",
  "version": "1.0.0",
  "cluster": "on-prem",
  "applicationUrl": "https://www.kth.se/abm",
  "monitorUrl": "https://www.kth.se/abm",
  "monitorPattern": "Since your browser does not support JavaScript",
  "importance": "medium",
  "publicNameSwedish": "Årlig bibliometrisk uppföljning",
  "publicNameEnglish": "Annual Bibliometric Monitoring",
  "descriptionSwedish": "I den årliga bibliometriska uppföljningen (ÅBU) finner du statistik om publicering, citeringar och sampublicering vid KTH.",
  "descriptionEnglish": "The ABM at KTH contains statistics on publication output, citation impact and co-publishing.",
  "friendlyName": "Annual Bibliometric Monitoring",
  "team": "team-abm",
  "publicUserDocumentationUrl": "https://kth-library.github.io/"
}' \
--silent \
--header "api_key: $API_KEY_WRITE"  \
--header "Content-Type: application/json" \
https://api.kth.se/api/pipeline/v1/latest/on-prem