import 'array-foreach-async'
import request from 'request-promise'
import { parse as parseXml } from 'fast-xml-parser'
import { getDbConnection } from '../util/database/getDbConnection'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Converts a single color component to hex
 * @param {String} component An OpenSearch string template representing the URL to retreive granules with.
 * @return {String} A formatted URL with the users request parameters inserted
 */
const componentToHex = (component) => {
  const hex = parseInt(component, 10).toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

/**
 * Retrieve a single legend entry (which contains a tooltip) from a provided list of legends
 * @param {Array} legends A list of legends from a ColorMap
 * @param {String} ref The ref to lookup in the list of legendshaha.
 * @return {Object} The requested legend containing a tooltip
 */
const getLegendTooltip = (legends, ref) => legends.find(legend => legend.id === ref)

/**
 * Accepts a ColorMap (or array of ColorMaps) from SQS to process and store in our database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const processColorMap = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { Records: sqsRecords = [] } = event

  if (sqsRecords.length === 0) return

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  console.log(`Processing ${sqsRecords.length} color map(s)`)

  await sqsRecords.forEachAsync(async (sqsRecord) => {
    const { body } = sqsRecord

    const providedColorMap = JSON.parse(body)

    console.log('providedColorMap', providedColorMap)

    const scaleColors = []
    const scaleLabels = []
    const scaleValues = []
    const classColors = []
    const classLabels = []
    const specialColors = []
    const specialLabels = []

    const gibsResponse = await request.get({
      uri: providedColorMap.url,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().background
      }
    })

    const parsedColorMap = parseXml(gibsResponse.body, {
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })

    const colorMapsToIgnore = ['No Data', 'Classification', 'Classifications']
    const { ColorMaps: colorMaps = {} } = parsedColorMap
    const { ColorMap: colorMapArray = [] } = colorMaps

    const colorMapList = [].concat(colorMapArray)
    await colorMapList.filter(Boolean).forEachAsync(async (colorMap) => {
      const {
        title,
        units = ''
      } = colorMap

      if (colorMapsToIgnore.includes(title)) {
        return
      }

      const { Entries: entries = {}, Legend: legends = {} } = colorMap
      let { ColorMapEntry: colorMapEntries = [] } = entries
      let { LegendEntry: legendEntries = [] } = legends

      // When fast-xml-parser parses an array of one element, it isn't actually an array
      // but instead its a single object -- this ensures that those values are arrays.
      colorMapEntries = [].concat(colorMapEntries)
      legendEntries = [].concat(legendEntries)

      await colorMapEntries.filter(Boolean).forEachAsync((entry) => {
        const {
          ref,
          rgb,
          transparent,
          value
        } = entry
        const [r, g, b] = rgb.split(',')

        const legend = getLegendTooltip(legendEntries, ref)
        // If there is no legend entry this colormap is not meant to be displayed
        if (!legend) {
          return
        }

        const label = legend.tooltip

        const hexColorString = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`

        // Default to opaque
        let alpha = 255

        if (transparent === 'true') {
          alpha = 0
        }

        if (alpha === 0) {
          specialColors.push(hexColorString)
          specialLabels.push(label)
        } else if (value) {
          try {
            const items = value.replace(/[\])}[{(]/g, '').split(',')
            items.forEach((scaleValue) => {
              let v = parseFloat(scaleValue)

              if (scaleValue === '+INF') {
                v = Number.MAX_VALUE
              }

              if (scaleValue === '-INF') {
                v = Number.MIN_VALUE
              }

              scaleValues.push(v)
            })
          } catch (e) {
            throw Error(`Invalid value: ${value.toString()}`)
          }

          scaleColors.push(hexColorString)
          scaleLabels.push(`${label} ${units}`.trim())
        } else {
          classColors.push(hexColorString)
          classLabels.push(`${label} ${units}`.trim())
        }
      })

      const data = {
        id: providedColorMap.product
      }

      if (scaleColors.length) {
        data.scale = {
          colors: scaleColors,
          values: scaleValues,
          labels: scaleLabels
        }
      }

      if (specialColors.length) {
        data.special = {
          colors: specialColors,
          labels: specialLabels
        }
      }

      if (classColors.length) {
        data.classes = {
          colors: classColors,
          labels: classLabels
        }
      }

      // Update the database with the formatted colormap data
      await dbConnection('colormaps')
        .where({ id: providedColorMap.id })
        .update({ jsondata: data })
    })
  })
}

export default processColorMap
