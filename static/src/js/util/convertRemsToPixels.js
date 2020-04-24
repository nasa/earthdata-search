/**
 * Given the a number in rems, returns that number in pixels relative to the current
 * body font size.
 * @param {Number} rem The number in rems.
 * @returns {Number} The number in pixels.
 */
export const convertRemsToPixels = (rem) => {
  if (!window || !document) return 16
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}
