export const handleFormSubmit = (values, { props, setSubmitting }) => {
  const {
    onApplyGranuleFilters
  } = props

  const {
    readableGranuleName
  } = values

  let granuleFilters = { ...values }

  // readableGranuleName needs to be sent as an array, split on the ','
  if (readableGranuleName) {
    granuleFilters = {
      ...granuleFilters,
      readableGranuleName: readableGranuleName.split(',')
    }
  }

  onApplyGranuleFilters(granuleFilters)

  setSubmitting(false)
}

export default handleFormSubmit
