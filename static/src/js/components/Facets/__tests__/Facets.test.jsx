import React from 'react'
import {
  act,
  render,
  screen,
  within
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

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

  render(<Facets {...props} />)

  return {
    props,
    onChangeCmrFacet,
    onChangeFeatureFacet,
    onTriggerViewAllFacets
  }
}

describe('Facets Features Map Imagery component', () => {
  test('only renders enabled feature FacetsGroup', async () => {
    setup({
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

    const user = userEvent.setup()

    const featuresElements = screen.getAllByText('Features')
    expect(featuresElements).toHaveLength(1)
    expect(featuresElements[0]).toBeInTheDocument()
    expect(screen.getByText('Map Imagery')).toBeInTheDocument()
    await user.click(screen.getAllByRole('checkbox', { checked: false }).at(0))
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(1)
  })

  test('only renders enabled feature FacetsGroup', async () => {
    setup({
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

    const user = userEvent.setup()

    const featuresElements = screen.getAllByText('Features')
    expect(featuresElements).toHaveLength(1)
    expect(featuresElements[0]).toBeInTheDocument()
    expect(screen.getByText('Map Imagery')).toBeInTheDocument()

    const customizableElement = screen.getByText('Customizable')
    expect(customizableElement).toBeInTheDocument()

    const tooltipTrigger = screen.getByTestId('facet_item-customizable-info')

    await act(async () => {
      await user.hover(tooltipTrigger)
    })

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(screen.getByText('Include only collections that support customization (temporal, spatial, or variable subsetting, reformatting, etc.)')).toBeInTheDocument()
  })

  test('checkboxes get checked correctly in the feature FacetsGroup', async () => {
    setup({
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

    const user = userEvent.setup()

    expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(2)
    await user.click(screen.getAllByRole('checkbox', { checked: false }).at(0))
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(1)
    expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(1)
  })

  test('does not render features FacetsGroup if all feature facets are disabled', () => {
    setup({
      portal: {
        features: {
          featureFacets: {
            showMapImagery: false,
            showCustomizable: false
          }
        }
      }
    })

    const featuresGroup = screen.queryByText('Features')
    expect(featuresGroup).toBeNull()
  })

  test('renders keywords FacetsGroup and checks the opening and closing of the dropdown', async () => {
    setup()
    const facetGroupText = 'Keywords'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    const facetButton = screen.getByRole('button', { name: /keywords/i })
    await user.click(facetButton)

    // Get the keywords section and find checkboxes within it
    const keywordsSection = screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)
    expect(keywordsSection).toBeInTheDocument()

    const checkboxes = within(keywordsSection).getAllByRole('checkbox')
    const childTitle = checkboxes[0].getAttribute('name')
    expect(screen.getByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeInTheDocument()
    expect(within(keywordsSection).getAllByRole('checkbox', { name: childTitle })).toHaveLength(1)

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
    expect(screen.queryByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeNull()
  })

  test('renders platforms FacetsGroup', async () => {
    setup()
    const facetGroupText = 'Platforms'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    const facetButton = screen.getByRole('button', { name: /platforms/i })
    await user.click(facetButton)

    const platformsSection = screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)
    expect(platformsSection).toBeInTheDocument()

    const checkboxes = within(platformsSection).getAllByRole('checkbox')
    const childTitle = checkboxes[0].getAttribute('name')
    expect(screen.getByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeInTheDocument()
    expect(within(platformsSection).getAllByRole('checkbox', { name: childTitle })).toHaveLength(1)

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
    expect(screen.queryByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeNull()
  })

  test('renders instruments FacetsGroup', async () => {
    setup()
    const facetGroupText = 'Instruments'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    const facetButton = screen.getByRole('button', { name: /instruments/i })
    await user.click(facetButton)

    const instrumentsSection = screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)
    expect(instrumentsSection).toBeInTheDocument()

    const checkboxes = within(instrumentsSection).getAllByRole('checkbox')
    const childTitle = checkboxes[0].getAttribute('name')
    expect(screen.getByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeInTheDocument()
    expect(within(instrumentsSection).getAllByRole('checkbox', { name: childTitle })).toHaveLength(1)

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
    expect(screen.queryByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeNull()
  })

  test('renders organizations FacetsGroup', async () => {
    setup()
    const facetGroupText = 'Organizations'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()
    const facetButton = screen.getByRole('button', { name: /organizations/i })
    await user.click(facetButton)

    const organizationsSection = screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)
    expect(organizationsSection).toBeInTheDocument()

    const checkboxes = within(organizationsSection).getAllByRole('checkbox')
    const childTitle = checkboxes[0].getAttribute('name')
    expect(screen.getByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeInTheDocument()
    expect(within(organizationsSection).getAllByRole('checkbox', { name: childTitle })).toHaveLength(1)

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
    expect(screen.queryByTestId(`facet_item-${kebabCase(childTitle)}`)).toBeNull()
  })

  test('renders projects FacetsGroup', async () => {
    setup()

    const facetGroupText = 'Projects'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()

    const facetButton = screen.getByRole('button', { name: /projects/i })

    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders processing levels FacetsGroup', async () => {
    setup()

    const facetGroupText = 'Processing Levels'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()

    const facetButton = screen.getByRole('button', { name: /processing levels/i })

    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders data format FacetsGroup', async () => {
    setup()

    const facetGroupText = 'Data Format'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()

    const facetButton = screen.getByRole('button', { name: /data format/i })

    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders tiling system FacetsGroup', async () => {
    setup()

    const facetGroupText = 'Tiling System'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()

    const facetButton = screen.getByRole('button', { name: /tiling system/i })
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders horizontal data resolution FacetsGroup', async () => {
    setup()

    const facetGroupText = 'Horizontal Data Resolution'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const user = userEvent.setup()

    const facetButton = screen.getByRole('button', { name: 'Horizontal Data Resolution Open' })
    expect(facetButton).toHaveAttribute('title', 'Horizontal Data Resolution')

    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('featureFacetHandler calls changeFeatureFacet', async () => {
    const mock = jest.spyOn(facetUtils, 'changeFeatureFacet').mockImplementationOnce(() => jest.fn())
    const { onChangeFeatureFacet } = setup()

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
    const { onChangeCmrFacet } = setup()

    const user = userEvent.setup()

    // Look for button by its label attribute
    await user.click(screen.getByRole('button', { name: /Keywords/i }))

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

    const { onTriggerViewAllFacets } = setup({
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

    const user = userEvent.setup()

    expect(screen.queryByRole('button', { name: /View All/i })).toBeNull()

    const projectsButton = screen.getByRole('button', { name: /Projects/i })
    await user.click(projectsButton)
    expect(projectsButton).toBeInTheDocument()

    const viewAllButton = await screen.findByRole('button', { name: /view all/i })
    expect(viewAllButton).toBeInTheDocument()
    expect(viewAllButton).toHaveClass('facets-group__view-all')

    await user.click(viewAllButton)
    expect(onTriggerViewAllFacets).toBeCalledWith('Projects')
  })
})
