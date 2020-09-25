/**
 * OUS expects that output formats be provided in the form of file
 * extensions, this is a map between UMM-S values and their respective extensions
 */
export const ousFormatMapping = {
  'NETCDF-3': 'nc',
  'NETCDF-4': 'nc4',
  BINARY: 'dods',
  ASCII: 'ascii'
}

/**
 * Harmony expects that output formats be provided in the form of mimetypes,
 * this is a map between UMM-S values and their respective mimetypes
 */
export const harmonyFormatMapping = {
  'NETCDF-4': 'application/x-netcdf4',
  GEOTIFF: 'image/tiff',
  GIF: 'image/gif',
  PNG: 'image/png',
  'Shapefile+zip': 'application/shapefile+zip',
  ZARR: 'application/x-zarr'
}
