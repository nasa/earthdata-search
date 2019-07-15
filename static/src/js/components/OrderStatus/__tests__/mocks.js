export const orderStatusProps = {
  authToken: 'testToken',
  onFetchOrder: jest.fn(),
  match: {
    search: {
      id: 7
    },
    params: {
      id: 7
    }
  },
  onChangePath: jest.fn(),
  order: {
    id: 7,
    collections: {
      download: [
        {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            dataset_id: 'Test Dataset ID',
            order_status: 'in progress'
          }
        }
      ],
      echoOrder: [],
      order: []
    },
    jsondata: {
      source: '?test=source_link'
    },
    links: [
      {
        dataset_id: 'Test Dataset ID',
        links: [
          {
            href: 'http://linkurl.com/test'
          }
        ]
      }
    ]
  }
}

export const orderStatusPropsTwo = {
  authToken: 'testToken2',
  order: {
    id: 7,
    collections: {
      download: [
        {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            dataset_id: 'Test Dataset ID 2',
            order_status: 'complete'
          }
        }
      ],
      echoOrder: [],
      order: []
    },
    jsondata: {
      source: '?test=source_link'
    },
    links: [
      {
        dataset_id: 'Test Dataset ID',
        links: [
          {
            href: 'http://linkurl.com/test'
          }
        ]
      }
    ]
  }
}

