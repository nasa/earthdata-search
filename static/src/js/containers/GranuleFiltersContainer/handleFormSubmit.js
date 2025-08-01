import useEdscStore from '../../zustand/useEdscStore'

export const handleFormSubmit = (values, { props, setSubmitting }) => {
  const {
    readableGranuleName
  } = values

  let granuleFilters = { ...values }

  // `readableGranuleName` needs to be sent as an array, split on the ','
  if (readableGranuleName) {
    granuleFilters = {
      ...granuleFilters,
      readableGranuleName: readableGranuleName.split(',')
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
