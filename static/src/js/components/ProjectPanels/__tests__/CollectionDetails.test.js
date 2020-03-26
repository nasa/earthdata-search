import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ProjectPanelSection from '../ProjectPanelSection'
import CollectionDetails from '../CollectionDetails'

Enzyme.configure({ adapter: new Adapter() })

describe('CollectionDetails component', () => {
  test('renders a ProjectPanelSection', () => {
    const enzymeWrapper = shallow(
      <CollectionDetails granuleCount={42} />
    )

    expect(enzymeWrapper.find(ProjectPanelSection).props().heading).toEqual('Granules (42 Total)')
  })
})
