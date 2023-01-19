import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Card } from 'react-bootstrap'

import CollectionDetailsDataCenter from '../CollectionDetailsDataCenter'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
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

  const enzymeWrapper = shallow(<CollectionDetailsDataCenter {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetails component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(Card)
    expect(enzymeWrapper.prop('className')).toEqual('collection-details-data-center')
    expect(enzymeWrapper.prop('as')).toEqual('li')
    expect(enzymeWrapper.prop('bg')).toEqual('light')
    expect(enzymeWrapper.find(Card.Body).length).toEqual(1)
  })
})
