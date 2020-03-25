import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Project from '../Project'
import SavedProjectsContainer
  from '../../../containers/SavedProjectsContainer/SavedProjectsContainer'
import ProjectCollectionsContainer
  from '../../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'
import AppLogoContainer from '../../../containers/AppLogoContainer/AppLogoContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    location: {},
    portal: {},
    project: {
      collectionsRequiringChunking: []
    },
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<Project.WrappedComponent {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Project component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('handleSubmit calls onSubmitRetrieval', () => {
    const { enzymeWrapper, props } = setup()

    const form = enzymeWrapper.find('form')

    form.simulate('submit', { preventDefault: jest.fn() })
    expect(props.onSubmitRetrieval.mock.calls.length).toBe(1)
  })

  describe('Saved projects page', () => {
    test('displays the SavedProjectsContainer', () => {
      const { enzymeWrapper } = setup({
        location: {
          search: ''
        }
      })

      expect(enzymeWrapper.find(SavedProjectsContainer).length).toBe(1)
    })

    test('displays a header', () => {
      const { enzymeWrapper } = setup({
        location: {
          search: ''
        }
      })

      expect(enzymeWrapper.find(AppLogoContainer).length).toBe(1)
    })
  })

  describe('Projects page', () => {
    test('displays the ProjectCollectionsContainer', () => {
      const { enzymeWrapper } = setup({
        location: {
          search: '?p=!C123456-EDSC'
        }
      })

      expect(enzymeWrapper.find(ProjectCollectionsContainer).length).toBe(1)
    })
  })
})
