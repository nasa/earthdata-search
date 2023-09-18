import React, {
  useLayoutEffect,
  useMemo
} from 'react'
import PropTypes from 'prop-types'
import Control from 'react-leaflet-custom-control'
import {
  MapContainer as LeafletMapContainer,
  LayersControl,
  ScaleControl
} from 'react-leaflet'

import { isEmpty } from 'lodash'
import crsProjections from '../../util/map/crs'
import { getValueForTag } from '../../../../../sharedUtils/tags'

import ConnectedSpatialSelectionContainer from '../SpatialSelectionContainer/SpatialSelectionContainer'
import GranuleGridLayer from '../../components/Map/GranuleGridLayer'
import LayerBuilder from '../../components/Map/LayerBuilder'
import MouseEventsLayer from '../../components/Map/MouseEventsLayer'
import ProjectionSwitcher from '../../components/Map/ProjectionSwitcher'
import ShapefileLayer from '../../components/Map/ShapefileLayer'
import ZoomHome from '../../components/Map/ZoomHome'
import MapEvents from './MapEvents'
import Legend from '../../components/Legend/Legend'
import projections from '../../util/map/projections'

const MapWrapper = ({
  authToken,
  base,
  center,
  collectionsMetadata,
  colormapsMetadata,
  drawingNewLayer,
  focusedCollectionId,
  focusedGranuleId,
  granules,
  granulesMetadata,
  imageryCache,
  isFocusedCollectionPage,
  isProjectPage,
  mapProps,
  maxZoom,
  onChangeFocusedGranule,
  onChangeMap,
  onChangeProjection,
  onExcludeGranule,
  onFetchShapefile,
  onMetricsMap,
  onSaveShapefile,
  onShapefileErrored,
  onToggleTooManyPointsModal,
  onUpdateShapefile,
  overlays,
  project,
  projection,
  shapefile,
  zoom
}) => {
  // eslint-disable-next-line arrow-body-style
  const focusedCollectionMetadata = useMemo(() => {
    return collectionsMetadata[focusedCollectionId] || {}
  }, [focusedCollectionId, collectionsMetadata])

  /**
   * Sets the height of the leaflet controls. This is needed so they do not
   * fall behind the footer.
   */
  const resizeLeafletControls = () => {
    if (!document) return

    const leafletControlContainer = document.querySelector('.leaflet-control-container')
    const routeWrapper = document.querySelector('.route-wrapper')

    // If the control container and the route wrapper are defined, set the leaflet controls to
    // the same height as the route wrapper.
    if (leafletControlContainer && routeWrapper) {
      leafletControlContainer.style.height = `${routeWrapper.clientHeight}px`
    }
  }

  useLayoutEffect(() => {
    // Resize the Leaflet controls container when the component map mounts,
    // and any time the browser is resized
    resizeLeafletControls()
    window.addEventListener('resize', resizeLeafletControls)

    return () => {
      window.removeEventListener('resize', resizeLeafletControls)
    }
  }, [])

  const { tags } = focusedCollectionMetadata
  const [gibsTag] = getValueForTag('gibs', tags) || []

  // Check that we are in the correct projection
  const hasGibsLayerForProjection = (gibsLayerValue, projectionValue) => {
    if (projectionValue === projections.arctic && gibsLayerValue.arctic) return true
    if (projectionValue === projections.geographic && gibsLayerValue.geographic) return true
    if (projectionValue === projections.antarctic && gibsLayerValue.antarctic) return true

    return false
  }

  let colorMapState = {}
  if (gibsTag && hasGibsLayerForProjection(gibsTag, projection)) {
    const { product } = gibsTag
    colorMapState = colormapsMetadata[product] || {}
  }

  const { jsondata: colorMap } = colorMapState

  return (
    <LeafletMapContainer
      className="map"
      center={center}
      zoom={zoom}
      maxZoom={maxZoom}
      crs={crsProjections[projection]}
      zoomControl={false}
      attributionControl={false}
      zoomAnimation={false}
      style={
        {
          position: 'absolute'
        }
      }
    >
      <LayersControl
        position="bottomright"
      >
        <LayersControl.BaseLayer
          checked={base.blueMarble}
          name="Blue Marble"
        >
          <LayerBuilder
            projection={projection}
            product="BlueMarble_ShadedRelief_Bathymetry"
            resolution="500m"
            format="jpeg"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer
          checked={base.trueColor}
          name="Corrected Reflectance (True Color)"
        >
          <LayerBuilder
            projection={projection}
            product="VIIRS_SNPP_CorrectedReflectance_TrueColor"
            resolution="250m"
            format="jpeg"
            time
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer
          checked={base.landWaterMap}
          name="Land / Water Map *"
        >
          <LayerBuilder
            projection={projection}
            product="OSM_Land_Water_Map"
            resolution="250m"
            format="png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay
          checked={overlays.referenceFeatures}
          name="Borders and Roads *"
        >
          <LayerBuilder
            projection={projection}
            product="Reference_Features_15m"
            resolution="15.625m"
            format="png"
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay
          checked={overlays.coastlines}
          name="Coastlines"
        >
          <LayerBuilder
            projection={projection}
            product="Coastlines_15m"
            resolution="15.625m"
            format="png"
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay
          checked={overlays.referenceLabels}
          name="Place Labels *"
        >
          <LayerBuilder
            projection={projection}
            product="Reference_Labels_15m"
            resolution="15.625m"
            format="png"
          />
        </LayersControl.Overlay>
      </LayersControl>
      <ZoomHome
        projection={projection}
      />
      {
        !isProjectPage && (
          <ProjectionSwitcher
            position="bottomright"
            onChangeProjection={onChangeProjection}
          />
        )
      }
      <Control prepend position="topright">
        {
          isFocusedCollectionPage
          && !isEmpty(colorMap)
          && (
            <Legend
              colorMap={colorMap}
            />
          )
        }
      </Control>
      <ScaleControl position="topright" />
      <ConnectedSpatialSelectionContainer mapProps={mapProps} />
      <GranuleGridLayer
        collectionsMetadata={collectionsMetadata}
        drawingNewLayer={drawingNewLayer}
        focusedCollectionId={focusedCollectionId}
        focusedGranuleId={focusedGranuleId}
        granules={granules}
        granulesMetadata={granulesMetadata}
        imageryCache={imageryCache}
        isProjectPage={isProjectPage}
        onChangeFocusedGranule={onChangeFocusedGranule}
        onExcludeGranule={onExcludeGranule}
        onMetricsMap={onMetricsMap}
        project={project}
        projection={projection}
      />
      <MouseEventsLayer />
      <ShapefileLayer
        authToken={authToken}
        isProjectPage={isProjectPage}
        shapefile={shapefile}
        onChangeProjection={onChangeProjection}
        onFetchShapefile={onFetchShapefile}
        onSaveShapefile={onSaveShapefile}
        onShapefileErrored={onShapefileErrored}
        onMetricsMap={onMetricsMap}
        onToggleTooManyPointsModal={onToggleTooManyPointsModal}
        onUpdateShapefile={onUpdateShapefile}
      />
      <MapEvents
        overlays={overlays}
        mapProps={mapProps}
        onChangeMap={onChangeMap}
        onMetricsMap={onMetricsMap}
      />
    </LeafletMapContainer>
  )
}

MapWrapper.defaultProps = {
  map: {},
  granules: {}
}

MapWrapper.propTypes = {
  authToken: PropTypes.string.isRequired,
  base: PropTypes.shape({
    blueMarble: PropTypes.bool,
    trueColor: PropTypes.bool,
    landWaterMap: PropTypes.bool
  }).isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  collectionsMetadata: PropTypes.shape({}).isRequired,
  colormapsMetadata: PropTypes.shape({}).isRequired,
  drawingNewLayer: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granules: PropTypes.shape({}),
  granulesMetadata: PropTypes.shape({}).isRequired,
  imageryCache: PropTypes.shape({}).isRequired,
  isFocusedCollectionPage: PropTypes.bool.isRequired,
  isProjectPage: PropTypes.bool.isRequired,
  map: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    projection: PropTypes.string,
    zoom: PropTypes.number,
    base: PropTypes.shape({
      blueMarble: PropTypes.bool,
      trueColor: PropTypes.bool,
      landWaterMap: PropTypes.bool
    }),
    overlays: PropTypes.shape({
      coastlines: PropTypes.bool,
      referenceFeatures: PropTypes.bool,
      referenceLabels: PropTypes.bool
    })
  }),
  mapProps: PropTypes.shape({}).isRequired,
  maxZoom: PropTypes.number.isRequired,
  onChangeFocusedGranule: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onChangeProjection: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFetchShapefile: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onSaveShapefile: PropTypes.func.isRequired,
  onShapefileErrored: PropTypes.func.isRequired,
  onToggleTooManyPointsModal: PropTypes.func.isRequired,
  onUpdateShapefile: PropTypes.func.isRequired,
  overlays: PropTypes.shape({
    coastlines: PropTypes.bool,
    referenceFeatures: PropTypes.bool,
    referenceLabels: PropTypes.bool
  }).isRequired,
  project: PropTypes.shape({}).isRequired,
  projection: PropTypes.string.isRequired,
  shapefile: PropTypes.shape({}).isRequired,
  zoom: PropTypes.number.isRequired
}

export default MapWrapper
