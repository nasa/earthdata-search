export const swodlrToolTips = {
  GranuleExtent: 'There are two sizing options for raster granules: nonoverlapping square (256 km x 128 km). The rectangular granule extent is 64 km longer in along-track on both sides of the granule and can be useful for observing areas of interest near the along-track edges of the nonoverlapping granules without the need to stich sequential granules together.',
  MGRS: 'The Military Grid Reference System (MGRS) defines alphabetic Latitude bands. By default, UTM raster processing uses the MGRS band at the scene center. If a common grid is desired for scenes near each other , the band per scene can be adjusted (+/- 1 band) to allow nearby L@_HR_Raster outputs to be sampled on a common grid. This parameter has no effect if the output grid is not UTM.',
  UTM: 'The universal Transverse Mercator (UTM) projection is divided into 60 local zones 6 wide in Longitude. By default, UTM raster processing uses the UTM zone at the scene center. If a common grid is desired for scenes near each other , the zone per scene can be adjusted (+/- 1 zone)to allow nearby L2_HR_Raster outputs to be sampled on a common grid. This parameter has no effect if the output grid is not UTM.',
  RasterResolution: 'Resolution of the raster sampling grid in units of integer meters UTM grids and integer arc-seconds for latitude-longitude grids.',
  SamplingGridResolution: 'Specifies the type of the raster sampling grid. It can be either a Universal Transverse Mercator (UTM) grid or a geodetic latitude-longitude grid.'
}

export const utmRasterOptions = [
  {
    title: '90',
    value: 90
  },
  {
    title: '120',
    value: 120
  },
  {
    title: '125',
    value: 125
  },
  {
    title: '200',
    value: 200
  },
  {
    title: '250',
    value: 250
  },
  {
    title: '500',
    value: 500
  },
  {
    title: '1000',
    value: 1000
  },
  {
    title: '2500',
    value: 2500
  },
  {
    title: '5000',
    value: 5000
  },
  {
    title: '10000',
    value: 10000
  }
]

export const geoRasterOptions = [
  {
    title: '3',
    value: 3
  },
  {
    title: '4',
    value: 4
  },
  {
    title: '5',
    value: 5
  },
  {
    title: '6',
    value: 6
  },
  {
    title: '8',
    value: 8
  },
  {
    title: '15',
    value: 15
  },
  {
    title: '30',
    value: 30
  },
  {
    title: '60',
    value: 60
  },
  {
    title: '180',
    value: 180
  },
  {
    title: '300',
    value: 300
  }
]

export const maxSwodlrGranuleCount = 10

export const swoldrMoreInfoPage = 'https://swodlr.podaac.earthdatacloud.nasa.gov/about'
