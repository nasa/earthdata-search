/**
 * @name sleep
 * @param {number} seconds - time in seconds
 * @return Promise<undefined>
 * @description sleep for the given number of seconds
 * @example await sleep(5) // sleep for 5 seconds
*/
export default function sleep(seconds) {
  const ms = seconds * 1000
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
