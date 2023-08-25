import React from 'react'
import {
  act, render, screen, getByRole, getAllByRole
} from '@testing-library/react'

import VariableInstanceInformation from '../VariableInstanceInformation'

const variable = {
  instanceInformation: {
    url: 's3://test-aws-address-cache.s3.us-west-7.amazonaws.com/zarr/test-name',
    format: 'Zarr',
    description: 'brief end user information goes here.',
    directDistributionInformation: {
      region: 'us-west-2',
      s3BucketAndObjectPrefixNames: [
        'test-aws-cache',
        'zarr/test-name'
      ],
      s3CredentialsApiEndpoint: 'https://api.test.earthdata.nasa.gov/s3credentials',
      s3CredentialsApiDocumentationUrl: 'https://test/information/documents?title=In-region%20Direct%20S3%20Zarr%20Cache%20Access'
    },
    chunkingInformation: 'Chunk size for this test example is 1MB. optimized for time series.'
  }
}

const setup = () => {
  const props = {
    instanceInformation: variable.instanceInformation
  }
  act(() => {
    render(
      <VariableInstanceInformation {...props} />
    )
  })
}

describe('when the collections associated variable has instance information', () => {
  test('Variable Instance Information renders', () => {
    setup()
    expect(screen.getByText('URL')).toHaveTextContent('s3://test-aws-address-cache.s3.us-west-7.amazonaws.com/zarr/test-name')
  })
})

// describe("when the collection has variables associated to it but, they do not contain the zarr `InstanceInformation` field)
// describe("when the collection has variables associated to it and it contain the zarr `InstanceInformation` field)
// describe("when the collection has multiple variables associated to it and some of them contain the zarr `InstanceInformation` field)
// describe("when the collection has multiple variables associated to it and all of them contain the zarr `InstanceInformation` field)
