/**
 * Sleep for the given number of seconds
 * @param {number} seconds - time in seconds
 * @returns {Promise<undefined>}
*/
export default function sleep(seconds) {
  const ms = seconds * 1000
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
