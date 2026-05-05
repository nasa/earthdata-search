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
 * this is a map between mimetypes and their respective human readable values
 * TO-DO, EDSC-4661 these values will be coming from capabilities doc version 4
 */
export const harmonyFormatMapping = {
  'application/x-netcdf4': 'X-NETCDF-4',
  'application/netcdf4': 'NETCDF-4',
  'application/x-netcdf4;profile=opendap_url': 'X-NETCDF-4 (OPeNDAP URL)',
  'application/netcdf': 'NETCDF',
  'application/x-hdf': 'X-HDF',
  'image/tiff': 'GEOTIFF',
  'image/gif': 'GIF',
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'text/csv': 'CSV',
  'application/shapefile+zip': 'Shapefile+zip',
  'application/x-zarr': 'X-ZARR'
}
