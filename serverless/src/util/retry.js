import sleep from './sleep'

/**
 *
 * @param {Function} func - function to attempt to run
 * @param {object} options - options object
 * @param {number} options.attempts - number of attempts to try
 * @param {number} options.backoff - base for exponential backoff
 * @description attempts to run the function the given number of times.
 * if it throws an error every time, retry will throw the last error
 * @returns
 */
export default async function retry(func, { attempts = 3, backoff = 5 }) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await func()
        } catch (err) {
            if (i === attempts - 1) throw err // last attempt
            else await sleep(Math.pow(backoff, i + 1))
        }
    }
}
