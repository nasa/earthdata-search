import React from 'react'

import {
  act, render, screen
} from '@testing-library/react'

import CollectionDetailsDataCenter from '../CollectionDetailsDataCenter'

const setup = () => {
  const props = {
    dataCenter: {
      roles: [
        'ARCHIVER'
      ],
      short_name: 'ORNL_DAAC',
      contact_information: {
        contact_mechanisms: [
          {
            type: 'Direct Line',
            value: '(865) 241-3952'
          },
          {
            type: 'Email',
            value: 'uso@daac.ornl.gov'
          }
        ],
        addresses: [
          {
            street_addresses: [
              'ORNL DAAC User Services Office, P.O. Box 2008, MS 6407, Oak Ridge National Laboratory'
            ],
            city: 'Oak Ridge',
            state_province: 'Tennessee',
            country: 'USA',
            postal_code: '37831-6407'
          }
        ]
      }
    },
    item: 0
  }

  act(() => {
    render(<CollectionDetailsDataCenter {...props} />)
  })

  return {
    props
  }
}

describe('CollectionDetails component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getAllByRole('listitem').length).toEqual(1)
    expect(screen.getByText('ARCHIVER')).not.toBeNull()
  })
})
