const calculateValidParameters = (userSelections, services) => {
  console.log('calculateValidParameters')
  if (services.length === 0) {
    return {}
  }

  // Filter services based on user selections
  const validServices = services.filter((service) => {
    const { subsetting } = service.capabilities

    if (userSelections.spatialSubset && (!subsetting.bbox && !subsetting.shape)) return false
    if (userSelections.temporalSubset && !subsetting.temporal) return false
    if (userSelections.concatenate && !service.capabilities?.concatenation) return false
    if (userSelections.reproject && !service.capabilities?.reprojection) return false

    if (userSelections.outputFormatSelection) {
      if (service.capabilities?.output_formats
        && !service.capabilities.output_formats.includes(userSelections.outputFormatSelection)) {
        return false
      }
    }

    return true
  })

  // Create descriptive error message if no valid services are found
  if (validServices.length === 0) {
    const activeSelections = []

    if (userSelections.variableSubset) activeSelections.push('Variable Subsetting')
    if (userSelections.spatialSubset) activeSelections.push('Spatial Subsetting')
    if (userSelections.temporalSubset) activeSelections.push('Temporal Subsetting')
    if (userSelections.concatenate) activeSelections.push('Concatenation')
    if (userSelections.reproject) activeSelections.push('Reprojection')
    if (userSelections.outputFormatSelection) activeSelections.push(`${userSelections.outputFormatSelection} as Output Format`)

    let selectionsString = activeSelections.join(' and ')
    if (activeSelections.length > 2) {
      const last = activeSelections.pop()
      selectionsString = `${activeSelections.join(', ')}, and ${last}`
    }

    return {
      hasConflict: true,
      errorMessage: `Cannot select ${selectionsString}.`
    }
  }

  // Initiate all capabilites as disabled (false) and let
  // valid services determine if they are enabled (true)
  const calculatedCapabilities = {
    variableSubset: false,
    spatialSubset: false,
    bbox: false,
    shape: false,
    temporalSubset: false,
    concatenate: false,
    reproject: false
  }

  const validFormats = new Set()

  validServices.forEach((service) => {
    const { subsetting } = service.capabilities

    if (subsetting.variable) calculatedCapabilities.variableSubset = true
    if (subsetting.bbox || subsetting.shape) calculatedCapabilities.spatialSubset = true
    // Some services allow for bbox but not shape, need to enable each individually
    if (subsetting.bbox) calculatedCapabilities.bbox = true
    if (subsetting.shape) calculatedCapabilities.shape = true
    if (subsetting.temporal) calculatedCapabilities.temporalSubset = true
    if (service.capabilities?.concatenation) calculatedCapabilities.concatenate = true
    if (service.capabilities?.reprojection) calculatedCapabilities.reproject = true

    const formats = service.capabilities?.output_formats || []
    formats.forEach((format) => validFormats.add(format))
  })

  return {
    variableSubset: {
      enabled: calculatedCapabilities.variableSubset,
      value: null
    },
    spatialSubset: {
      enabled: calculatedCapabilities.spatialSubset,
      bboxenabled: calculatedCapabilities.bbox,
      shapeenabled: calculatedCapabilities.shape,
      value: null
    },
    temporalSubset: {
      enabled: calculatedCapabilities.temporalSubset,
      value: null
    },
    concatenate: {
      enabled: calculatedCapabilities.concatenate,
      value: null
    },
    reproject: {
      enabled: calculatedCapabilities.reproject,
      value: null
    },
    outputFormats: {
      enabled: validFormats.size > 0,
      value: Array.from(validFormats)
    }
  }
}

export default calculateValidParameters
