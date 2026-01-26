import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import { PortalFeatureContainer } from '../PortalFeatureContainer'

const setup = setupTest({
  Component: PortalFeatureContainer,
  defaultProps: {
    children: (<div>children</div>)
  },
  defaultZustandState: {
    portal: {
      features: {
        advancedSearch: true,
        authentication: true
      },
      ui: {
        showNonEosdisCheckbox: true,
        showOnlyGranulesCheckbox: true
      }
    }
  }
})

describe('PortalFeatureContainer component', () => {
  describe('advancedSearch', () => {
    test('renders children when advancedSearch is enabled', () => {
      setup({
        overrideProps: {
          advancedSearch: true
        },
        overrideZustandState: {
          portal: {
            features: {
              advancedSearch: true
            }
          }
        }
      })

      expect(screen.getByText('children')).toBeInTheDocument()
    })

    test('does not render children when advancedSearch is disabled', () => {
      setup({
        overrideProps: {
          advancedSearch: true
        },
        overrideZustandState: {
          portal: {
            features: {
              advancedSearch: false
            }
          }
        }
      })

      expect(screen.queryByText('children')).not.toBeInTheDocument()
    })
  })

  describe('authentication', () => {
    test('renders children when authentication is enabled', () => {
      setup({
        overrideProps: {
          authentication: true
        },
        overrideZustandState: {
          portal: {
            features: {
              authentication: true
            }
          }
        }
      })

      expect(screen.getByText('children')).toBeInTheDocument()
    })

    test('does not render children when authentication is disabled', () => {
      setup({
        overrideProps: {
          authentication: true
        },
        overrideZustandState: {
          portal: {
            features: {
              authentication: false
            }
          }
        }
      })

      expect(screen.queryByText('children')).not.toBeInTheDocument()
    })
  })

  describe('nonEosdisCheckbox', () => {
    test('renders children when nonEosdisCheckbox is enabled', () => {
      setup({
        overrideProps: {
          nonEosdisCheckbox: true
        },
        overrideZustandState: {
          portal: {
            ui: {
              showNonEosdisCheckbox: true
            }
          }
        }
      })

      expect(screen.getByText('children')).toBeInTheDocument()
    })

    test('does not render children when nonEosdisCheckbox is disabled', () => {
      setup({
        overrideProps: {
          nonEosdisCheckbox: true
        },
        overrideZustandState: {
          portal: {
            ui: {
              showNonEosdisCheckbox: false
            }
          }
        }
      })

      expect(screen.queryByText('children')).not.toBeInTheDocument()
    })
  })

  describe('onlyGranulesCheckbox', () => {
    test('renders children when onlyGranulesCheckbox is enabled', () => {
      setup({
        overrideProps: {
          onlyGranulesCheckbox: true
        },
        overrideZustandState: {
          portal: {
            ui: {
              showOnlyGranulesCheckbox: true
            }
          }
        }
      })

      expect(screen.getByText('children')).toBeInTheDocument()
    })

    test('does not render children when onlyGranulesCheckbox is disabled', () => {
      setup({
        overrideProps: {
          onlyGranulesCheckbox: true
        },
        overrideZustandState: {
          portal: {
            ui: {
              showOnlyGranulesCheckbox: false
            }
          }
        }
      })

      expect(screen.queryByText('children')).not.toBeInTheDocument()
    })
  })
})
