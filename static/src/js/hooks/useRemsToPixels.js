import { useEffect, useState } from 'react'

import { convertRemsToPixels } from '../util/convertRemsToPixels'

/**
 * @typedef {Object} UseRemToPixelsHookData
 * @property {Number} remInPixels - The current value of a rem in pixels.
 */

/**
 * Returns the current size of a rem in pixels. This happens dynamically to account for
 * the body font size changing at various form factors
 * @returns {UseRemToPixelsHookData} - The hook data.
 */
export const useRemsToPixels = () => {
  const [remInPixels, setRemInPixels] = useState(convertRemsToPixels(1))

  // After a resize has happened, set the current size of rems in pixels.
  const updateRemInPixels = () => requestAnimationFrame(() => {
    setRemInPixels(convertRemsToPixels(1))
  })

  useEffect(() => {
    window.addEventListener('resize', updateRemInPixels)
    return () => window.removeEventListener('resize', updateRemInPixels)
  }, [])

  return {
    remInPixels
  }
}
