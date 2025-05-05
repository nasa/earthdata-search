import Attribution from 'ol/control/Attribution'

/**
 * CustomAttribution class extends the OpenLayers Attribution control to allow for accessing
 * the `element` property through the `getElement` function.
 */
class CustomAttribution extends Attribution {
  getElement() {
    return this.element
  }
}

export default CustomAttribution
