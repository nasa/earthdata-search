import useEdscStore from '../../zustand/useEdscStore'

export const handleFormSubmit = (values, { props, setSubmitting }) => {
  const {
    readableGranuleName
  } = values

  let granuleFilters = { ...values }

  // `readableGranuleName` needs to be sent as an array, split on the ',' and trim any whitespace
  if (readableGranuleName) {
    granuleFilters = {
      ...granuleFilters,
      readableGranuleName: readableGranuleName.split(',').map((name) => name.trim())
    }
  }

  const { collectionMetadata } = props
  const { conceptId } = collectionMetadata

  const { query } = useEdscStore.getState()
  const { changeGranuleQuery } = query
  changeGranuleQuery({
    collectionId: conceptId,
    query: granuleFilters
  })

  setSubmitting(false)
}

export default handleFormSubmit
