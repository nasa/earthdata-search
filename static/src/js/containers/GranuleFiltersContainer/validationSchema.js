/* eslint-disable no-template-curly-in-string */
import * as Yup from 'yup'
import { isEmpty } from 'lodash'

import {
  dateOutsideRange,
  maxLessThanMin,
  minLessThanMax,
  nullableTemporal,
  nullableValue,
  startBeforeEnd
} from '../../util/validation'

const errors = {
  cloudCover: {
    invalidNumber: 'Enter a valid number',
    minMax: 'Value must be between 0.0 and 100.0',
    minLessThanMax: '${path} should be less than Maximum',
    maxGreaterThanMin: '${path} should be greater Minimum'
  },
  gridCoords: {
    required: 'Grid Coordinates are required when a Tiling System is selected'
  },
  orbitNumber: {
    invalidNumber: 'Enter a valid number',
    minMax: 'Value must greater than 0.0',
    minLessThanMax: '${path} should be less than Maximum',
    maxGreaterThanMin: '${path} should be greater Minimum'
  },
  equatorCrossingLongitude: {
    invalidNumber: 'Enter a valid number',
    minMax: 'Value must be between -180.0 and 180.0',
    minLessThanMax: '${path} should be less than Maximum',
    maxGreaterThanMin: '${path} should be greater Minimum'
  },
  equatorCrossingDate: {
    invalidStartDate: 'Enter a valid start date',
    invalidEndDate: 'Enter a valid end date',
    outsideRange: '${path} is outside current temporal range',
    startBeforeEnd: '${path} should be before End'
  },
  temporal: {
    invalidStartDate: 'Enter a valid start date',
    invalidEndDate: 'Enter a valid end date',
    outsideRange: '${path} is outside current temporal range',
    startBeforeEnd: '${path} should be before End'
  }
}

export const ValidationSchema = (props) => {
  const { temporal = {} } = props
  const { startDate = '', endDate = '' } = temporal

  return Yup.object().shape({
    tilingSystem: Yup.string(),
    gridCoords: Yup.string()
      .when('tilingSystem', {
        is: (tilingSystemValue) => !isEmpty(tilingSystemValue),
        then: Yup.string().required(errors.gridCoords.required)
      }),
    cloudCover: Yup.object().shape({
      min: Yup.number()
        .label('Minimum')
        .typeError(errors.cloudCover.invalidNumber)
        .test('min-less-than-max', errors.cloudCover.minLessThanMax, minLessThanMax)
        .min(0, errors.cloudCover.minMax)
        .max(100, errors.cloudCover.minMax)
        .transform(nullableValue)
        .nullable(),
      max: Yup.number()
        .label('Maximum')
        .typeError(errors.cloudCover.invalidNumber)
        .test('max-less-than-min', errors.cloudCover.maxGreaterThanMin, maxLessThanMin)
        .min(0, errors.cloudCover.minMax)
        .max(100, errors.cloudCover.minMax)
        .transform(nullableValue)
        .nullable()
    }),
    orbitNumber: Yup.object().shape({
      min: Yup.number()
        .label('Minimum')
        .typeError(errors.orbitNumber.invalidNumber)
        .test('min-less-than-max', errors.orbitNumber.minLessThanMax, minLessThanMax)
        .min(0, errors.orbitNumber.minMax)
        .transform(nullableValue)
        .nullable(),
      max: Yup.number()
        .label('Maximum')
        .typeError(errors.orbitNumber.invalidNumber)
        .test('max-less-than-min', errors.orbitNumber.maxGreaterThanMin, maxLessThanMin)
        .min(0, errors.orbitNumber.minMax)
        .transform(nullableValue)
        .nullable()
    }),
    equatorCrossingLongitude: Yup.object().shape({
      min: Yup.number()
        .label('Minimum')
        .typeError(errors.equatorCrossingLongitude.invalidNumber)
        .test('min-less-than-max', errors.equatorCrossingLongitude.minLessThanMax, minLessThanMax)
        .min(-180, errors.equatorCrossingLongitude.minMax)
        .max(180, errors.equatorCrossingLongitude.minMax)
        .transform(nullableValue)
        .nullable(),
      max: Yup.number()
        .label('Maximum')
        .typeError(errors.equatorCrossingLongitude.invalidNumber)
        .test('max-less-than-min', errors.equatorCrossingLongitude.maxGreaterThanMin, maxLessThanMin)
        .min(-180, errors.equatorCrossingLongitude.minMax)
        .max(180, errors.equatorCrossingLongitude.minMax)
        .transform(nullableValue)
        .nullable()
    }),
    equatorCrossingDate: Yup.object().shape({
      startDate: Yup.date()
        .label('Start')
        .typeError(errors.equatorCrossingDate.invalidStartDate)
        .transform(nullableTemporal)
        .nullable()
        .test('start-before-end', errors.equatorCrossingDate.startBeforeEnd, startBeforeEnd)
        .test('inside-global-equatorial-crossing-date', errors.equatorCrossingDate.outsideRange, (value) => dateOutsideRange(value, startDate, endDate)),
      endDate: Yup.date()
        .label('End')
        .typeError(errors.equatorCrossingDate.invalidEndDate)
        .transform(nullableTemporal)
        .nullable()
        .test('inside-global-equatorial-crossing-date', errors.equatorCrossingDate.outsideRange, (value) => dateOutsideRange(value, startDate, endDate))
    }),
    temporal: Yup.object().shape({
      startDate: Yup.date()
        .label('Start')
        .typeError(errors.temporal.invalidStartDate)
        .transform(nullableTemporal)
        .nullable()
        .test('start-before-end', errors.temporal.startBeforeEnd, startBeforeEnd)
        .test('inside-global-temporal', errors.temporal.outsideRange, (value) => dateOutsideRange(value, startDate, endDate)),
      endDate: Yup.date()
        .label('End')
        .typeError(errors.temporal.invalidEndDate)
        .transform(nullableTemporal)
        .nullable()
        .test('inside-global-temporal', errors.temporal.outsideRange, (value) => dateOutsideRange(value, startDate, endDate))
    }),
    readableGranuleName: Yup.string()
  })
}

export default ValidationSchema
