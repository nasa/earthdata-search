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
