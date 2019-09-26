export const colors = {
  green: '#2ECC71',
  blue: '#3498DB',
  orange: '#E67E22',
  red: '#E74C3C',
  purple: '#9B59B6'
}

/**
 * Returns a color by its index. If the color is out of the range of values, it will loop repeat colors.
 * @param {number} index The index for the color.
 * @param {object} colors An object of color key value pairs.
 * @returns {object} A color hex value for the index.
 */
export const getColorByIndex = index => (
  Object.values(colors)[index % Object.keys(colors).length]
)

export default colors
