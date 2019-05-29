# Flottsbro-API
## Restful API for information about services.


### List information about a cluster or production

`curl --header "api_key: $API_KEY_READ" https://api.kth.se/api/pipeline/v1/latest/stage/`

`curl --header "api_key: $API_KEY_READ" https://api.kth.se/api/pipeline/v1/latest/integral/`

`curl --header "api_key: $API_KEY_READ" https://api.kth.se/api/pipeline/v1/latest/on-prem/`

### All services in environment types classified as production.

`curl --header "api_key: $API_KEY_READ" https://api.kth.se/api/pipeline/v1/latest/production`

### Information about a service.

`curl --header "api_key: $API_KEY_READ" https://api.kth.se/api/pipeline/v1/latest/production/cortina`

### Information about a service based on path.

`curl --header 'Accept: application/json' --header 'api_key: $API_KEY_READ' 'localhost:3001/api/pipeline/v1/monitor/active/https%3A%2F%2Fapp.kth.se%2Fkopps%2F_monitor_core' | jq`


### Add a deployment/service to database
```
curl --request POST --data \
'{
    "applicationName" : "cortina",
    "cluster" : "on-prem",
    "version" : "1.2.3",
    "importance" : "high",
    "publicNameEnglish" : "KTH CMS",
    "applicationUrl" : "https://www.kth.se/",
    "monitorUrl" : "https://www.kth.se/_monitor",
    "team" : "team-kth-webb"
}' \
--silent \
--header "api_key: $API_KEY_WRITE"  \
--header "Content-Type: application/json" \
https://api.kth.se/api/pipeline/v1/latest/on-prem

```

