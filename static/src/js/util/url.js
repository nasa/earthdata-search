/* eslint-disable import/prefer-default-export */

/**
 * Takes a URL containing a path and query string and returns only the query string
 * @param {string} url - A string containing both a path and query string
 * @return {string} A string containing only query parameter values
 */

export const queryParamsFromUrlString = url => url.split(/[?#]/)[1]
