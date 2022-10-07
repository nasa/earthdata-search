import * as formatters from '../humanizedQueryValueFormatters'
import { humanizedQueryValueFormattingMap } from '../humanizedQueryValueFormattingMap'

jest.mock('../humanizedQueryValueFormatters', () => ({
  formatBoolean: jest.fn(),
  formatCircle: jest.fn(),
  formatFacetHierarchy: jest.fn(),
  formatPoints: jest.fn(),
  formatTemporal: jest.fn()
}))

const formatBooleanMock = jest.spyOn(formatters, 'formatBoolean')
const formatCircleMock = jest.spyOn(formatters, 'formatCircle')
const formatFacetHierarchyMock = jest.spyOn(formatters, 'formatFacetHierarchy')
const formatPointsMock = jest.spyOn(formatters, 'formatPoints')
const formatTemporalMock = jest.spyOn(formatters, 'formatTemporal')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('humanizedQueryValueFormattingMap', () => {
  describe('when formatting boundingBox', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.boundingBox('1,2,3,4')
      expect(formatPointsMock).toHaveBeenCalledTimes(1)
      expect(formatPointsMock).toHaveBeenCalledWith('1,2,3,4')
    })
  })

  describe('when formatting browseOnly', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.browseOnly(true)
      expect(formatBooleanMock).toHaveBeenCalledTimes(1)
      expect(formatBooleanMock).toHaveBeenCalledWith(true)
    })
  })

  describe('when formatting circle', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.circle('1,2,3')
      expect(formatCircleMock).toHaveBeenCalledTimes(1)
      expect(formatCircleMock).toHaveBeenCalledWith('1,2,3')
    })
  })

  describe('when formatting cloudHosted', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.cloudHosted(true)
      expect(formatBooleanMock).toHaveBeenCalledTimes(1)
      expect(formatBooleanMock).toHaveBeenCalledWith(true)
    })
  })

  describe('when formatting dataCenterH', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.dataCenterH(['one', 'two', 'three'])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith(['one', 'two', 'three'])
    })
  })

  describe('when formatting granuleDataFormatH', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.granuleDataFormatH(['one', 'two', 'three'])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith(['one', 'two', 'three'])
    })
  })

  describe('when formatting horizontalDataResolutionRange', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.horizontalDataResolutionRange(['one', 'two', 'three'])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith(['one', 'two', 'three'])
    })
  })

  describe('when formatting instrumentH', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.instrumentH(['one', 'two', 'three'])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith(['one', 'two', 'three'])
    })
  })

  describe('when formatting latency', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.latency(['one', 'two', 'three'])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith(['one', 'two', 'three'])
    })
  })

  describe('when formatting line', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.line('1,2,3,4,5,6')
      expect(formatPointsMock).toHaveBeenCalledTimes(1)
      expect(formatPointsMock).toHaveBeenCalledWith('1,2,3,4,5,6')
    })
  })

  describe('when formatting onlineOnly', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.onlineOnly(true)
      expect(formatBooleanMock).toHaveBeenCalledTimes(1)
      expect(formatBooleanMock).toHaveBeenCalledWith(true)
    })
  })

  describe('when formatting onlyEosdisCollections', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.onlyEosdisCollections(true)
      expect(formatBooleanMock).toHaveBeenCalledTimes(1)
      expect(formatBooleanMock).toHaveBeenCalledWith(true)
    })
  })

  describe('when formatting platformsH', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.platformsH([{
        basis: 'basis',
        category: 'category',
        sub_category: 'sub_category',
        short_name: 'short_name'
      }])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith([{
        basis: 'basis',
        category: 'category',
        sub_category: 'sub_category',
        short_name: 'short_name'
      }],
      [
        'basis',
        'category',
        'sub_category',
        'short_name'
      ])
    })
  })

  describe('when formatting point', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.point('1,2')
      expect(formatPointsMock).toHaveBeenCalledTimes(1)
      expect(formatPointsMock).toHaveBeenCalledWith('1,2')
    })
  })

  describe('when formatting polygon', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.polygon(['1,2,3,4,5,6,1,2'])
      expect(formatPointsMock).toHaveBeenCalledTimes(1)
      expect(formatPointsMock).toHaveBeenCalledWith(['1,2,3,4,5,6,1,2'])
    })
  })

  describe('when formatting processingLevelIdH', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.processingLevelIdH(['one', 'two', 'three'])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith(['one', 'two', 'three'])
    })
  })

  describe('when formatting projectH', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.projectH(['one', 'two', 'three'])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith(['one', 'two', 'three'])
    })
  })

  describe('when formatting scienceKeywordsH', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.scienceKeywordsH([{
        topic: 'topic',
        term: 'term',
        variable_level_1: 'variable_level_1',
        variable_level_2: 'variable_level_2',
        variable_level_3: 'variable_level_3',
        detailed_variable: 'detailed_variable'
      }])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith([{
        topic: 'topic',
        term: 'term',
        variable_level_1: 'variable_level_1',
        variable_level_2: 'variable_level_2',
        variable_level_3: 'variable_level_3',
        detailed_variable: 'detailed_variable'
      }],
      [
        'topic',
        'term',
        'variable_level_1',
        'variable_level_2',
        'variable_level_3',
        'detailed_variable'
      ])
    })
  })

  describe('when formatting temporal', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.temporal('2000-01-01T10:00:00Z,2010-03-10T12:00:00Z,1,69')
      expect(formatTemporalMock).toHaveBeenCalledTimes(1)
      expect(formatTemporalMock).toHaveBeenCalledWith('2000-01-01T10:00:00Z,2010-03-10T12:00:00Z,1,69')
    })
  })

  describe('when formatting temporalString', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.temporalString('2000-01-01T10:00:00Z,2010-03-10T12:00:00Z,1,69')
      expect(formatTemporalMock).toHaveBeenCalledTimes(1)
      expect(formatTemporalMock).toHaveBeenCalledWith('2000-01-01T10:00:00Z,2010-03-10T12:00:00Z,1,69')
    })
  })

  describe('when formatting tilingSystem', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.tilingSystem(['one', 'two', 'three'])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith(['one', 'two', 'three'])
    })
  })

  describe('when formatting twoDCoordinateSystemName', () => {
    test('calls the correct formatter with the correct arguments', () => {
      humanizedQueryValueFormattingMap.twoDCoordinateSystemName(['one', 'two', 'three'])
      expect(formatFacetHierarchyMock).toHaveBeenCalledTimes(1)
      expect(formatFacetHierarchyMock).toHaveBeenCalledWith(['one', 'two', 'three'])
    })
  })
})
