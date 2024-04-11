const config = [
  ['CALIPSO', 'CALIPSO', 'orbit', 'path'],
  ['MISR', 'MISR', 'path', 'block'],
  ['MODIS Tile EASE', 'MODIS EASE Grid', 'h', 'v'],
  ['MODIS Tile SIN', 'MODIS Sinusoidal', 'h', 'v'],
  ['WELD ALASKA Tile', 'WELD ALASKA Tile', 'h', 'v'],
  ['WELD CONUS Tile', 'WELD CONUS Tile', 'h', 'v'],
  ['WRS-1', 'WRS-1 (Landsat 1-3)', 'path', 'row'],
  ['WRS-2', 'WRS-2 (Landsat 4+)', 'path', 'row'],
  ['Military Grid Reference System', 'Military Grid Reference System', 'h', 'v']
]

export const availableSystems = config.map((item) => {
  const [
    name,
    label,
    axis0label,
    axis1label
  ] = item

  return {
    name,
    label,
    axis0label,
    axis1label
  }
})

export const findGridByName = (name) => availableSystems.find((grid) => grid.name === name)
