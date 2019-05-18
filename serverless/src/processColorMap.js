import 'array-foreach-async'
import 'pg'
import request from 'request-promise'
import { parse as parseXml } from 'fast-xml-parser'
import { getDbConnection } from './util'


/**
 * Converts a single color component to hex
 * @param {String} component - An OpenSearch string template representing the URL to retreive granules with.
 * @return {String} A formatted URL with the users request parameters inserted
 */

const componentToHex = (component) => {
  const hex = parseInt(component, 10).toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

const getLegendTooltip = (legends, ref) => legends.find(legend => legend.id === ref)

const connection = getDbConnection()


/**
 * Replaces all valid keys from the users request within the granule url template provided by OpenSearch
 * @param {String} template - An OpenSearch string template representing the URL to retreive granules with.
 * @param {Object} params - The parameters from the users request to supply to the template.
 * @return {String} A formatted URL with the users request parameters inserted
 */
export default async function processColorMap(event, context, callback) {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line
  context.callbackWaitsForEmptyEventLoop = false

  const { Records: sqsRecords = {} } = event

  console.log(`Processing ${sqsRecords.length} color map(s)`)

  await sqsRecords.forEachAsync(async (sqsRecord) => {
    const { body } = sqsRecord

    console.log('body', body)

    const providedColorMap = JSON.parse(body)[0]

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
      resolveWithFullResponse: true
    })

    const parsedColorMap = parseXml(gibsResponse.body, {
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })

    const colorMapsToIgnore = ['No Data', 'Classification', 'Classifications']
    const { ColorMaps: colorMaps = {} } = parsedColorMap
    const { ColorMap: colorMapArray = [] } = colorMaps

    const colorMapList = [].concat(colorMapArray)
    await colorMapList.forEachAsync(async (colorMap) => {
      if (colorMapsToIgnore.includes(colorMap.title)) {
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
          scaleLabels.push(`${label} ${colorMap.units}`)
        } else {
          classColors.push(hexColorString)
          classLabels.push(`${label} ${colorMap.units}`)
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
      await connection('colormaps')
        .where({ id: providedColorMap.id })
        .update({ jsondata: data })
    })
  })

  callback(null, {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(sqsRecords)
  })
}
