#!/bin/bash

info() { printf "\033[1;31m\n   %s\033[0;0m$@\n\n";  }
error() { printf "\033[0;31m\n • $@\033[0;0m"; }
passed() { printf "\033[0;32m • $@\033[0;0m\n"; }

#
# Path to the Cisco vpn client.
#
if [ -z "$URL_PREFIX" ]; then
    URL_PREFIX="http://api:3001/api/pipeline"
    sleep 5s
fi

FAILED=""

#
# Curls a url and tests if the response contains a string.
# If it fails sets FAILED to true.
#
# Usage: expectPathToContain "/_monitor" "active"
#
expectPathToContain() {
    
    ENDPOINT="$1"
    PATTERN="$2"
    TEST_DESCRIPTION="$3"
    
    TEST_URL="$URL_PREFIX$ENDPOINT"

    curl -k -S --max-time 3 $TEST_URL > .curl.log 2>&1
    RESULT=$(cat .curl.log)
    
    if [[ "$RESULT" == *"$PATTERN"* ]]; then
        if [ ! -z "$TEST_DESCRIPTION" ]; then
            passed "$TEST_DESCRIPTION."
        else 
            passed "$TEST_URL contains $PATTERN"
        fi
 
    else
        if [ ! -z "$TEST_DESCRIPTION" ]; then
            error "$TEST_DESCRIPTION"
        fi
        info "'$TEST_URL' does not contain pattern '$PATTERN'."
        
        FAILED="true"
    fi

}

expectJsonToContain() {

    ENDPOINT="$1"
    PATTERN="$2"
    TEST_DESCRIPTION="$3"
    
    TEST_URL="$URL_PREFIX$ENDPOINT"
    
    curl -s -S --header "api_key: $FLOTTSBRO_API_KEY" --header "Accept: application/json" "$TEST_URL" > .curl.log 2>&1
    RESULT=$(cat .curl.log)
    
    if [[ "$RESULT" == *"$PATTERN"* ]]; then
        if [ ! -z "$TEST_DESCRIPTION" ]; then
            passed "$TEST_DESCRIPTION."
        else 
            passed "$TEST_URL contains $PATTERN"
        fi
 
    else
        if [ ! -z "$TEST_DESCRIPTION" ]; then
            error "$TEST_DESCRIPTION"
        fi
        info "'$TEST_URL' does not contain pattern '$PATTERN'."
        
        FAILED="true"
    fi

}

# ---------------- Tests ----------------

echo ""
expectPathToContain "/_monitor" "APPLICATION_STATUS: OK" "Default check APPLICATION_STATUS: OK"
expectJsonToContain "/v1/latest/active/" "kth-azure-app" "Should contain KTH-Azure App in cluster active"
expectJsonToContain "/v1/latest/stage/" "kth-azure-app" "Should contain KTH-Azure App in cluster stage"
expectJsonToContain "/v1/latest/production/" "kth-azure-app" "Should contain KTH-Azure App in production"
expectJsonToContain "/v1/latest/production/?importance=high" "canvas" "Should contain services with importance high like Canvas"
expectJsonToContain "/v1/active/kth-azure-app" "Continuous Delivery Reference Application" "Should contain KTH Azure App"
expectJsonToContain "/v1/latest/reference/" "kth-azure-app" "Should contain KTH-Azure App in reference"
expectJsonToContain "/v1/latest/reference/?importance=high" "kopps" "Should contain services with importance high like kopps"
expectJsonToContain "/v1/stage/kth-azure-app" "Referens applikation" "Should contain get KTH Azure App"

echo ""

# Result
if [[ "$FAILED" != *"true"* ]]; then
    info "All end-to-end tests passed."
    exit 0
else
    echo ""
    exit 1
fi
