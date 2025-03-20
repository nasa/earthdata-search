import { Collection } from 'ol'
import { MultiPolygon } from 'ol/geom'
import { unByKey } from 'ol/Observable'
import { WMTS } from 'ol/source'
import GeoJSON from 'ol/format/GeoJSON'
import LRUCache from 'ol/structs/LRUCache'
import TileLayer from 'ol/layer/Tile'

import {
  difference,
  featureCollection,
  multiPolygon,
  union
} from '@turf/turf'

import { crsProjections } from './crs'
import { getTileGrid } from './getTileGrid'
import drawOutline from './drawOutline'
import projections from './projections'

const tileCache = new LRUCache(100)
const imageryCache = new LRUCache(100)

// On the prerender event of the imagery tile layer, clip the imagery to the granule geometry
const onTileLayerPrerender = (map, geometry, event) => {
  const ctx = event.context
  ctx.save()
  ctx.beginPath()

  const dpr = window.devicePixelRatio || 1

  // Drawing the outline of the granule, and ctx.clip() will clip the imagery to the granule outline
  drawOutline({
    ctx,
    geometry,
    map,
    scale: dpr
  })

  ctx.clip()
}

// On the postrender event of the imagery tile layer, restore the canvas context
const onTileLayerPostrender = (event) => {
  const ctx = event.context

  ctx.restore()
}

/**
 * Draws the outlines of the granules on the map with the `background` style applied
 * @param {Array} granulesMetadata Granule metadata to draw
 * @param {Object} vectorSource OL Vector Source to draw the granules on
 * @param {String} projectionCode Projection Code for the current map projection
 */
const drawGranuleBackgroundsAndImagery = ({
  granuleImageryLayerGroup,
  granulesMetadata,
  map,
  projectionCode,
  vectorSource
}) => {
  if (!granulesMetadata.length) return

  const granuleImageryLayers = []

  let granulesUnion

  granulesMetadata.forEach((granule, index) => {
    const {
      backgroundStyle,
      collectionId,
      formattedTemporal,
      gibsData,
      granuleId,
      granuleStyle,
      highlightedStyle,
      spatial
    } = granule

    // If the granule has no spatial, return
    if (!spatial) return

    // Create a feature for the current granule based on the granule spatial
    const backgroundFeatures = new GeoJSON({
      dataProjection: crsProjections[projections.geographic],
      featureProjection: crsProjections[projectionCode]
    }).readFeatures(spatial)

    backgroundFeatures.forEach((backgroundFeature) => {
      // Set the index for the feature. This will be used to sort the features by the order we drew them
      backgroundFeature.set('index', index)

      // Save the collectionId and granuleId to the properties
      backgroundFeature.set('collectionId', collectionId)
      backgroundFeature.set('granuleId', granuleId)

      // Set the style for the granule in the properties. This will be read in the postrender event handler
      // to style the outline of the granule correctly.
      backgroundFeature.set('granuleStyle', granuleStyle)
      backgroundFeature.set('highlightedStyle', highlightedStyle)

      backgroundFeature.set('formattedTemporal', formattedTemporal)

      // Set the style for the feature
      backgroundFeature.setStyle(backgroundStyle)

      // Add the feature to the vector source
      vectorSource.addFeature(backgroundFeature)

      // If the granule has no GIBS data, return without drawing imagery
      if (!gibsData) return

      // Get the difference between the union and the current granule geometry
      const geometry = backgroundFeature.getGeometry()
      const turfMultiPolygon = multiPolygon(geometry.getCoordinates())

      let granuleDiff = turfMultiPolygon

      // If there are multiple granules being drawn, calculate the difference between the union
      // of the previous granules and the current granule geometry
      if (index > 0) {
        try {
          granuleDiff = difference(featureCollection([turfMultiPolygon, granulesUnion]))
        } catch (error) {
          console.log('Error calculating difference between granules', error)
        }

        // If granuleDiff is null, that means the current granule is completely contained
        // within the union of previous granules. We don't need to draw the granule imagery
        if (!granuleDiff) return
      }

      if (index === 0) {
        // If this is the first granule, the union will be the current granule geometry
        granulesUnion = turfMultiPolygon
      } else {
        // Create a union of all the granule geometries added so far
        const previousGranulesUnion = granulesUnion
        try {
          granulesUnion = union(featureCollection([granulesUnion, turfMultiPolygon]))
        } catch (error) {
          console.log('Error calculating union between granules', error)

          granulesUnion = previousGranulesUnion
        }
      }

      // For each granule, add a new layer to the map
      // The layer should be a Tile layer with the gibs imagery
      // in a prerender of that layer lets clip the imagery to the granule geometry

      // `granuleDiff` is a turf geometry, but we need it to be an openlayers geometry
      // for clipping the imagery
      let granuleDiffMultiPolygon
      const diffType = granuleDiff.geometry.type
      switch (diffType) {
        case 'MultiPolygon':
          granuleDiffMultiPolygon = new MultiPolygon(granuleDiff.geometry.coordinates)
          break
        case 'Polygon':
          granuleDiffMultiPolygon = new MultiPolygon([granuleDiff.geometry.coordinates])
          break
        default:
          break
      }

      const geometryToClip = granuleDiffMultiPolygon

      // Create a cache key for the layer.
      const cacheKey = `${granuleId}-${gibsData.product}-${gibsData.time}-${projectionCode}`

      let imageryLayer
      if (tileCache.containsKey(cacheKey)) {
        imageryLayer = tileCache.get(cacheKey)

        // `UnByKey` removes the event listeners by the key provided
        const { prerenderKey } = imageryLayer.getProperties()

        // Remove the existing event listeners for the cached layer
        unByKey(prerenderKey)
        imageryLayer.un('postrender', onTileLayerPostrender)
      } else {
        imageryLayer = new TileLayer({
          className: `granule-imagery-${granuleId}`,
          preload: 5,
          source: new WMTS({
            crossOrigin: 'anonymous',
            format: `image/${gibsData.format}`,
            interpolate: false,
            layer: gibsData.product,
            matrixSet: gibsData.resolution,
            projection: crsProjections[projectionCode],
            tileGrid: getTileGrid(projectionCode, gibsData.resolution),
            tileLoadFunction: (tile, src) => {
              // We are caching the images retrieved from GIBS so we don't have to reload them
              // every time we redraw the granules.

              // The key for the cache is the URL of the image, excluding the domain name.
              // Because the domain name is `gibs-{a-c}`, so it might have a different domain
              // each time we try to load the image.
              const tileCacheKey = src.split('nasa.gov/')[1]

              if (imageryCache.containsKey(tileCacheKey)) {
                // If the cache has the image, set the image to the tile
                const tileData = imageryCache.get(tileCacheKey)
                tile.setImage(tileData)
              } else {
                // If the cache does not have the image, load the image and add it to tile and the cache
                const image = new Image()
                image.crossOrigin = 'anonymous'
                image.src = src

                image.onload = () => {
                  // It is possible while the image is loading, it was saved to the cache by another granule
                  // If that is the case, replace the image in the cache with the new image
                  if (!imageryCache.containsKey(tileCacheKey)) {
                    imageryCache.set(tileCacheKey, image)
                  }
                }

                // Set the image to the tile
                tile.setImage(image)
              }
            },
            url: gibsData.url,
            wrapX: false
          })
        })

        // Save the layer to the cache
        tileCache.set(cacheKey, imageryLayer)
      }

      // Set the opacity of the layer provided by the gibsData
      imageryLayer.setOpacity(gibsData.opacity)

      // Add the event listeners to the layer
      const prerenderKey = imageryLayer.on('prerender', onTileLayerPrerender.bind(null, map, geometryToClip))
      imageryLayer.on('postrender', onTileLayerPostrender)

      // Save the event listener key to the layer properties, for turning off the listener later
      imageryLayer.set('prerenderKey', prerenderKey)

      granuleImageryLayers.push(imageryLayer)
    })
  })

  // Add all the layers to the layer group
  granuleImageryLayerGroup.setLayers(new Collection(granuleImageryLayers.reverse()))
}

export default drawGranuleBackgroundsAndImagery
