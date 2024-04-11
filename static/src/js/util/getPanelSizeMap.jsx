/**
 * @typedef {Object} PanelSizeMap
 * @property {Boolean} xs - Boolean flag for size 'xs'
 * @property {Boolean} sm - Boolean flag for size 'sm'
 * @property {Boolean} md - Boolean flag for size 'md'
 * @property {Boolean} lg - Boolean flag for size 'lg'
 * @property {Boolean} xl - Boolean flag for size 'xl'
 */

/**
 * Given the width of the resizable overlay panel in pixels, returns a
 * map to determine the current size of the panel
 * @param {Number} width The width of the panel.
 * @returns {PanelSizeMap} A map of panel sizes.
 */
export const getPanelSizeMap = (width) => ({
  xs: true,
  sm: width >= 500,
  600: width >= 600,
  md: width >= 700,
  lg: width >= 900,
  xl: width >= 1100
})
