import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { AdminProjectDetails } from '../AdminProjectDetails'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    project: {
      username: 'edsc-test',
      name: 'test project',
      path: '/search?ff=Map%20Imagery',
      obfuscated_id: '06347346'
    },
    ...overrideProps
  }
  const enzymeWrapper = shallow(<AdminProjectDetails {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminProjectDetails component', () => {
  test('should render the site AdminProjectDetails', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.admin-project-details__metadata-display-content').at(0).text()).toEqual('test project')
    expect(enzymeWrapper.find('.admin-project-details__metadata-display-content').at(1).text()).toEqual('edsc-test')
    expect(enzymeWrapper.find('.admin-project-details__metadata-display-content').at(2).text()).toEqual('06347346')
    expect(enzymeWrapper.find('.admin-project-details__metadata-display-content').at(3).text()).toEqual('/search?ff=Map%20Imagery')
    expect(enzymeWrapper.find('.admin-project-details__metadata-display-content').at(4).text()).toEqual(
      JSON.stringify({ ff: 'Map Imagery' }, null, 2)
    )
  })
})
