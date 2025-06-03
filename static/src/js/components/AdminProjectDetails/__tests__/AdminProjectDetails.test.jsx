import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import { AdminProjectDetails } from '../AdminProjectDetails'

const setup = setupTest({
  Component: AdminProjectDetails,
  defaultProps: {
    project: {
      name: 'Test Project Name',
      obfuscated_id: '06347346',
      path: '/search?ff=Map%20Imagery',
      username: 'edsc-test'
    }
  }
})

describe('AdminProjectDetails component', () => {
  test('should render the site AdminProjectDetails', () => {
    setup()

    expect(screen.getByText('Test Project Name')).toBeInTheDocument()
    expect(screen.getByText('edsc-test')).toBeInTheDocument()
    expect(screen.getByText('06347346')).toBeInTheDocument()
    expect(screen.getByText('/search?ff=Map%20Imagery')).toBeInTheDocument()
    expect(screen.getByText('{ "ff": "Map Imagery" }')).toBeInTheDocument()
  })
})
