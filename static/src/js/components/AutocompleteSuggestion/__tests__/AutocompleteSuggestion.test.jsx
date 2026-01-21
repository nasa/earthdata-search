import setupTest from '../../../../../../vitestConfigs/setupTest'
import getByTextWithMarkup from '../../../../../../vitestConfigs/getByTextWithMarkup'
import AutocompleteSuggestion from '../AutocompleteSuggestion'

const setup = setupTest({
  Component: AutocompleteSuggestion,
  defaultProps: {
    suggestion: {}
  }
})

describe('AutocompleteSuggestion component', () => {
  test('renders nothing when no suggestion is provided', () => {
    const { container } = setup()

    expect(container.innerHTML).toBe('')
  })

  test('renders a standard result correctly', () => {
    setup({
      overrideProps: {
        suggestion: {
          type: 'instrument',
          value: 'MODIS'
        }
      }
    })

    const element = getByTextWithMarkup('Instrument:MODIS')
    expect(element).toBeInTheDocument()
  })

  test('renders a science keyword result correctly', () => {
    setup({
      overrideProps: {
        suggestion: {
          type: 'science_keywords',
          value: 'Modis Total Pigment Concentration',
          fields: 'Biosphere:Microbiota:Pigments:Modis Total Pigment Concentration'
        }
      }
    })

    const element = getByTextWithMarkup('Science Keywords:Biosphere Microbiota Pigments Modis Total Pigment Concentration')
    expect(element).toBeInTheDocument()
  })
})
