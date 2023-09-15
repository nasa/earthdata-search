/**
 * Retrieve all colormaps metadata from Redux
 * @param {Object} state Current state of Redux
 */
export const getColormapsMetadata = (state) => {
    const { metadata = {} } = state
    const { colormaps = {} } = metadata
  
    return colormaps
  }
  