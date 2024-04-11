import { getPanelSizeMap } from './getPanelSizeMap'

/**
 * Given the width of the resizable overlay panel in pixels, returns a
 * a string with the current size.
 * @param {Number} width The width of the panel.
 * @returns {(String|Null)} A string representing the current size, or null.
 */
export const getActivePanelSize = (width) => {
  const panelSizeObj = getPanelSizeMap(width)

  switch (true) {
    case panelSizeObj.xl:
      return 'xl'
    case panelSizeObj.lg:
      return 'lg'
    case panelSizeObj.md:
      return 'md'
    case panelSizeObj.sm:
      return 'sm'
    case panelSizeObj.xs:
      return 'xs'
    default:
      break
  }

  return null
}
