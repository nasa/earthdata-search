import sleep from './sleep'

/**
 * Attempts to run the function the given number of times.
 * If it throws an error every time, retry will throw the last error.
 * @param {Function} func - function to attempt to run
 * @param {object} options - options object
 * @param {number} options.attempts - number of attempts to try
 * @param {number} options.backoff - base for exponential backoff
 * @returns {Promise<undefined>}
 */
export default async function retry(func, { attempts = 3, backoff = 5 }) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await func()
    } catch (err) {
      if (i === attempts - 1) throw err // last attempt
      else await sleep(backoff ** (i + 1)) // eslint-disable-line no-await-in-loop
    }
  }
  throw Error('Retry failed')
}
