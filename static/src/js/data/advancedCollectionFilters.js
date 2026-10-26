const advancedCollectionFilters = [
  {
    key: 'doi',
    label: 'DOI Value',
    cmrKey: 'doi',
    type: 'text'
  },
  {
    key: 'entryTitle',
    label: 'Entry Title',
    cmrKey: 'entry_title',
    type: 'text'
  },
  {
    key: 'consortium',
    label: 'Consortium',
    cmrKey: 'consortium',
    type: 'array',
    options: ['EOSDIS', 'CEOS', 'CWIC', 'FEDEO', 'GEOSS']
  },
  {
    key: 'hasGranulesCreatedAt',
    label: 'New Granules Since (UTC)',
    cmrKey: 'has_granules_created_at',
    type: 'datetime-local'
  },
  {
    key: 'collectionDataType',
    label: 'Collection Data Type',
    cmrKey: 'collection_data_type',
    type: 'array',
    options: ['SCIENCE_QUALITY', 'NEAR_REAL_TIME', 'OTHER']
  },
  {
    key: 'collectionProgress',
    label: 'Collection Progress',
    cmrKey: 'collection_progress',
    type: 'array',
    options: [
      'ACTIVE', 'PLANNED', 'COMPLETE', 'DEPRECATED',
      'NOT PROVIDED', 'PREPRINT', 'INREVIEW', 'SUPERSEDED'
    ]
  },
  {
    key: 'downloadable',
    label: 'Downloadable',
    cmrKey: 'downloadable',
    type: 'boolean'
  },
  {
    key: 'browsable',
    label: 'Browsable',
    cmrKey: 'browsable',
    type: 'boolean'
  },
  {
    key: 'variableName',
    label: 'Variable Name',
    cmrKey: 'variable_name',
    type: 'text'
  },
  {
    key: 'serviceName',
    label: 'Service Name',
    cmrKey: 'service_name',
    type: 'text'
  },
  {
    key: 'toolName',
    label: 'Tool Name',
    cmrKey: 'tool_name',
    type: 'text'
  }
]

export default advancedCollectionFilters
