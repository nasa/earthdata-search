import React from 'react'
import {
  render,
  screen,
  waitFor,
  getByText,
  getAllByText,
  getAllByRole
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import { kebabCase } from 'lodash-es'

import Facets from '../Facets'
import * as facetUtils from '../../../util/facets'

function setup(overrideProps = {}) {
  const onChangeCmrFacet = jest.fn()
  const onChangeFeatureFacet = jest.fn()
  const onTriggerViewAllFacets = jest.fn()

  const props = {
    facetsById: {
      Keywords: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_keyword_link'
          },
          title: 'Mock Keyword Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Keywords',
        totalSelected: 0,
        type: 'group'
      },
      Platforms: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_platform_link'
          },
          title: 'Mock Platform Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Platforms',
        totalSelected: 0,
        type: 'group'
      },
      Instruments: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_instrument_link'
          },
          title: 'Mock Instrument Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Instruments',
        totalSelected: 0,
        type: 'group'
      },
      Organizations: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_organization_link'
          },
          title: 'Mock Organization Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Organizations',
        totalSelected: 0,
        type: 'group'
      },
      Projects: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_project_link'
          },
          title: 'Mock Project Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Projects',
        totalSelected: 0,
        type: 'group'
      },
      'Processing Levels': {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_processing_level_link'
          },
          title: 'Mock Processing Level Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Processing Levels',
        totalSelected: 0,
        type: 'group'
      },
      'Data Format': {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_data_format_link'
          },
          title: 'Mock Data Format Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Data Format',
        totalSelected: 0,
        type: 'group'
      },
      'Tiling System': {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_tiling_system_link'
          },
          title: 'Mock Tiling System Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Tiling System',
        totalSelected: 0,
        type: 'group'
      },
      'Horizontal Data Resolution': {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_horizontal_data_resolution_link'
          },
          title: 'Mock Horizontal Data Resolution Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Horizontal Data Resolution',
        totalSelected: 0,
        type: 'group'
      },
      Latency: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_latency_link'
          },
          title: 'Mock Latency Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Latency',
        totalSelected: 0,
        type: 'group'
      }
    },
    featureFacets: {
      availableInEarthdataCloud: false,
      customizable: false,
      mapImagery: false,
      nearRealTime: false
    },
    portal: {
      features: {
        featureFacets: {
          showAvailableInEarthdataCloud: true,
          showCustomizable: true,
          showMapImagery: true
        }
      }
    },
    onChangeCmrFacet,
    onChangeFeatureFacet,
    onTriggerViewAllFacets,
    ...overrideProps
  }

  const renderContainer = (renderProps) => render(<Facets {...renderProps} />)

  return {
    renderContainer,
    props,
    onChangeCmrFacet,
    onChangeFeatureFacet,
    onTriggerViewAllFacets
  }
}

describe('Facets Features Map Imagery component', () => {
  test('only renders enabled feature FacetsGroup', async () => {
    const { renderContainer, props } = setup({
      portal: {
        features: {
          featureFacets: {
            showMapImagery: true,
            availableInEarthdataCloud: false,
            showCustomizable: false
          }
        }
      }
    })

    const { container } = renderContainer(props)

    const user = userEvent.setup()

    const featuresContainer = getAllByText(container, 'Features')
    expect(featuresContainer).toHaveLength(1)
    expect(featuresContainer.at(0)).toBeInTheDocument()
    expect(getByText(container, 'Map Imagery')).toBeInTheDocument()
    await user.click(screen.getAllByRole('checkbox', { checked: false }).at(0))
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(1)
  })

  test('only renders enabled feature FacetsGroup', async () => {
    const { renderContainer, props } = setup({
      portal: {
        features: {
          featureFacets: {
            showMapImagery: true,
            availableInEarthdataCloud: false,
            showCustomizable: true
          }
        }
      }
    })

    const { container } = renderContainer(props)

    const user = userEvent.setup()

    const featuresContainer = getAllByText(container, 'Features')
    expect(featuresContainer).toHaveLength(1)
    expect(featuresContainer.at(0)).toBeInTheDocument()
    expect(screen.getByText('Map Imagery')).toBeInTheDocument()
    const customizableComp = screen.getByText('Customizable')
    expect(customizableComp).toBeInTheDocument()
    expect(customizableComp.children).toHaveLength(1)
    await waitFor(async () => {
      await user.hover(customizableComp.children[0])
    })

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(getByText(tooltip, 'Include only collections that support customization (temporal, spatial, or variable subsetting, reformatting, etc.)')).toBeInTheDocument()
  })

  test('checkboxes get checked correctly in the feature FacetsGroup', async () => {
    const { renderContainer, props } = setup({
      portal: {
        features: {
          featureFacets: {
            showMapImagery: true,
            availableInEarthdataCloud: false,
            showCustomizable: true
          }
        }
      }
    })

    renderContainer(props)

    const user = userEvent.setup()

    expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(2)
    await user.click(screen.getAllByRole('checkbox', { checked: false }).at(0))
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(1)
    expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(1)
  })

  test('does not render features FacetsGroup if all feature facets are disabled', () => {
    const { renderContainer, props } = setup({
      portal: {
        features: {
          featureFacets: {
            showMapImagery: false,
            showCustomizable: false
          }
        }
      }
    })

    renderContainer(props)
    const featuresGroup = screen.queryByText('Features')
    expect(featuresGroup).toBeNull()
  })

  test('renders keywords FacetsGroup and checks the opening and closing of the dropdown', async () => {
    const { renderContainer, props } = setup()

    const { container } = renderContainer(props)

    const testIndex = 0

    const facetGroupText = Object.keys(props.facetsById)[testIndex]

    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)

    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    // Clicking on the dropdown to show the different facet items
    const facetButton = getAllByRole(container, 'button').at(testIndex + 1)
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()
    const childTitle = props.facetsById[facetGroupText].children[0].title
    expect(screen.getByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeInTheDocument()
    expect(getAllByRole(container, 'checkbox', { name: childTitle })).toHaveLength(1)

    // Clicking again and making sure the facet items go away
    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
    expect(screen.queryAllByRole(container, 'checkbox', { name: childTitle })).toHaveLength(0)
  })

  test('renders platforms FacetsGroup', async () => {
    const { renderContainer, props } = setup()

    const { container } = renderContainer(props)

    const testIndex = 1

    const facetGroupText = Object.keys(props.facetsById)[testIndex]

    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)

    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    // Clicking on the dropdown to show the different facet items
    const facetButton = getAllByRole(container, 'button').at(testIndex + 1)
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()
    const childTitle = props.facetsById[facetGroupText].children[0].title
    expect(screen.getByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeInTheDocument()
    expect(getAllByRole(container, 'checkbox', { name: childTitle })).toHaveLength(1)

    // Clicking again and making sure the facet items go away
    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
    expect(screen.queryAllByRole(container, 'checkbox', { name: childTitle })).toHaveLength(0)
  })

  test('renders instruments FacetsGroup', async () => {
    const { renderContainer, props } = setup()

    const { container } = renderContainer(props)

    const testIndex = 2

    const facetGroupText = Object.keys(props.facetsById)[testIndex]

    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)

    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    // Clicking on the dropdown to show the different facet items
    const facetButton = getAllByRole(container, 'button').at(testIndex + 1)
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()
    const childTitle = props.facetsById[facetGroupText].children[0].title
    expect(screen.getByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeInTheDocument()
    expect(getAllByRole(container, 'checkbox', { name: childTitle })).toHaveLength(1)

    // Clicking again and making sure the facet items go away
    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
    expect(screen.queryAllByRole(container, 'checkbox', { name: childTitle })).toHaveLength(0)
  })

  test('renders organizations FacetsGroup', async () => {
    const { renderContainer, props } = setup()

    const { container } = renderContainer(props)

    const testIndex = 3

    const facetGroupText = Object.keys(props.facetsById)[testIndex]

    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)

    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    // Clicking on the dropdown to show the different facet items
    const facetButton = getAllByRole(container, 'button').at(testIndex + 1)
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()
    const childTitle = props.facetsById[facetGroupText].children[0].title
    expect(screen.getByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeInTheDocument()
    expect(getAllByRole(container, 'checkbox', { name: childTitle })).toHaveLength(1)

    // Clicking again and making sure the facet items go away
    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
    expect(screen.queryAllByRole(container, 'checkbox', { name: childTitle })).toHaveLength(0)
  })

  test('renders projects FacetsGroup', async () => {
    const { renderContainer, props } = setup()

    const { container } = renderContainer(props)

    const testIndex = 4

    const facetGroupText = Object.keys(props.facetsById)[testIndex]

    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)

    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    // Clicking on the dropdown to show the different facet items
    const facetButton = getAllByRole(container, 'button').at(testIndex + 1)
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()
    // Clicking again and making sure the facet items go away
    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders processing levels FacetsGroup', async () => {
    const { renderContainer, props } = setup()

    const { container } = renderContainer(props)

    const testIndex = 5

    const facetGroupText = Object.keys(props.facetsById)[testIndex]

    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)

    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    // Clicking on the dropdown to show the different facet items
    const facetButton = getAllByRole(container, 'button').at(testIndex + 1)
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()
    // Clicking again and making sure the facet items go away
    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders data format FacetsGroup', async () => {
    const { renderContainer, props } = setup()

    const { container } = renderContainer(props)

    const testIndex = 6

    const facetGroupText = Object.keys(props.facetsById)[testIndex]

    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)

    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    // Clicking on the dropdown to show the different facet items
    const facetButton = getAllByRole(container, 'button').at(testIndex + 1)
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()
    // Clicking again and making sure the facet items go away
    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders tiling system FacetsGroup', async () => {
    const { renderContainer, props } = setup()

    const { container } = renderContainer(props)

    const testIndex = 7

    const facetGroupText = Object.keys(props.facetsById)[testIndex]

    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)

    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    // Clicking on the dropdown to show the different facet items
    const facetButton = getAllByRole(container, 'button').at(testIndex + 1)
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()
    // Clicking again and making sure the facet items go away
    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders horizontal data resolution FacetsGroup', async () => {
    const { renderContainer, props } = setup()

    const { container } = renderContainer(props)

    const testIndex = 8

    const facetGroupText = Object.keys(props.facetsById)[testIndex]

    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)

    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    // Clicking on the dropdown to show the different facet items
    const facetButton = getAllByRole(container, 'button').at(testIndex + 1)
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()
    // Clicking again and making sure the facet items go away
    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('featureFacetHandler calls changeFeatureFacet', async () => {
    const mock = jest.spyOn(facetUtils, 'changeFeatureFacet').mockImplementationOnce(() => jest.fn())

    const { renderContainer, props, onChangeFeatureFacet } = setup()

    renderContainer(props)

    const user = userEvent.setup()

    const facetGroup = screen.getByRole('checkbox', { name: 'Customizable' })

    await user.click(facetGroup)

    expect(mock).toBeCalledWith(
      expect.anything(),
      {
        destination: null,
        title: 'Customizable'
      },
      onChangeFeatureFacet
    )
  })

  test('cmrFacetHandler calls changeCmrFacet', async () => {
    const mock = jest.spyOn(facetUtils, 'changeCmrFacet').mockImplementationOnce(() => jest.fn())

    const { renderContainer, props, onChangeCmrFacet } = setup()

    const { container } = renderContainer(props)

    const user = userEvent.setup()

    await user.click(getAllByRole(container, 'button').at(1))

    const facetGroup = screen.getByRole('checkbox', { name: 'Mock Keyword Facet' })

    await user.click(facetGroup)

    expect(mock).toBeCalledWith(
      expect.anything(),
      {
        destination: 'http://example.com/apply_keyword_link',
        title: 'Mock Keyword Facet'
      },
      onChangeCmrFacet,
      {
        level: 0,
        type: 'science_keywords',
        value: 'Mock Keyword Facet'
      },
      true
    )
  })

  test('onTriggerViewAllFacets calls triggerViewAllFacets', async () => {
    const children = []

    for (let count = 1; count <= 50; count += 1) {
      children.push({
        applied: false,
        count,
        has_children: false,
        links: {
          apply: `http://example.com/apply_project_link_${count}`
        },
        title: `Mock Project ${count}`,
        type: 'filter'
      })
    }

    const { renderContainer, props, onTriggerViewAllFacets } = setup({
      facetsById: {
        Projects: {
          applied: false,
          children,
          hasChildren: true,
          title: 'Projects',
          totalSelected: 0,
          type: 'filter'
        }
      }
    })

    const { container } = renderContainer(props)

    const user = userEvent.setup()

    expect(screen.queryByRole('button', { name: /View All/i })).toBeNull()

    await user.click(getAllByRole(container, 'button').at(5))

    expect(screen.getByRole('button', { name: /View All/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /View All/i }))

    expect(onTriggerViewAllFacets).toBeCalledWith(
      'Projects'
    )
  })
})
