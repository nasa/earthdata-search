import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import AdminPage from '../AdminPage'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    children: null,
    pageTitle: 'Admin Title',
    breadcrumbs: [{
      active: false,
      name: 'Admin Title'
    }],
    ...overrideProps
  }
  const enzymeWrapper = shallow(<AdminPage {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Admin component', () => {
  test('should render the site AdminPage', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.admin-page__page-title').text()).toEqual('Admin Title')
    expect(enzymeWrapper.find('.admin-page__breadcrumbs').length).toEqual(1)
  })

  describe('with portal information', () => {
    test('should render the admin with breadcrumbs', () => {
      const { enzymeWrapper } = setup({
        breadcrumbs: [{
          active: false,
          name: 'Admin Title',
          href: '/admin'
        }, {
          active: true,
          name: 'Retrievals'
        }]
      })

      expect(enzymeWrapper.find('.admin-page__page-title').text()).toEqual('Admin Title')
      expect(enzymeWrapper.find('.admin-page__breadcrumbs').length).toEqual(1)
      expect(enzymeWrapper.find('.breadcrumb-item').length).toEqual(2)
    })
  })
})
