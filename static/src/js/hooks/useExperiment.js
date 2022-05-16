import { useEffect, useState } from 'react'

const useExperiment = (experimentId) => {
  const [variant, setVariant] = useState()

  useEffect(() => {
    (async () => {
      if (window.dataLayer) {
        await window.dataLayer.push({ event: 'optimize.activate' })
      }

      const intervalId = setInterval(() => {
        if (window.google_optimize !== undefined) {
          const variant = window.google_optimize.get(experimentId)
          if (!variant) {
            console.warn('No Google Optimize variant found. Make sure you are using a valid Experiment ID.')
          }
          setVariant(variant)
          clearInterval(intervalId)
        }
      }, 100)
    })()
  })

  return variant
}

export default useExperiment
