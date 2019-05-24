#!/usr/bin/env bash

curl  -s -S \
     --header "api_key: $API_KEY_WRITE" \
     --header "Content-Type: application/json" \
     -X POST -d '{
        "applicationName" : "kth-azure-app",
        "cluster" : "test-cluster",
        "version" : "2.10.344_99bf09f",
        "imageName" : "kth-azure-app",
        "applicationPath" : "/kth-azure-app/",
        "created" : "1550835623.0807972",
        "slackChannels" : "#team-pipeline-build,#pipeline-logs",
        "monitorPattern" : "test-cluster",
        "importance" : "medium",
        "publicNameSwedish" : "Continuous delivery referens applikation",
        "publicNameEnglish" : "Continuous Delivery Reference Application",
        "descriptionSwedish" : "Referens applikation för KTH:s Docker kluster i Azure. Om denna tjänst har diftsörning har hela klustret problem.",
        "descriptionEnglish" : "Reference application for KTHs Docker clusters.",
        "detectifyProfileTokens" : "1bc26e2de26f1af4c73d8d76c89e496d",
        "testAccessibility" : "true",
        "accessibilityUrls" : "https://www.kth.se,https://www.google.com",
        "applicationUrl" : "https://app.kth.se/kth-azure-app/",
        "monitorUrl" : "https://app.kth.se/kth-azure-app/_monitor",
        "friendlyName" : "Continuous Delivery Reference Application"
     }' \
     localhost:3001/api/pipeline/v1/latest/test-cluster | jq

curl  -s -S \
     --header "api_key: $API_KEY_WRITE" \
     --header "Content-Type: application/json" \
     -X POST -d '{
    "applicationName" : "logspout-gelf",
    "cluster" : "test-cluster",
    "version" : "87",
    "imageName" : "logspout-gelf-tls",
    "applicationPath" : null,
    "created" : "1554386577.8160307",
    "slackChannels" : "#team-pipeline-build",
    "importance" : "high",
    "publicNameEnglish" : "Continuous Delivery Log Router",
    "publicNameSwedish" : "Continuous Delivery Log Router",
    "descriptionSwedish" : "Streamar Docker loggar till Graylog.",
    "descriptionEnglish" : "Streams Docker container logs to Graylog.",
    "applicationUrl" : "",
    "monitorUrl" : "/_monitor",
    "friendlyName" : "Continuous Delivery Log Router",
    "monitorPattern" : "",
    "team" : "team-pipeline"
}' \
     localhost:3001/api/pipeline/v1/latest/test-cluster | jq

