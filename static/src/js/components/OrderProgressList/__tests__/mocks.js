export const retrievalStatusPropsHarmonyOrder = {
  id: 1,
  type: 'Harmony',
  orderNumber: '9f6fc038-0966-4a27-8220-2a0c7eff6078',
  orderInformation: {
    createdAt: '2024-11-21T17:54:51.995Z',
    dataExpiration: '2024-12-21T17:54:51.995Z',
    jobID: '9f6fc038-0966-4a27-8220-2a0c7eff6078',
    labels: ['edsc-id:1234567'],
    message: 'The job has completed successfully',
    numInputGranules: 3,
    progress: 100,
    request: 'https://harmony.earthdata.nasa.gov/C1595422627-ASF/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleId=G2736530662-ASF%2CG2736533197-ASF%2CG2736534372-ASF&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D4140933204',
    status: 'successful',
    updatedAt: '2024-11-21T17:54:54.177Z',
    username: 'bporeh'
  },
  state: 'successful',
  error: null
}

export const retrievalStatusPropsHarmonyOrderInProgress = {
  id: 1,
  type: 'Harmony',
  orderNumber: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
  orderInformation: {
    createdAt: '2024-11-21T17:54:51.995Z',
    dataExpiration: '2024-12-21T17:54:51.995Z',
    jobID: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    labels: ['edsc-id:5678901'],
    message: 'The job is in progress',
    numInputGranules: 10,
    progress: 0,
    request: 'https://harmony.earthdata.nasa.gov/C1595422627-ASF/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleId=G2736530662-ASF%2CG2736533197-ASF%2CG2736534372-ASF&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D4140933204',
    status: 'running',
    updatedAt: '2024-11-21T18:54:54.177Z',
    username: 'testuser'
  },
  state: 'running',
  error: null
}
export const retrievalStatusPropsUponRequestOrder = {
  id: 1,
  type: 'Harmony',
  orderNumber: '',
  state: 'running',
  error: null
}
