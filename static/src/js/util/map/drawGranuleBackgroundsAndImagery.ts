import {
  Collection,
  ImageTile,
  Map
} from 'ol'
import { Geometry, MultiPolygon as OlMultiPolygon } from 'ol/geom'
import { unByKey } from 'ol/Observable'
import { WMTS } from 'ol/source'
import GeoJSON from 'ol/format/GeoJSON'
import LRUCache from 'ol/structs/LRUCache'
import RenderEventType, { LayerRenderEventTypes } from 'ol/render/EventType'
import TileLayer from 'ol/layer/Tile'
import RenderEvent from 'ol/render/Event'
import LayerGroup from 'ol/layer/Group'
import VectorSource from 'ol/source/Vector'
import {
  Feature,
  GeoJsonProperties,
  MultiPolygon,
  Polygon
} from 'geojson'

import {
  difference,
  featureCollection,
  multiPolygon,
  union
} from '@turf/turf'

import { crsProjections } from './crs'
import { getTileGrid } from './getTileGrid'
import drawOutline from './drawOutline'

import projectionCodes from '../../constants/projectionCodes'
import { GibsDataByCollection, MapGranule } from '../../types/sharedTypes'

const tileLayerCache: LRUCache<TileLayer> = new LRUCache(100)
const imageryCache: LRUCache<HTMLImageElement> = new LRUCache(100)

// On the prerender event of the imagery tile layer, clip the imagery to the granule geometry
const onTileLayerPrerender = (map: Map, geometry: Geometry, event: RenderEvent) => {
  const ctx = event.context as CanvasRenderingContext2D
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
const onTileLayerPostrender = (event: RenderEvent) => {
  const ctx = event.context as CanvasRenderingContext2D

  ctx.restore()
}

/**
 * Draws the outlines of the granules on the map with the `background` style applied. If gibsData is provided,
 * it will also draw the granule imagery on the map.
 * @param {Object} params
 * @param {Object} params.gibsDataByCollection Gibs Data object that is keyed by Collection Id and contains layers and projection info
 * @param {Object} params.granuleImageryLayerGroup OL Layer Group to add the granule imagery layers to
 * @param {Array} params.granulesMetadata Granule metadata to draw
 * @param {Object} params.map OL Map to draw the granules on
 * @param {Object} params.vectorSource OL Vector Source to draw the granules on
 * @param {String} params.projectionCode Projection Code for the current map projection
 */
const drawGranuleBackgroundsAndImagery = ({
  gibsDataByCollection,
  granuleImageryLayerGroup,
  granulesMetadata,
  map,
  projectionCode,
  vectorSource
}: {
  /** GIBS Data object keyed by collection ID */
  gibsDataByCollection: GibsDataByCollection
  /** The OL Layer Group to add the granule imagery layers to */
  granuleImageryLayerGroup: LayerGroup
  /** The granule metadata to draw */
  granulesMetadata: MapGranule[]
  /** The OL Map to draw the granules on */
  map: Map
  /** The OL Vector Source to draw the granules on */
  vectorSource: VectorSource
  /** The projection code for the current map projection */
  projectionCode: keyof typeof crsProjections
}) => {
  if (!granulesMetadata.length) return

  const granuleImageryLayers: TileLayer[] = []

  let granulesUnion: Feature<MultiPolygon, GeoJsonProperties>

  granulesMetadata.forEach((granule, index) => {
    const {
      backgroundGranuleStyle,
      collectionId,
      formattedTemporal,
      granuleId,
      granuleStyle,
      highlightedStyle,
      spatial,
      time
    } = granule

    // If the granule has no spatial, return
    if (!spatial) return

    // Create a feature for the current granule based on the granule spatial
    const backgroundFeatures = new GeoJSON({
      dataProjection: crsProjections[projectionCodes.geographic],
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
      backgroundFeature.setStyle(backgroundGranuleStyle)

      // Add the feature to the vector source
      vectorSource.addFeature(backgroundFeature)

      const gibsDataObject = gibsDataByCollection[collectionId] || {}
      const { layers: gibsData = [] } = gibsDataObject

      // If the collection has no GIBS data, return without drawing imagery
      if (!gibsData || gibsData.length === 0) return

      // There are a few things we need to keep in mind when drawing the granule imagery:
      // 1. The granule imagery is served by GIBS in tiles, but we only show the imagery that is contained
      //    within the granule's geometry. The do this we clip the imagery to the granule geometry.
      // 2. If there are multiple granules being drawn, we calculate the union of all the previously drawn
      //    granules. We then calculate the difference between that union and the current granule geometry.
      //    This is so we can clip the imagery to only the visible portion the current granule geometry.
      //    This ensures that if the granule has transparent areas, the transparent portions should show
      //    the base layer, and not a granule that might be drawn below.
      // 3. If the current granule is completely contained within the union of previous granules, we don't
      //    need to draw the granule imagery.

      const geometry = backgroundFeature.getGeometry() as Geometry

      // We are only expecting MultiPolygon geometries for granules. Return if the geometry is not a MultiPolygon
      if (geometry.getType() !== 'MultiPolygon') return

      const turfMultiPolygon = multiPolygon((geometry as OlMultiPolygon).getCoordinates())

      let granuleDiff: Feature<MultiPolygon | Polygon, GeoJsonProperties> = turfMultiPolygon

      // If there are multiple granules being drawn, calculate the difference between the union
      // of the previous granules and the current granule geometry
      if (index > 0) {
        try {
          granuleDiff = difference(featureCollection([
            turfMultiPolygon,
            granulesUnion
          ])) as Feature<MultiPolygon | Polygon, GeoJsonProperties>
        } catch (error) {
          console.log('Error calculating difference between granules', error)
        }

        // If granuleDiff is null, that means the current granule is completely contained
        // within the union of previous granules. We don't need to draw the granule imagery
        if (!granuleDiff) return
      }

      // Calculate the union of all the granules added so far
      if (index === 0) {
        // If this is the first granule, the union will be the current granule geometry
        granulesUnion = turfMultiPolygon
      } else {
        // Create a union of all the granule geometries added so far
        const previousGranulesUnion = granulesUnion
        try {
          const unionResult = union(featureCollection([
            granulesUnion,
            turfMultiPolygon
          ]))

          if (unionResult) {
            granulesUnion = unionResult as Feature<MultiPolygon, GeoJsonProperties>
          }
        } catch (error) {
          console.log('Error calculating union between granules', error)

          granulesUnion = previousGranulesUnion
        }
      }

      // `granuleDiff` is a turf geometry, but we need it to be an openlayers geometry
      // for clipping the imagery
      let granuleDiffMultiPolygon
      const diffType = granuleDiff.geometry.type
      switch (diffType) {
        case 'MultiPolygon':
          granuleDiffMultiPolygon = new OlMultiPolygon(granuleDiff.geometry.coordinates)
          break
        case 'Polygon':
          granuleDiffMultiPolygon = new OlMultiPolygon([granuleDiff.geometry.coordinates])
          break
        default:
          break
      }

      const geometryToClip = granuleDiffMultiPolygon as OlMultiPolygon

      // Create imagery layers for each GIBS layer item
      gibsData.forEach((gibsLayer) => {
        // If the GIBS layer is "subdaily", use the full timeStart (date and time).
        // Otherwise, use only the date part of timeStart.
        const gibsTime = gibsLayer.layerPeriod?.toLowerCase() === 'subdaily'
          ? time
          : time.substring(0, 10)

        // Create a cache key for the layer.
        const cacheKey = `${granuleId}-${gibsLayer.product}-${gibsTime}-${projectionCode}`

        let resolution: string
        if (gibsDataObject.projection === projectionCodes.antarctic) {
          resolution = `${gibsLayer.antarctic_resolution}`
        } else if (gibsDataObject.projection === projectionCodes.arctic) {
          resolution = `${gibsLayer.arctic_resolution}`
        } else {
          resolution = `${gibsLayer.geographic_resolution}`
        }

        let imageryLayer: TileLayer
        if (tileLayerCache.containsKey(cacheKey)) {
          imageryLayer = tileLayerCache.get(cacheKey)

          // `unByKey` removes the event listeners by the key provided
          const { prerenderKey } = imageryLayer.getProperties()

          // Remove the existing event listeners for the cached layer
          unByKey(prerenderKey)
          imageryLayer.un(
            RenderEventType.POSTRENDER as LayerRenderEventTypes,
            onTileLayerPostrender
          )
        } else {
          imageryLayer = new TileLayer({
            className: `granule-imagery-${granuleId}`,
            preload: 5,
            zIndex: 3,
            source: new WMTS({
              crossOrigin: 'anonymous',
              format: `image/${gibsLayer.format}`,
              interpolate: false,
              layer: gibsLayer.product,
              matrixSet: resolution,
              projection: crsProjections[projectionCode],
              style: 'default',
              tileGrid: getTileGrid(projectionCode, resolution),
              tileLoadFunction: (tile, src) => {
                // We are caching the images retrieved from GIBS so we don't have to reload them
                // every time we redraw the granules.

                // The key for the cache is the URL of the image, excluding the domain name.
                // Because the domain name is `gibs-{a-c}`, so it might have a different domain
                // each time we try to load the image.
                const tileCacheKey = src.split('nasa.gov/')[1]

                if (imageryCache.containsKey(tileCacheKey)) {
                  // If the cache has the image, set the image to the tile
                  const tileData = imageryCache.get(tileCacheKey);
                  (tile as ImageTile).setImage(tileData)
                } else {
                  // If the cache does not have the image, load the image and add it to tile and the cache
                  const image = new Image()
                  image.crossOrigin = 'anonymous'
                  image.src = src;

                  // Set the image to the tile
                  // If this is not set here, for some reason the basemap tiles aren't updating when zooming.
                  (tile as ImageTile).setImage(image)

                  image.onload = () => {
                    // It is possible while the image is loading, it was saved to the cache by another granule
                    // If that is the case, replace the image in the cache with the new image
                    if (!imageryCache.containsKey(tileCacheKey)) {
                      imageryCache.set(tileCacheKey, image)
                    }

                    // Set the image to the tile
                    // Set the image here after the image is loaded to ensure the whole granule image
                    // is drawn correctly
                    (tile as ImageTile).setImage(image)
                  }

                  image.onerror = () => {
                    // If the image errored it was most likely because that tile does not exist.
                    // Cache the response so we don't try to load it again
                    if (!imageryCache.containsKey(tileCacheKey)) {
                      imageryCache.set(tileCacheKey, image)
                    }
                  }
                }
              },
              url: `https://gibs-{a-c}.earthdata.nasa.gov/wmts/${gibsDataObject.projection}/best/wmts.cgi?TIME=${gibsTime}`,
              wrapX: false
            })
          })

          // Save the layer to the cache
          tileLayerCache.set(cacheKey, imageryLayer)
        }

        // Store the product information in the layer properties for layer visibility toggling
        imageryLayer.set('product', gibsLayer.product)
        imageryLayer.set('title', gibsLayer.title)
        imageryLayer.set('granuleId', granuleId)

        // Set the visibility and opacity based on the Zustand state
        imageryLayer.setVisible(gibsLayer.isVisible ?? false)
        imageryLayer.setOpacity(gibsLayer.opacity ?? 1)

        // Add the event listeners to the layer
        const prerenderKey = imageryLayer.on(
          RenderEventType.PRERENDER as LayerRenderEventTypes,
          onTileLayerPrerender.bind(null, map, geometryToClip)
        )
        imageryLayer.on(RenderEventType.POSTRENDER as LayerRenderEventTypes, onTileLayerPostrender)

        // Save the event listener key to the layer properties, for turning off the listener later
        imageryLayer.set('prerenderKey', prerenderKey)

        granuleImageryLayers.push(imageryLayer)
      })
    })
  })

  // Add all the layers to the layer group
  granuleImageryLayerGroup.setLayers(new Collection(granuleImageryLayers.reverse()))
}

export default drawGranuleBackgroundsAndImagery
