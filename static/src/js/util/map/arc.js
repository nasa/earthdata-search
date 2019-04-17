import Coordinate from './coordinate'

// A small number for dealing with near-0
const EPSILON = 0.00000001

// Class for dealing with operations on great circle arcs
export default class Arc {
  constructor(coordA, coordB) {
    let newCoordA = coordA
    let newCoordB = coordB
    if (newCoordB.theta < newCoordA.theta) {
      [newCoordB, newCoordA] = Array.from([newCoordA, newCoordB])
    }

    if (Math.abs(newCoordB.theta - newCoordA.theta) > Math.PI) {
      this.coordB = newCoordA
      this.coordA = newCoordB
    } else {
      this.coordA = newCoordA
      this.coordB = newCoordB
    }
    this.normal = this.coordA.cross(this.coordB)
  }

  inflection() {
    const normal = this.normal.toLatLng()

    const southInflectionLat = -90 + Math.abs(normal.lat)
    const northInflectionLat = -southInflectionLat

    const southInflectionLon = normal.lng
    let northInflectionLon = normal.lng + 180
    if (northInflectionLon > 180) {
      northInflectionLon -= 360
    }

    if (this.coversLongitude(northInflectionLon)) {
      return Coordinate.fromLatLng(northInflectionLat, northInflectionLon)
    }
    if (this.coversLongitude(southInflectionLon)) {
      return Coordinate.fromLatLng(southInflectionLat, southInflectionLon)
    }
    return null
  }

  coversLongitude(lon) {
    const theta = (lon * Math.PI) / 180.0
    const thetaMin = Math.min(this.coordA.theta, this.coordB.theta)
    const thetaMax = Math.max(this.coordA.theta, this.coordB.theta)
    if (Math.abs(thetaMax - thetaMin) < Math.PI) {
      return thetaMin < theta && theta < thetaMax
    }
    return (theta > thetaMax) || (theta < thetaMin)
  }

  antimeridianCrossing() {
    const {
      abs
    } = Math

    // Doesn't cross the meridian
    if (this.coordA.theta < this.coordB.theta) {
      return null
    }

    // On the meridian
    if (
      (abs(Math.PI - abs(this.coordA.theta)) < EPSILON)
      || (abs(Math.PI - abs(this.coordB.theta)) < EPSILON)
    ) {
      return null
    }

    // On a longitude line
    if ((abs(this.coordA.theta - this.coordB.theta) % Math.PI) < EPSILON) {
      return null
    }

    const xN = this.normal.x
    // const yN = this.normal.y
    const zN = this.normal.z

    // We have two vectors and a normal vector.  We need to find a third
    // vector which passes through the (anti-)meridian (y = 0) and whose
    // normal vector with either @coordA or @coordB is @normal (or at least
    // points in the same direction).
    //
    // xN = yA * z - zA * y
    // yN = zA * x - xA * z
    // zN = xA * y - yA * x
    //
    // x = - zN / yA
    // y = 0
    // z = xN / yA

    // We need to be careful of two things here.  First, yA cannot be 0,
    // in other words our chosen arc endpoint cannot itself be on the meridian

    let yA = this.coordA.y
    if (abs(yA) < EPSILON) {
      yA = this.coordB.y
    }

    // If they're both on the meridian, bail
    if (abs(yA) < EPSILON) {
      return null
    }

    // Second, the normal directions zN and xN cannot both be 0.  This happens
    // when the arc follows the meridian, so in theory this case should never
    // occur.

    if ((abs(zN) < EPSILON) && (abs(xN) < EPSILON)) {
      return null
    }

    let x = -zN / yA
    const y = 0
    let z = xN / yA

    // Finally, we need <x, y, z> to point in the direction of the anti-meridian

    if (x > 0) {
      x = -x
      z = -z
    }

    return Coordinate.fromXYZ(x, y, z)
  }
}
