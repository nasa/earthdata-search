export const retrievalStatusPropsEsi = {
  orders: [
    {
      type: 'ESI',
      order_number: '5000000333461',
      state: 'complete',
      order_information: {
        downloadUrls: {
          downloadUrl: [
            'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html',
            'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip'
          ]
        },
        requestStatus: {
          status: 'complete',
          totalNumber: 81,
          numberProcessed: 81
        },
        contactInformation: {
          contactName: 'NSIDC User Services',
          contactEmail: 'nsidc@nsidc.org'
        }
      }
    },
    {
      type: 'ESI',
      order_number: '5000000333462',
      state: 'processing',
      order_information: {
        downloadUrls: {
          downloadUrl: [
            'https://n5eil02u.ecs.nsidc.org/esir/5000000333462.html',
            'https://n5eil02u.ecs.nsidc.org/esir/5000000333462.zip'
          ]
        },
        requestStatus: {
          status: 'processing',
          totalNumber: 100,
          numberProcessed: 13
        },
        contactInformation: {
          contactName: 'NSIDC User Services',
          contactEmail: 'nsidc@nsidc.org'
        }
      }
    }
  ]
}

export const retrievalStatusPropsSwodlrOrder = {
  id: 1,
  type: 'SWODLR',
  order_number: 'e7efe743-f253-43e3-b017-74faa8bdfcf1',
  order_information: {
    jobId: '318f172c-3faa-4ad4-ad5e-ac9f8ec8572f',
    reason: null,
    status: 'complete',
    granules: [
      {
        id: 'f27cff93-c22c-4c76-9347-b174065c14cc',
        uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/e7efe743-f253-43e3-b017-74faa8bdfcf1/1732032596/SWOT_L2_HR_Raster_5000m_UTM07V_N_x_x_x_024_080_023F_20241114T224218_20241114T224239_DIC0_01.nc',
        timestamp: '2024-11-19T16:10:02.949'
      }
    ],
    createdAt: '2024-11-19T15:14:14.604168',
    productId: 'e7efe743-f253-43e3-b017-74faa8bdfcf1',
    updatedAt: '2024-11-19T15:14:14.583756'
  },
  state: 'complete',
  error: null
}

export const retrievalStatusPropsHarmonyOrder = {
  id: 1,
  type: 'Harmony',
  order_number: '9f6fc038-0966-4a27-8220-2a0c7eff6078',
  order_information: {
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
  order_number: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
  order_information: {
    createdAt: '2024-11-21T17:54:51.995Z',
    dataExpiration: '2024-12-21T17:54:51.995Z',
    jobID: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    labels: ['edsc-id:5678901'],
    message: 'The job is in progress',
    numInputGranules: 10,
    request: 'https://harmony.earthdata.nasa.gov/C1595422627-ASF/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleId=G2736530662-ASF%2CG2736533197-ASF%2CG2736534372-ASF&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D4140933204',
    status: 'running',
    updatedAt: '2024-11-21T18:54:54.177Z',
    username: 'testuser'
  },
  state: 'running',
  error: null
}
