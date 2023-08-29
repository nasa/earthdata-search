import React from 'react'

import {
  act, render, screen
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import CollectionDetailsBody from '../CollectionDetailsBody'
import CollectionDetailsMinimap from '../CollectionDetailsMinimap'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
}))

jest.mock('../CollectionDetailsMinimap', () => jest.fn(({ children }) => (
  <mock-CollectionDetailsMinimap data-testid="collection-details-body__minimap">
    {children}
  </mock-CollectionDetailsMinimap>
)))

// Mock CollectionDetailsMinimap as a component
// jest.mock('../CollectionDetailsMinimap', () => () => (<div> Mock minimap</div>))

// Mock Related Collection component
jest.mock('../../RelatedCollection/RelatedCollection', () => () => (<div> Mock related collection</div>))

const setup = (overrides) => {
  const {
    overrideMetadata = {},
    overrideProps = {}
  } = overrides || {}

  const onToggleRelatedUrlsModal = jest.fn()

  const props = {
    isActive: true,
    collectionMetadata: {
      hasAllMetadata: true,
      dataCenters: [],
      directDistributionInformation: {},
      scienceKeywords: [],
      nativeDataFormats: [],
      urls: {
        html: {
          title: 'HTML',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.html'
        },
        native: {
          title: 'Native',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.native'
        },
        atom: {
          title: 'ATOM',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.atom'
        },
        echo10: {
          title: 'ECHO10',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.echo10'
        },
        iso19115: {
          title: 'ISO19115',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.iso19115'
        },
        dif: {
          title: 'DIF',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.dif'
        },
        osdd: {
          title: 'OSDD',
          href: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?clientId=edsc-prod&shortName=1860_1993_2050_NITROGEN_830&versionId=1&dataCenter=ORNL_DAAC'
        },
        granuleDatasource: {
          title: 'CMR',
          href: 'https://cmr.earthdata.nasa.gov/search/granules.json?echo_collection_id=C179003620-ORNL_DAAC'
        }
      },
      ...overrideMetadata
    },
    location: {
      pathname: '/search'
    },
    onFocusedCollectionChange: jest.fn(),
    onMetricsRelatedCollection: jest.fn(),
    onToggleRelatedUrlsModal,
    ...overrideProps
  }
  act(() => {
    render(<CollectionDetailsBody {...props} />)
  })

  return {
    onToggleRelatedUrlsModal
  }
}

describe('CollectionDetailsBody component', () => {
  describe('when the details are not loaded', () => {
    test('displays a skeleton loader', () => {
      setup({
        overrideMetadata: {
          hasAllMetadata: false
        }
      })
      // TODO I couldn't find a way to not use the test Id here
      expect(screen.queryAllByTestId('collection-details-body__skeleton')).not.toBeNull()
    })
  })
  // TODO There isn't a way to test this in react-testing-lib
  describe('when the details are loaded', () => {
    test('renders itself correctly', () => {
      const spatialMetadata = 'Bounding Rectangle: (90.0°, -180.0°, -90.0°, 180.0°)'
      const boxesMetadata = '-90 -180 90 180'
      setup({
        overrideMetadata: {
          boxes: [
            boxesMetadata
          ],
          spatial: [
            spatialMetadata
          ]
        }
      })

      expect(CollectionDetailsMinimap).toHaveBeenCalledTimes(1)

      expect(screen.getByText(spatialMetadata)).toBeInTheDocument()
      // todo the boxes are on the minimap not rendered onto the page need to test this
      // expect(screen.getByText(boxesMetadata)).toBeInTheDocument()
    })

    describe('Spatial bounding', () => {
      test('renders correctly', () => {
        const spatialMetadata = 'Bounding Rectangle: (90.0°, -180.0°, -90.0°, 180.0°)'
        setup({
          overrideMetadata: {
            spatial: [
              spatialMetadata
            ]
          }
        })

        expect(screen.getByText(spatialMetadata)).toBeInTheDocument()
      })
    })

    describe('DOI Badge', () => {
      test('renders correctly and links to correct location', () => {
        setup({
          overrideMetadata: {
            doi: {
              doiLink: 'https://dx.doi.org/10.3334/ORNLDAAC/1569',
              doiText: '10.3334/ORNLDAAC/1569'
            }
          }
        })

        // `DOI` is the primary prop for the badge which merges with name
        const doiLink = screen.getByRole('link', { name: 'DOI 10.3334/ORNLDAAC/1569' })
        expect(doiLink).toBeInTheDocument()
        expect(doiLink.href).toEqual('https://dx.doi.org/10.3334/ORNLDAAC/1569')
      })
    })

    describe('Associated DOIs', () => {
      test('renders its links correctly', () => {
        setup({
          overrideMetadata: {
            associatedDois: [
              {
                doi: '10.1234/ParentDOIID1',
                title: 'DOI Title 1',
                authority: 'https://doi.org/'
              },
              {
                doi: '10.1234/ParentDOIID2',
                title: 'DOI Title 2',
                authority: 'https://doi.org/'
              }
            ]
          }
        })

        const doiLink = screen.getByRole('link', { name: 'View DOI Title 1' })
        const doiLink2 = screen.getByRole('link', { name: 'View DOI Title 2' })
        expect(doiLink).toBeInTheDocument()
        expect(doiLink2).toBeInTheDocument()
        expect(doiLink.href).toEqual('https://doi.org/10.1234/ParentDOIID1')
        expect(doiLink2.href).toEqual('https://doi.org/10.1234/ParentDOIID2')
      })
    })

    describe('Related URLs', () => {
      test('renders its links correctly', async () => {
        const user = userEvent.setup()

        const { onToggleRelatedUrlsModal } = setup({
          overrideMetadata: {
            relatedUrls: [
              {
                content_type: 'CollectionURL',
                label: 'Collection URL',
                urls: [
                  {
                    description: 'Data set Landing Page DOI URL',
                    urlContentType: 'CollectionURL',
                    type: 'DATA SET LANDING PAGE',
                    url: 'https://doi.org/10.3334/ORNLDAAC/830',
                    subtype: ''
                  }
                ]
              },
              {
                content_type: 'DistributionURL',
                label: 'Distribution URL',
                urls: [
                  {
                    description: 'This link allows direct data access via Earthdata login',
                    urlContentType: 'DistributionURL',
                    type: 'GET DATA',
                    url: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/',
                    subtype: ''
                  },
                  {
                    description: 'Web Coverage Service for this collection.',
                    urlContentType: 'DistributionURL',
                    type: 'USE SERVICE API',
                    subtype: 'WEB COVERAGE SERVICE (WCS)',
                    url: 'https://webmap.ornl.gov/wcsdown/dataset.jsp?ds_id=830',
                    get_service: {
                      mimeType: 'application/gml+xml',
                      protocol: 'Not provided',
                      fullName: 'Not provided',
                      dataId: 'NotProvided',
                      dataType: 'Not provided'
                    }
                  }
                ]
              },
              {
                content_type: 'PublicationURL',
                label: 'Publication URL',
                urls: [
                  {
                    description: 'ORNL DAAC Data Set Documentation',
                    urlContentType: 'PublicationURL',
                    type: 'VIEW RELATED INFORMATION',
                    subtype: 'GENERAL DOCUMENTATION',
                    url: 'https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html'
                  },
                  {
                    description: 'Data Set Documentation',
                    urlContentType: 'PublicationURL',
                    type: 'VIEW RELATED INFORMATION',
                    subtype: 'GENERAL DOCUMENTATION',
                    url: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg'
                  },
                  {
                    description: 'Data Set Documentation',
                    urlContentType: 'PublicationURL',
                    type: 'VIEW RELATED INFORMATION',
                    subtype: 'GENERAL DOCUMENTATION',
                    url: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf'
                  },
                  {
                    description: 'Data Set Documentation',
                    urlContentType: 'PublicationURL',
                    type: 'VIEW RELATED INFORMATION',
                    subtype: 'GENERAL DOCUMENTATION',
                    url: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf'
                  }
                ]
              },
              {
                content_type: 'VisualizationURL',
                label: 'Visualization URL',
                urls: [
                  {
                    description: 'Browse Image',
                    urlContentType: 'VisualizationURL',
                    type: 'GET RELATED VISUALIZATION',
                    url: 'https://daac.ornl.gov/graphics/browse/sdat-tds/830_1_fit.png',
                    subtype: ''
                  }
                ]
              },
              {
                content_type: 'HighlightedURL',
                label: 'Highlighted URL',
                urls: [
                  {
                    description: 'Data set Landing Page DOI URL',
                    urlContentType: 'CollectionURL',
                    type: 'DATA SET LANDING PAGE',
                    url: 'https://doi.org/10.3334/ORNLDAAC/830',
                    highlightedType: 'Data Set Landing Page'
                  }
                ]
              }
            ]
          }
        })

        const relatedUrlLink = screen.getByRole('link', { name: 'Data Set Landing Page' })
        expect(relatedUrlLink).toBeInTheDocument()
        expect(relatedUrlLink.href).toEqual('https://doi.org/10.3334/ORNLDAAC/830')

        const viewAllRelatedByUrlsButton = screen.getByRole('button', { name: 'View All Related URLs' })
        expect(viewAllRelatedByUrlsButton.className).toEqual('button button--link link link--separated collection-details-body__link btn btn-link')
        await user.click(screen.getByRole('button', { name: 'View All Related URLs' }))
        expect(onToggleRelatedUrlsModal).toHaveBeenCalledTimes(1)
        expect(onToggleRelatedUrlsModal).toHaveBeenCalledWith(true)

        // The .html url is the  `View More Info` link
        const htmlLink = screen.getByRole('link', { name: 'View More Info' })
        expect(htmlLink).toBeInTheDocument()
        expect(htmlLink.href).toEqual('https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.html')
      })
    })

    describe('Temporal Extent', () => {
      test('renders correctly', () => {
        setup({
          overrideMetadata: {
            temporal: [
              '1860-01-01 to 2050-12-31'
            ]
          }
        })

        expect(screen.getByText('1860-01-01 to 2050-12-31')).toBeInTheDocument()
      })
    })
    // TODO add data center test for coverage
    describe('Data center', () => {
      test('renders correctly', () => {
        const mockDataCenters = [
          {
            roles: [
              'DISTRIBUTOR'
            ],
            shortName: 'USAP-DC',
            longName: 'United States Antarctic Program Data Center',
            contactInformation: {
              contactMechanisms: [
                {
                  type: 'Email',
                  value: 'info@usap-dc.org'
                }
              ],
              addresses: [
                {
                  country: 'United States'
                }
              ],
              relatedUrls: [
                {
                  urlContentType: 'DataCenterURL',
                  type: 'HOME PAGE',
                  url: 'http://www.usap-dc.org/'
                }
              ]
            },
            contactPersons: [
              {
                roles: [
                  'Data Center Contact'
                ],
                firstName: 'Data',
                lastName: 'Manager',
                contactInformation: {
                  contactMechanisms: [
                    {
                      type: 'Email',
                      value: 'info@usap-dc.org'
                    }
                  ],
                  addresses: [
                    {
                      country: 'United States'
                    }
                  ],
                  relatedUrls: [
                    {
                      urlContentType: 'DataContactURL',
                      type: 'HOME PAGE',
                      url: 'http://www.usap-dc.org/'
                    }
                  ]
                }
              }
            ]
          }
        ]

        setup({
          overrideMetadata: {
            dataCenters: mockDataCenters
          }
        })
        expect(screen.getByText('info@usap-dc.org')).toBeInTheDocument()
        // expect(screen.getByText('DISTRIBUTOR')).toBeInTheDocument()
        // expect(screen.getByText('ARCHIVER')).toBeInTheDocument()

        // expect(screen.getByText('1860-01-01 to 2050-12-31')).toBeInTheDocument()
      })
      describe('when contact information is not email or facebook', () => {
        test('renders correctly', () => {
          const mockDataCenters = [
            {
              roles: [
                'DISTRIBUTOR'
              ],
              shortName: 'USAP-DC',
              longName: 'United States Antarctic Program Data Center',
              contactInformation: {
                contactMechanisms: [
                  {
                    type: 'Email',
                    value: 'info@usap-dc.org'
                  }
                ],
                addresses: [
                  {
                    country: 'United States'
                  }
                ],
                relatedUrls: [
                  {
                    urlContentType: 'DataCenterURL',
                    type: 'HOME PAGE',
                    url: 'http://www.usap-dc.org/'
                  }
                ]
              },
              contactPersons: [
                {
                  roles: [
                    'Data Center Contact'
                  ],
                  firstName: 'Data',
                  lastName: 'Manager',
                  contactInformation: {
                    contactMechanisms: [
                      {
                        type: 'mock-contact-info-type',
                        value: 'mock-contact-info-value'
                      }
                    ],
                    addresses: [
                      {
                        country: 'United States'
                      }
                    ],
                    relatedUrls: [
                      {
                        urlContentType: 'DataContactURL',
                        type: 'HOME PAGE',
                        url: 'http://www.usap-dc.org/'
                      }
                    ]
                  }
                }
              ]
            }
          ]

          setup({
            overrideMetadata: {
              dataCenters: mockDataCenters
            }
          })

          expect(screen.queryByText('mock-contact-info-value')).not.toBeInTheDocument()
        })
      })
    })

    describe('GIBS Layers', () => {
      test('renders correctly', () => {
        setup({
          overrideMetadata: {
            gibsLayers: 'Gib layer'
          }
        })
        expect(screen.getByText('Gib layer')).toBeInTheDocument()
      })
    })

    describe('Supported Reformatting', () => {
      test('renders correctly', () => {
        setup({
          overrideMetadata: {
            services: {
              items: [
                {
                  type: 'ECHO ORDERS',
                  supportedOutputFormats: null,
                  supportedReformattings: null
                },
                {
                  type: 'ESI',
                  supportedReformattings: [
                    {
                      supportedInputFormat: 'HDF-EOS2',
                      supportedOutputFormats: ['XML', 'ASCII', 'ICARTT']
                    },
                    {
                      supportedInputFormat: 'HDF-EOS5',
                      supportedOutputFormats: ['PNG', 'JPEG']
                    },
                    {
                      supportedInputFormat: 'HDF-EOS5',
                      supportedOutputFormats: ['TIFF']
                    }
                  ]
                },
                {
                  type: 'NOT PROVIDED',
                  supportedOutputFormats: null,
                  supportedReformattings: null
                }
              ]
            }
          }
        })

        // todo ensure that these are the same
        expect(screen.getByText('HDF-EOS2')).toBeInTheDocument()
        expect(screen.getByText('HDF-EOS5')).toBeInTheDocument()
        expect(screen.getByText('XML, ASCII, ICARTT')).toBeInTheDocument()
        expect(screen.getByText('PNG, JPEG, TIFF')).toBeInTheDocument()

        // const reformattingsDataElement = enzymeWrapper.find('.collection-details-body__info').find('dd').at(1)

        // const format1 = reformattingsDataElement.find('.collection-details-body__reformatting-item').at(0)
        // const format2 = reformattingsDataElement.find('.collection-details-body__reformatting-item').at(1)

        // expect(format1.find('dt').text()).toEqual('HDF-EOS2<EDSCIcon />')
        // expect(format2.find('dt').text()).toEqual('HDF-EOS5<EDSCIcon />')

        // expect(format1.find('dd').text()).toEqual('XML, ASCII, ICARTT')
        // expect(format2.find('dd').text()).toEqual('PNG, JPEG, TIFF')
      })

      test('does not render duplicate formats', () => {
        setup({
          overrideMetadata: {
            services: {
              items: [
                {
                  type: 'ECHO ORDERS',
                  supportedOutputFormats: null,
                  supportedReformattings: null
                },
                {
                  type: 'ESI',
                  supportedReformattings: [
                    {
                      supportedInputFormat: 'HDF-EOS2',
                      supportedOutputFormats: ['XML', 'ASCII', 'ICARTT']
                    },
                    {
                      supportedInputFormat: 'HDF-EOS5',
                      supportedOutputFormats: ['PNG', 'JPEG']
                    },
                    {
                      supportedInputFormat: 'HDF-EOS5',
                      supportedOutputFormats: ['TIFF', 'PNG', 'JPEG'] // PNG and JPEG are duplicated for HDF-EOS5
                    }
                  ]
                },
                {
                  type: 'NOT PROVIDED',
                  supportedOutputFormats: null,
                  supportedReformattings: null
                }
              ]
            }
          }
        })

        expect(screen.getByText('HDF-EOS2')).toBeInTheDocument()

        // Only one element with the text `HDF-EOS5` is rendered
        expect(screen.getAllByText('HDF-EOS5').length).toEqual(1)

        expect(screen.getByText('XML, ASCII, ICARTT')).toBeInTheDocument()
        expect(screen.getByText('PNG, JPEG, TIFF')).toBeInTheDocument()
      })

      test('does not render options not supported by EDSC', () => {
        setup({
          overrideMetadata: {
            services: {
              items: [
                {
                  type: 'ECHO ORDERS',
                  supportedOutputFormats: null,
                  supportedReformattings: null
                },
                {
                  type: 'ESI',
                  supportedReformattings: null
                },
                {
                  type: 'NOT PROVIDED',
                  supportedOutputFormats: null,
                  supportedReformattings: [
                    {
                      supportedInputFormat: 'HDF-EOS2',
                      supportedOutputFormats: ['XML', 'ASCII', 'ICARTT']
                    },
                    {
                      supportedInputFormat: 'HDF-EOS5',
                      supportedOutputFormats: ['PNG', 'JPEG']
                    },
                    {
                      supportedInputFormat: 'HDF-EOS5',
                      supportedOutputFormats: ['TIFF']
                    }
                  ]
                }
              ]
            }
          }
        })

        expect(screen.queryAllByText('HDF-EOS2').length).toEqual(0)
        expect(screen.queryAllByText('HDF-EOS5').length).toEqual(0)
      })
    })

    describe('Science Keywords', () => {
      test('renders correctly', () => {
        setup({
          overrideMetadata: {
            scienceKeywords: [
              ['Earth Science', 'Atmosphere', 'Atmospheric Chemistry']
            ]
          }
        })
        screen.debug()
        expect(screen.getByText('Earth Science')).toBeInTheDocument()
        expect(screen.getByText('Atmosphere')).toBeInTheDocument()
        expect(screen.getByText('Atmospheric Chemistry')).toBeInTheDocument()
      })
    })

    describe('Data Formats', () => {
      test('renders correctly', () => {
        setup({
          overrideMetadata: {
            nativeDataFormats: ['PDF']
          }
        })
        expect(screen.getByText('PDF')).toBeInTheDocument()
        expect(screen.getAllByText('PDF').length).toEqual(1)
      })
    })

    describe('Summary', () => {
      test('renders correctly', () => {
        setup({
          overrideMetadata: {
            abstract: 'This data set provides global gridded estimates of atmospheric deposition of total inorganic nitrogen (N), NHx (NH3 and NH4+), and NOy (all oxidized forms of nitrogen other than N2O), in mg N/m2/year, for the years 1860 and 1993 and projections for the year 2050. The data set was generated using a global three-dimensional chemistry-transport model (TM3) with a spatial resolution of 5 degrees longitude by 3.75 degrees latitude (Jeuken et al., 2001; Lelieveld and Dentener, 2000). Nitrogen emissions estimates (Van Aardenne et al., 2001) and projection scenario data (IPCC, 1996; 2000) were used as input to the model.'
          }
        })

        expect(screen.getByText('This data set provides global gridded estimates of atmospheric deposition of total inorganic nitrogen (N), NHx (NH3 and NH4+), and NOy (all oxidized forms of nitrogen other than N2O), in mg N/m2/year, for the years 1860 and 1993 and projections for the year 2050. The data set was generated using a global three-dimensional chemistry-transport model (TM3) with a spatial resolution of 5 degrees longitude by 3.75 degrees latitude (Jeuken et al., 2001; Lelieveld and Dentener, 2000). Nitrogen emissions estimates (Van Aardenne et al., 2001) and projection scenario data (IPCC, 1996; 2000) were used as input to the model.'))
          .toBeInTheDocument()
      })
    })
    // TODO: why is this giving me lower case value on the DOM?
    describe('Direct Distribution Information', () => {
      test('renders correctly', () => {
        setup({
          overrideMetadata: {
            directDistributionInformation: {
              region: 'us-east-2',
              s3BucketAndObjectPrefixNames: ['TestBucketOrObjectPrefix'],
              s3CredentialsApiEndpoint: 'https://DAACCredentialEndpoint.org',
              s3CredentialsApiDocumentationUrl: 'https://DAACCredentialDocumentation.org'
            }
          }
        })

        // Get the region information for direct distribution
        expect(screen.getByText('us-east-2')).toBeInTheDocument()

        // Get access bucket name
        expect(screen.getByText('TestBucketOrObjectPrefix')).toBeInTheDocument()

        // todo can hrefs not be captial
        // lower-case hrefs are treated the same as upper-case hrefs
        expect(screen.getByRole('link', { name: 'Get AWS S3 Credentials' }).href).toEqual('https://daaccredentialendpoint.org/')
        expect(screen.getByRole('link', { name: 'Documentation' }).href).toEqual('https://daaccredentialdocumentation.org/')
        // .toHaveTextContent('s3://test-aws-address-cache.s3.us-west-7.amazonaws.com/zarr/test-name')
        // expect(enzymeWrapper.find('.collection-details-body__cloud-access__region').text()).toEqual('us-east-2')
        // expect(enzymeWrapper.find('.collection-details-body__cloud-access__bucket-name').text()).toEqual('TestBucketOrObjectPrefix')
        // expect(enzymeWrapper.find('.collection-details-body__cloud-access__api-link').props().href).toEqual('https://DAACCredentialEndpoint.org')
        // expect(enzymeWrapper.find('.collection-details-body__cloud-access__documentation-link').props().href).toEqual('https://DAACCredentialDocumentation.org')
      })
    })

    describe('Variable Instance data', () => {
      describe('when the collection has variables with instance information', () => {
        const overrideMetadata = {
          overrideMetadata: {
            variables: {
              items: [
                {
                  conceptId: 'V123456-EDSC',
                  instanceInformation: {
                    url: 's3://test-aws-address-cache.s3.us-west-7.amazonaws.com/zarr/test-name',
                    format: 'Zarr',
                    description: 'brief end user information goes here.',
                    directDistributionInformation: {
                      region: 'us-west-2',
                      s3BucketAndObjectPrefixNames: [
                        'test-aws-cache',
                        'zarr/test-name'
                      ],
                      s3CredentialsApiEndpoint: 'https://api.test.earthdata.nasa.gov/s3credentials',
                      s3CredentialsApiDocumentationUrl: 'https://test/information/documents?title=In-region%20Direct%20S3%20Zarr%20Cache%20Access'
                    },
                    chunkingInformation: 'Chunk size for this test example is 1MB. optimized for time series.'
                  }
                }
              ]
            }
          }
        }

        test('renders variable instance information', () => {
          setup(overrideMetadata)
          expect(screen.getByRole('link', { name: 's3://test-aws-address-cache.s3.us-west-7.amazonaws.com/zarr/test-name' }))
            .toHaveTextContent('s3://test-aws-address-cache.s3.us-west-7.amazonaws.com/zarr/test-name')
        })

        test('renders cloud access header', () => {
          // TODO we used 'value' on EDD but, here 'name was only one that worked'
          setup(overrideMetadata)
          expect(screen.getByRole('heading', {
            level: 4,
            name: 'Cloud Access'
          })).toBeInTheDocument()
        })
      })

      describe('when the collection has variables without instance information', () => {
        const overrideMetadata = {
          overrideMetadata: {
            variables: {
              items: [
                {
                  conceptId: 'V123456-EDSC'
                }
              ]
            }
          }
        }

        test('does not render variable instance information', () => {
          setup(overrideMetadata)
          expect(screen.queryByRole('link', { name: 's3://test-aws-address-cache.s3.us-west-7.amazonaws.com/zarr/test-name' })).toBeNull()
        })

        test('does Not render cloud access header', () => {
          // TODO we used 'value' on EDD but, here 'name was only one that worked'
          setup(overrideMetadata)
          expect(screen.queryByRole('heading', {
            level: 4,
            name: 'Cloud Access'
          })).not.toBeInTheDocument()
        })
      })

      describe('when the collection does not have variables', () => {
        test('does not render variable instance information', () => {
          setup()
          expect(screen.queryByRole('link', { name: 's3://test-aws-address-cache.s3.us-west-7.amazonaws.com/zarr/test-name' })).toBeNull()
        })

        test('does Not render cloud access header', () => {
          // TODO we used 'value' on EDD but, here 'name was only one that worked'
          setup()
          expect(screen.queryByRole('heading', {
            level: 4,
            name: 'Cloud Access'
          })).not.toBeInTheDocument()
        })
      })
    })

    describe('"For Developers" Panel', () => {
      test('has the correct props', async () => {
        const user = userEvent.setup()

        setup()
        const forDevelopersCollapsablePanel = screen.getByText('For Developers')
        await user.click(forDevelopersCollapsablePanel)
        // expect(screen.getByText('For Developers'))

        // todo this is turning into `collapse-panel__button-primary` as the value
        // expect(screen.getByText('For Developers')).toHaveClass('collection-details-body__for-devs')
        const developerListLinks = screen.getAllByRole('listitem')
        expect(screen.getAllByRole('listitem').length).toEqual(7)

        // Ensure each child is an anchor tag with a valid link
        developerListLinks.map((link) => {
          expect(link.childNodes[0].href).not.toBeNull()
          return link
        })

        // const children = enzymeWrapper.find(CollapsePanel).children()
        // expect(enzymeWrapper.find(CollapsePanel).props().className).toEqual('collection-details-body__for-devs')
        // expect(enzymeWrapper.find(CollapsePanel).props().header).toEqual('For Developers')
        // expect(enzymeWrapper.find(CollapsePanel).props().panelClassName).toEqual('')
        // expect(enzymeWrapper.find(CollapsePanel).props().scrollToBottom).toEqual(true)
        // expect(children.find('.collection-details-body__dev-list a').length).toEqual(7)
      })
    })

    describe('Related Collections', () => {
      test('renders the links', () => {
        setup({
          overrideMetadata: {
            relatedCollections: {
              count: 5,
              items: [
                {
                  doi: '1.TEST.DOI',
                  id: 'TEST_COLLECTION_1',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 1'
                },
                {
                  doi: '2.TEST.DOI',
                  id: 'TEST_COLLECTION_2',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 2'
                },
                {
                  doi: '3.TEST.DOI',
                  id: 'TEST_COLLECTION_3',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 3'
                },
                {
                  doi: '4.TEST.DOI',
                  id: 'TEST_COLLECTION_4',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 4'
                },
                {
                  doi: '5.TEST.DOI',
                  id: 'TEST_COLLECTION_5',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 5'
                }
              ]
            }
          },
          overrideProps: {
            location: {
              pathname: '/search/granules/collection-details',
              search: '?p=TEST_COLLECTION_0',
              hash: '',
              key: '1234'
            }
          }
        })
        // screen.debug()
        // const relatedCollectionsList = screen.getByRole('heading', { name: 'You might also be interested in...' })
        // const relatedCollectionsList = screen.getByText('You might also be interested in...')
        //   .closest('list')

        // console.log(relatedCollectionsList.length)

        const collectionDetailsBodyLists = screen.getAllByRole('list')
        // Related collections and required `For Developers` list
        expect(collectionDetailsBodyLists.length).toEqual(3)

        const relatedCollectionsListItems = collectionDetailsBodyLists[0].childNodes
        expect(relatedCollectionsListItems.length).toEqual(5)
        // expect(screen.getAllByText('Mock related collection').length).toEqual(5)
        // expect(enzymeWrapper.find('.collection-details-body__related-collections-list')).toBeDefined()
      })

      test('renders the 3 links', () => {
        setup({
          overrideMetadata: {
            relatedCollections: {
              count: 5,
              items: [
                {
                  doi: '1.TEST.DOI',
                  id: 'TEST_COLLECTION_1',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 1'
                },
                {
                  doi: '2.TEST.DOI',
                  id: 'TEST_COLLECTION_2',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 2'
                },
                {
                  doi: '3.TEST.DOI',
                  id: 'TEST_COLLECTION_3',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 3'
                }
              ]
            }
          },
          overrideProps: {
            location: {
              pathname: '/search/granules/collection-details',
              search: '?p=TEST_COLLECTION_0',
              hash: '',
              key: '1234'
            }
          }
        })
        expect(screen.getAllByText('Mock related collection').length).toEqual(3)
      })
    })
  })
})
