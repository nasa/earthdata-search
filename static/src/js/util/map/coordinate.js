import L from 'leaflet'

const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

// Class for dealing with conversions between lat/lng, phi/theta, and x/y/z as well
// as operations on the various forms.
// Consider properties on this class to be immutable.  Changing, say, 'x' will not
// update `phi` or `theta` and will throw normalization out of whack.
export default class Coordinate {
  static fromLatLng(...args) {
    let lat
    let lng
    if (args.length === 1) {
      [{ lat, lng }] = args
    } else {
      [lat, lng] = Array.from(args)
    }
    return Coordinate.fromPhiTheta(lat * DEG_TO_RAD, lng * DEG_TO_RAD)
  }

  static fromPhiTheta(phi, theta) {
    let newPhi = phi
    let newTheta = theta
    const { PI, cos, sin } = Math

    const origTheta = newTheta

    // Normalize phi to the interval [-PI / 2, PI / 2]
    while (newPhi >= PI) { newPhi -= 2 * PI }
    while (newPhi < PI) { newPhi += 2 * PI }

    if (newPhi > (PI / 2)) {
      newPhi = PI - newPhi
      newTheta += PI
    }
    if (newPhi < (-PI / 2)) {
      newPhi = -PI - newPhi
      newTheta += PI
    }

    while (newTheta >= PI) { newTheta -= 2 * PI }
    while (newTheta < -PI) { newTheta += 2 * PI }

    // Maintain the same sign as the original when theta is +/- PI
    if ((newTheta === -PI) && (origTheta > 0)) { newTheta = PI }

    // At the poles, preserve the input longitude
    if (Math.abs(newPhi) === (PI / 2)) { newTheta = origTheta }

    const x = cos(newPhi) * cos(newTheta)
    const y = cos(newPhi) * sin(newTheta)
    const z = sin(newPhi)

    return new Coordinate(newPhi, newTheta, x, y, z)
  }

  // +X axis passes through the (anti-)meridian at the equator
  // +Y axis passes through 90 degrees longitude at the equator
  // +Z axis passes through the north pole
  static fromXYZ(x, y, z) {
    let newX = x
    let newY = y
    let newZ = z
    let d = (newX * newX) + (newY * newY) + (newZ * newZ)
    if (d === 0) {
      newX = 1
      d = 1
    } // Should never happen, but stay safe

    // We normalize so that x, y, and z fall on a unit sphere
    const scale = 1 / Math.sqrt(d)
    newX *= scale
    newY *= scale
    newZ *= scale

    const theta = Math.atan2(newY, newX)
    const phi = Math.asin(newZ)

    return new Coordinate(phi, theta, newX, newY, newZ)
  }

  constructor(phi, theta, x, y, z) {
    this.phi = phi
    this.theta = theta
    this.x = x
    this.y = y
    this.z = z
  }

  // Dot product
  dot(other) {
    return (this.x * other.x) + (this.y * other.y) + (this.z * other.z)
  }

  // Normalized cross product
  cross(other) {
    const x = (this.y * other.z) - (this.z * other.y)
    const y = (this.z * other.x) - (this.x * other.z)
    const z = (this.x * other.y) - (this.y * other.x)
    return Coordinate.fromXYZ(x, y, z)
  }

  // Distance to other coordinate on a unit sphere.  Same as the angle between the two points at the origin.
  distanceTo(other) {
    return Math.acos(this.dot(other))
  }

  toLatLng() {
    const lat = RAD_TO_DEG * this.phi
    const lng = RAD_TO_DEG * this.theta
    if (typeof L !== 'undefined' && L !== null) {
      return new L.LatLng(lat, lng)
    }
    return { lat, lng }
  }

  toString() {
    const latlng = this.toLatLng()
    return `(${latlng.lat.toFixed(3)}, ${latlng.lng.toFixed(3)})`
  }

  toXYZString() {
    return `<${this.x.toFixed(3)}, ${this.y.toFixed(3)}, ${this.z.toFixed(3)}>`
  }
}
