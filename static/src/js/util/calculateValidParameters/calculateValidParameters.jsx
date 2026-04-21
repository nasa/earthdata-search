const calculateValidParameters = (userSelections, services) => {
  if (services.length === 0) {
    return {}
  }

  // Helper to determine if a service supports the user's selections excluding output formats
  const supportsUserSelections = (service) => {
    const { subsetting } = service.capabilities

    if (userSelections.variableSubset && !subsetting.variable) return false
    if (userSelections.spatialSubset && (!subsetting.bbox && !subsetting.shape)) return false
    if (userSelections.temporalSubset && !subsetting.temporal) return false
    if (userSelections.concatenate && !service.capabilities?.concatenation) return false
    if (userSelections.reproject && !service.capabilities?.reprojection) return false

    return true
  }

  // Filter services based on ALL user selections
  const validServices = services.filter((service) => {
    if (!supportsUserSelections(service)) return false

    if (userSelections.outputFormatSelection) {
      if (service.capabilities?.output_formats
        && !service.capabilities.output_formats.includes(userSelections.outputFormatSelection)) {
        return false
      }
    }

    return true
  })

  // Filter services based on user selections IGNORING the output format.
  // This ensures the dropdown options don't collapse down to only the currently selected format.
  const validServicesIgnoringFormat = services.filter(supportsUserSelections)

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
  })

  // Calculate which formats should be available in the dropdown based on the services
  // that remain valid when we ignore the current format selection
  const formatsAvailableForDropdown = new Set()
  validServicesIgnoringFormat.forEach((service) => {
    const formats = service.capabilities?.output_formats || []
    formats.forEach((format) => formatsAvailableForDropdown.add(format))
  })

  const allFormatsSet = new Set()
  services.forEach((service) => {
    const formats = service.capabilities?.output_formats || []
    formats.forEach((format) => allFormatsSet.add(format))
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
      enabled: validServices.length > 0 && formatsAvailableForDropdown.size > 0,
      enabledFormats: Array.from(formatsAvailableForDropdown),
      allFormats: Array.from(allFormatsSet)
    }
  }
}

export default calculateValidParameters
