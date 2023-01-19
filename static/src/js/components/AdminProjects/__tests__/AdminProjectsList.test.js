import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { AdminProjectsList } from '../AdminProjectsList'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    historyPush: jest.fn(),
    onAdminViewProject: jest.fn(),
    onUpdateAdminProjectsSortKey: jest.fn(),
    onUpdateAdminProjectsPageNum: jest.fn(),
    projects: {
      allIds: [],
      byId: {},
      pagination: {
        pageNum: 1,
        pageSize: 20,
        totalResults: 70
      },
      sortKey: ''
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<AdminProjectsList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminProjectsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.admin-projects-list__table').length).toBe(1)
    expect(enzymeWrapper.find('.admin-projects-list__pagination-wrapper').length).toBe(1)
  })

  test('renders the collections table when collections are provided', () => {
    const { enzymeWrapper } = setup({
      projects: {
        allIds: ['1109324645'],
        byId: {
          1109324645: {
            id: 64,
            jsondata: {},
            environment: 'prod',
            created_at: '2019-08-25T11:59:14.390Z',
            user_id: 1,
            username: 'edsc-test',
            total: 40,
            obfuscated_id: '1109324645'
          }
        },
        pagination: {
          pageNum: 1,
          pageSize: 20,
          totalResults: 1
        },
        sortKey: ''
      }

    })

    expect(enzymeWrapper.find('.admin-projects-list__table').length).toBe(1)
    expect(enzymeWrapper.find('.admin-projects-list__pagination-wrapper').length).toBe(1)

    expect(enzymeWrapper.find('.admin-projects-list__table tbody tr').length).toBe(1)
    expect(enzymeWrapper.find('.admin-projects-list__table tbody tr td').at(0).text()).toEqual('64')
    expect(enzymeWrapper.find('.admin-projects-list__table tbody tr td').at(1).text()).toEqual('1109324645')
    expect(enzymeWrapper.find('.admin-projects-list__table tbody tr td').at(2).text()).toEqual('edsc-test')
    expect(enzymeWrapper.find('.admin-projects-list__table tbody tr td').at(3).text()).toEqual('2019-08-25T11:59:14.390Z')
  })
})
