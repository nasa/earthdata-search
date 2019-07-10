const config = [
  ['CALIPSO', 'CALIPSO', 'orbit', 1, 75000, 'path', 1, 233],
  ['MISR', 'MISR', 'path', 1, 233, 'block', 1, 180],
  ['MODIS Tile EASE', 'MODIS EASE Grid', 'h', 0, 18, 'v', 0, 38],
  ['MODIS Tile SIN', 'MODIS Sinusoidal', 'h', 0, 35, 'v', 0, 17],
  ['WELD ALASKA Tile', 'WELD ALASKA Tile', 'h', 0, 16, 'v', 0, 13],
  ['WELD CONUS Tile', 'WELD CONUS Tile', 'h', 0, 32, 'v', 0, 21],
  ['WRS-1', 'WRS-1 (Landsat 1-3)', 'path', 1, 251, 'row', 1, 248],
  ['WRS-2', 'WRS-2 (Landsat 4+)', 'path', 1, 233, 'row', 1, 248]
]

export const availableSystems = config.map((item) => {
  const [
    name,
    label,
    axis0label,
    axis0min,
    axis0max,
    axis1label,
    axis1min,
    axis1max
  ] = item

  return {
    name,
    label,
    axis0label,
    axis0min,
    axis0max,
    axis1label,
    axis1min,
    axis1max
  }
})

export const findGridByName = name => availableSystems.find(grid => grid.name === name)
