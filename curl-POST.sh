#!/usr/bin/env bash

#
# Insert services manually into https://app.kth.se/pipeline/
#
# Configurations are documented here: https://gita.sys.kth.se/Infosys/cellus-registry/blob/master/HOW-TO-CONFIGURE.md
#

#
# Where is the service run?
#
# RUNS_WHERE='on-prem'
# RUNS_WHERE='active'
# RUNS_WHERE='integral'
# RUNS_WHERE='saas'

curl --request POST --data \
'{
  "applicationName": "webmail",
  "version": "1.0.0",
  "cluster": "on-prem",
  "applicationUrl": "https://webmail.kth.se",
  "monitorUrl": "https://webmail.kth.se/owa/auth/logon.aspx",
  "monitorPattern": "Outlook",
  "importance": "high",
  "publicNameSwedish": "KTH Webmail",
  "publicNameEnglish": "KTH Webmail",
  "descriptionSwedish": "Webbklient för att komma åt KTH majl och kalender från webbläsaren.",
  "descriptionEnglish": "Web client for accessing KTH mail and calender from a web browser.",
  "team": "ita-ops",
  "publicUserDocumentationUrl": "https://www.kth.se/student/kth-it-support/work-online/email/kth-webmail-1.603671"
}' \
--silent \
--header "api_key: $API_KEY_WRITE"  \
--header "Content-Type: application/json" \
https://api-r.referens.sys.kth.se/api/pipeline/v1/latest/on-prem


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
# https://api.kth.se/api/pipeline/v1/latest/on-prem 