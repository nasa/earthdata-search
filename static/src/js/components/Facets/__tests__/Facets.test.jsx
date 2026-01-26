import { screen, within } from '@testing-library/react'
import { kebabCase } from 'lodash-es'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import Facets from '../Facets'
import * as facetUtils from '../../../util/facets'
import useEdscStore from '../../../zustand/useEdscStore'

const setup = setupTest({
  Component: Facets,
  defaultZustandState: {
    facetParams: {
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false,
        nearRealTime: false
      },
      setCmrFacets: vi.fn(),
      setFeatureFacets: vi.fn(),
      triggerViewAllFacets: vi.fn()
    },
    facets: {
      facets: {
        byId: {
          Keywords: {
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
        }
      }
    },
    portal: {
      features: {
        featureFacets: {
          showAvailableInEarthdataCloud: true,
          showCustomizable: true,
          showMapImagery: true
        }
      }
    }
  }
})

describe('Facets Features Map Imagery component', () => {
  test('renders feature facets with tooltips and icons', async () => {
    const { user } = setup({
      overrideZustandState: {
        portal: {
          features: {
            featureFacets: {
              showAvailableInEarthdataCloud: false,
              showCustomizable: true,
              showMapImagery: true
            }
          }
        }
      }
    })

    // Check for Map Imagery icon
    const mapImageryIcon = screen.getByLabelText('A map icon')
    expect(mapImageryIcon).toBeInTheDocument()

    // Check for Customizable icon
    const customizableIcon = screen.getByLabelText('A gear icon')
    expect(customizableIcon).toBeInTheDocument()

    // Check for Cloud icon
    const cloudIcon = screen.queryByLabelText('A cloud icon')
    expect(cloudIcon).not.toBeInTheDocument()

    const featuresElements = screen.getAllByText('Features')
    expect(featuresElements).toHaveLength(1)
    expect(featuresElements[0]).toBeInTheDocument()
    expect(screen.getByText('Map Imagery')).toBeInTheDocument()

    const customizableElement = screen.getByText('Customizable')
    expect(customizableElement).toBeInTheDocument()

    const tooltipTrigger = screen.getByTestId('facet_item-customizable-info')

    await user.hover(tooltipTrigger)

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(screen.getByText('Include only collections that support customization (temporal, spatial, or variable subsetting, reformatting, etc.)')).toBeInTheDocument()
  })

  test('does not render features FacetsGroup if all feature facets are disabled', () => {
    setup({
      overrideZustandState: {
        portal: {
          features: {
            featureFacets: {
              showAvailableInEarthdataCloud: false,
              showCustomizable: false,
              showMapImagery: false
            }
          }
        }
      }
    })

    const featuresGroup = screen.queryByText('Features')
    expect(featuresGroup).toBeNull()
  })

  test('renders keywords FacetsGroup and checks the opening and closing of the dropdown', async () => {
    const { user } = setup()

    const facetGroupText = 'Keywords'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

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
    const { user } = setup()

    const facetGroupText = 'Platforms'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

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
    const { user } = setup()

    const facetGroupText = 'Instruments'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

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
    const { user } = setup()

    const facetGroupText = 'Organizations'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

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
    const { user } = setup()

    const facetGroupText = 'Projects'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const facetButton = screen.getByRole('button', { name: /projects/i })

    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders processing levels FacetsGroup', async () => {
    const { user } = setup()

    const facetGroupText = 'Processing Levels'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const facetButton = screen.getByRole('button', { name: /processing levels/i })

    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders data format FacetsGroup', async () => {
    const { user } = setup()

    const facetGroupText = 'Data Format'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const facetButton = screen.getByRole('button', { name: /data format/i })

    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders tiling system FacetsGroup', async () => {
    const { user } = setup()

    const facetGroupText = 'Tiling System'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const facetButton = screen.getByRole('button', { name: /tiling system/i })
    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('renders horizontal data resolution FacetsGroup', async () => {
    const { user } = setup()

    const facetGroupText = 'Horizontal Data Resolution'
    const facetGroup = screen.getByTestId(`facet_group-${kebabCase(facetGroupText)}`)
    expect(facetGroup).toBeInTheDocument()
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()

    const facetButton = screen.getByRole('button', { name: 'Horizontal Data Resolution Open' })
    expect(facetButton).toHaveAttribute('title', 'Horizontal Data Resolution')

    await user.click(facetButton)
    expect(screen.getByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeInTheDocument()

    await user.click(facetButton)
    expect(screen.queryByTestId(`facet-${kebabCase(facetGroupText)}`)).toBeNull()
  })

  test('featureFacetHandler calls changeFeatureFacet', async () => {
    const mock = vi.spyOn(facetUtils, 'changeFeatureFacet').mockImplementationOnce(() => vi.fn())
    const { user } = setup()

    const { setFeatureFacets } = useEdscStore.getState().facetParams

    const facetGroup = screen.getByRole('checkbox', { name: 'Customizable' })
    await user.click(facetGroup)

    expect(mock).toHaveBeenCalledWith(
      expect.anything(),
      {
        destination: null,
        title: 'Customizable',
        value: 'customizable'
      },
      setFeatureFacets
    )
  })

  test('cmrFacetHandler calls changeCmrFacet', async () => {
    const mock = vi.spyOn(facetUtils, 'changeCmrFacet').mockImplementationOnce(() => vi.fn())
    const { user } = setup()

    const { setCmrFacets } = useEdscStore.getState().facetParams

    // Look for button by its label attribute
    await user.click(screen.getByRole('button', { name: /Keywords/i }))

    const facetGroup = screen.getByRole('checkbox', { name: 'Mock Keyword Facet' })
    await user.click(facetGroup)

    expect(mock).toHaveBeenCalledWith(
      expect.anything(),
      {
        destination: 'http://example.com/apply_keyword_link',
        title: 'Mock Keyword Facet'
      },
      setCmrFacets
    )
  })
})
