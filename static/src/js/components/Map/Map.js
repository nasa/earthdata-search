import React from 'react'
import PropTypes from 'prop-types'
import 'proj4'
import 'proj4leaflet'
import {
  Map,
  LayersControl,
  ScaleControl
} from 'react-leaflet'

import '../../util/map/sphericalPolygon'

import LayerBuilder
  from '../../components/Map/LayerBuilder'
import ConnectedSpatialSelectionContainer
  from '../SpatialSelectionContainer/SpatialSelectionContainer'
import GranuleVisualizationsLayer
  from '../../components/Map/GranuleVisualizationsLayer'
import ZoomHome
  from '../../components/Map/ZoomHome'
import ProjectionSwitcher
  from '../../components/Map/ProjectionSwitcher'

import crsProjections from '../../util/map/crs'
import projections from '../../util/map/projections'

import actions from '../../actions/index'
const Map = (props) => {
  const {
    map,
    collections,
    focusedCollection,
    granules
  } = this.props

  const {
    base,
    latitude,
    longitude,
    overlays,
    projection,
    zoom
  } = map

  const center = [latitude, longitude]

  const maxZoom = projection === projections.geographic ? 7 : 4

  if (this.mapRef) this.mapRef.leafletElement.options.crs = crsProjections[projection]

  return (
    <Map
      className="map"
      center={center}
      zoom={zoom}
      maxZoom={maxZoom}
      crs={crsProjections[projection]}
      ref={(ref) => { this.mapRef = ref }}
      zoomControl={false}
      attributionControl={false}
      onMoveend={this.handleMoveend}
      onBaselayerChange={this.handleBaseLayerChange}
      onOverlayAdd={this.handleOverlayChange}
      onOverlayRemove={this.handleOverlayChange}
      zoomAnimation={false}
    >
      <LayersControl position="bottomright" ref={(r) => { this.controls = r }}>
        <BaseLayer
          checked={base.blueMarble}
          name="Blue Marble"
        >
          <LayerBuilder
            projection={projection}
            product="BlueMarble_ShadedRelief_Bathymetry"
            resolution="500m"
            format="jpeg"
          />
        </BaseLayer>
        <BaseLayer
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
        </BaseLayer>
        <BaseLayer
          checked={base.landWaterMap}
          name="Land / Water Map *"
        >
          <LayerBuilder
            projection={projection}
            product="OSM_Land_Water_Map"
            resolution="250m"
            format="png"
          />
        </BaseLayer>
        <Overlay
          checked={overlays.referenceFeatures}
          name="Borders and Roads *"
        >
          <LayerBuilder
            projection={projection}
            product="Reference_Features"
            resolution="250m"
            format="png"
          />
        </Overlay>
        <Overlay
          checked={overlays.coastlines}
          name="Coastlines"
        >
          <LayerBuilder
            projection={projection}
            product="Coastlines"
            resolution="250m"
            format="png"
          />
        </Overlay>
        <Overlay
          checked={overlays.referenceLabels}
          name="Place Labels *"
        >
          <LayerBuilder
            projection={projection}
            product="Reference_Labels"
            resolution="250m"
            format="png"
          />
        </Overlay>
      </LayersControl>
      <GranuleVisualizationsLayer
        collections={collections}
        focusedCollection={focusedCollection}
        granules={granules}
      />
      <ZoomHome />
      <ProjectionSwitcher onChangeProjection={this.handleProjectionSwitching} />
      <ScaleControl position="bottomright" />
      <ConnectedSpatialSelectionContainer mapRef={this.mapRef} />
    </Map>
  )
}


Map.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  map: PropTypes.shape({}),
  masterOverlayPanelHeight: PropTypes.number.isRequired,
  onChangeMap: PropTypes.func.isRequired
}

export default Map
