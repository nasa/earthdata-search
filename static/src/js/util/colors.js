export const colors = {
  green: '#2ECC71',
  blue: '#3498DB',
  orange: '#E67E22',
  red: '#E74C3C',
  purple: '#9B59B6'
}

export const lightColors = {
  green: 'rgb(46, 204, 113, 0.5)',
  blue: 'rgb(52, 152, 219, 0.5)',
  orange: 'rgb(230, 126, 34, 0.5)',
  red: 'rgb(231, 76, 60, 0.5)',
  purple: 'rgb(155, 89, 182, 0.5)'
}

/**
 * Returns a color by its index. If the color is out of the range of values, it will loop repeat colors.
 * @param {Number} index The index for the color.
 * @param {Boolean} lighten A boolean designating if the lighter version of the color should be used.
 * @returns {String} A color hex value for the index.
 */
export const getColorByIndex = (index, lighten) => {
  if (lighten) return Object.values(lightColors)[index % Object.keys(lightColors).length]
  return Object.values(colors)[index % Object.keys(colors).length]
}

export default colors
