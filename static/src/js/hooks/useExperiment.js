import { useEffect, useState } from 'react'

/**
 * Takes a Google Optimize experiment id, and if a valid variant is found for that experiment, returns
 * the variant id assigned by Google Optimize.
 * @returns {String} - The experiment id. If undefined is returned, no valid experiment/variant was found
 */
const useExperiment = (experimentId) => {
  const [variant, setVariant] = useState()

  useEffect(() => {
    // If the variant has already been defined, do not attempt to get the value again
    if (variant) return

    (async () => {
      // If the data layer is available, attempt to activate Google Optimize.
      if (window.dataLayer) {
        await window.dataLayer.push({ event: 'optimize.activate' })
      }

      // Set an interval to check for Google Optimize until it is available. Once it is available, call the
      // provided `get` function to retrieve a variant id for the current session.
      const intervalId = setInterval(() => {
        if (window.google_optimize !== undefined) {
          const variant = window.google_optimize.get(experimentId)

          if (!variant && process.env.NODE_ENV === 'development') {
            console.warn(`No Google Optimize variant found for experiment "${experimentId}". Make sure you are using a valid Experiment ID.`)
          }

          // Set the returned state to the current variant id and stop the interval.
          setVariant(variant)
          clearInterval(intervalId)
        }
      }, 100)
    })()
  })

  return variant
}

export default useExperiment
