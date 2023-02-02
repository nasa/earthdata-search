import url from 'url'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Create and return a string representing a script users can use to download links from CMR
 * @param {Array} granuleLinks Links to include in the download script
 * @param {Object} retrievalCollection The retrieval collection data from the database
 */
export const generateDownloadScript = (granuleLinks, retrievalCollection, earthdataEnvironment) => {
  const {
    collection_metadata: collectionMetadata = {},
    urs_id: username
  } = retrievalCollection

  const { isCSDA = false } = collectionMetadata

  // The script uses a single link to ensure the files are accessible before
  // it attempts to download all of the files
  const [firstGranuleLink] = granuleLinks

  const { edlHost, csdaHost } = getEarthdataConfig(earthdataEnvironment)

  let authHost = url.parse(edlHost).host

  if (isCSDA) {
    authHost = url.parse(csdaHost).host
  }

  return `#!/bin/bash

GREP_OPTIONS=''

cookiejar=$(mktemp cookies.XXXXXXXXXX)
netrc=$(mktemp netrc.XXXXXXXXXX)
chmod 0600 "$cookiejar" "$netrc"
function finish {
  rm -rf "$cookiejar" "$netrc"
}

trap finish EXIT
WGETRC="$wgetrc"

prompt_credentials() {
    echo "Enter your Earthdata Login or other provider supplied credentials"
    read -p "Username (${username}): " username
    username=$\{username:-${username}}
    read -s -p "Password: " password
    echo "machine ${authHost} login $username password $password" >> $netrc
    echo
}

exit_with_error() {
    echo
    echo "Unable to Retrieve Data"
    echo
    echo $1
    echo
    echo "${firstGranuleLink}"
    echo
    exit 1
}

prompt_credentials
  detect_app_approval() {
    approved=\`curl -s -b "$cookiejar" -c "$cookiejar" -L --max-redirs 5 --netrc-file "$netrc" ${firstGranuleLink} -w '\\n%{http_code}' | tail  -1\`
    if [ "$approved" -ne "200" ] && [ "$approved" -ne "301" ] && [ "$approved" -ne "302" ]; then
        # User didn't approve the app. Direct users to approve the app in URS
        exit_with_error "Please ensure that you have authorized the remote application by visiting the link below "
    fi
}

setup_auth_curl() {
    # Firstly, check if it require URS authentication
    status=$(curl -s -z "$(date)" -w '\\n%{http_code}' ${firstGranuleLink} | tail -1)
    if [[ "$status" -ne "200" && "$status" -ne "304" ]]; then
        # URS authentication is required. Now further check if the application/remote service is approved.
        detect_app_approval
    fi
}

setup_auth_wget() {
    # The safest way to auth via curl is netrc. Note: there's no checking or feedback
    # if login is unsuccessful
    touch ~/.netrc
    chmod 0600 ~/.netrc
    credentials=$(grep 'machine ${authHost}' ~/.netrc)
    if [ -z "$credentials" ]; then
        cat "$netrc" >> ~/.netrc
    fi
}

fetch_urls() {
  if command -v curl >/dev/null 2>&1; then
      setup_auth_curl
      while read -r line; do
        # Get everything after the last '/'
        filename="$\{line##*/}"

        # Strip everything after '?'
        stripped_query_params="$\{filename%%\\?*}"

        curl -f -b "$cookiejar" -c "$cookiejar" -L --netrc-file "$netrc" -g -o $stripped_query_params -- $line && echo || exit_with_error "Command failed with error. Please retrieve the data manually."
      done;
  elif command -v wget >/dev/null 2>&1; then
      # We can't use wget to poke provider server to get info whether or not URS was integrated without download at least one of the files.
      echo
      echo "WARNING: Can't find curl, use wget instead."
      echo "WARNING: Script may not correctly identify Earthdata Login integrations."
      echo
      setup_auth_wget
      while read -r line; do
        # Get everything after the last '/'
        filename="$\{line##*/}"

        # Strip everything after '?'
        stripped_query_params="$\{filename%%\\?*}"

        wget --load-cookies "$cookiejar" --save-cookies "$cookiejar" --output-document $stripped_query_params --keep-session-cookies -- $line && echo || exit_with_error "Command failed with error. Please retrieve the data manually."
      done;
  else
      exit_with_error "Error: Could not find a command-line downloader.  Please install curl or wget"
  fi
}

fetch_urls <<'EDSCEOF'
${granuleLinks.join('\n')}
EDSCEOF`
}

export default generateDownloadScript
