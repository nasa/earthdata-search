/* eslint-disable no-underscore-dangle */
import L from 'leaflet'
import 'leaflet-draw'
import {
  dividePolygon,
  makeCounterClockwise
} from './geo'

L.SphericalPolygon = L.Polygon.extend({
  includes: [L.LayerGroup.prototype, L.FeatureGroup.prototype],
  options: {
    fill: true
  },

  initialize(latlngs, options) {
    this._layers = {}
    this._options = L.extend({}, this.options, options)
    return this.setLatLngs(latlngs)
  },

  setLatLngs(latlngs) {
    let newLatLngs
    this._bounds = new L.LatLngBounds()

    let holes = []
    const [firstLatLng] = latlngs
    if (firstLatLng && Array.isArray(firstLatLng) && (firstLatLng.length > 2)) {
      holes = latlngs.slice(1)
      newLatLngs = firstLatLng
    } else {
      newLatLngs = latlngs
    }
    const leafletLatLngs = (newLatLngs.map((latlng) => L.latLng(latlng)))

    this._latlngs = leafletLatLngs.concat()

    // Draw closed path when not editing
    if ((leafletLatLngs.length > 2) && !this.drawing) {
      const middle = Math.abs(leafletLatLngs[leafletLatLngs.length - 1].lng)
      if (Math.abs(leafletLatLngs[0].lng) === middle && middle === 180) {
        // In this case the last element is an artificial longitude crossing.  Avoid interpolating
        // with the first to prevent drawing strokes along the dateline
        leafletLatLngs.push(leafletLatLngs[leafletLatLngs.length - 1])
      } else {
        leafletLatLngs.push(leafletLatLngs[0])
      }
    }

    let { boundaries, interiors } = dividePolygon(leafletLatLngs)

    holes.forEach((hole) => {
      const dividedHole = dividePolygon(hole)
      boundaries = boundaries.concat(dividedHole.boundaries)
      interiors = boundaries.concat(dividedHole.interiors)
    })

    if (this._boundaries) {
      this._interiors.setLatLngs(interiors)
      this._boundaries.setLatLngs(boundaries)
    } else {
      this._interiors = L.polygon(interiors, L.extend({}, this._options, { stroke: false }))
      this._boundaries = L.polygon(boundaries, L.extend({}, this._options, { fill: false }))
      this.addLayer(this._interiors)
      this.addLayer(this._boundaries)
    }
  },

  addLatLng(latlng) {
    const newLatLng = L.latLng(latlng)
    this._latlngs.push(newLatLng)
    this._bounds.extend(newLatLng)
    return this.redraw()
  },

  getLatLngs() {
    return makeCounterClockwise(this._latlngs.concat())
  },

  newLatLngIntersects() {
    return false
  },

  setOptions(options) {
    this.options = L.extend({}, this._options, options)
    this._options = this.options
    L.setOptions(this._interiors, L.extend({}, this._options, { stroke: false }))
    L.setOptions(this._boundaries, L.extend({}, this._options, { fill: false }))
    return this.redraw()
  },

  setStyle(style) {
    if (this.options.previousOptions) {
      this.options.previousOptions = this._options
    }
    this._interiors.setStyle(L.extend({}, style, { stroke: false }))
    return this._boundaries.setStyle(L.extend({}, style, { fill: false }))
  },

  redraw() {
    return this.setLatLngs(this._latlngs)
  }
})

L.sphericalPolygon = (latlngs, options) => new L.SphericalPolygon(latlngs, options)

// Monkey-patch _removeLayer.  The original doesn't handle event propagation
// from FeatureGroups, and SphericalPolygons are FeatureGroups
const originalRemove = L.EditToolbar.Delete.prototype._removeLayer
L.EditToolbar.Delete.prototype._removeLayer = function removeLayer(e) {
  if (e.target != null ? e.target._boundaries : undefined) { e.layer = e.target }
  return originalRemove.call(this, e)
}
