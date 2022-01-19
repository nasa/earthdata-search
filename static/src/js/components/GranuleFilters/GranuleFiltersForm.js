import React from 'react'
import PropTypes from 'prop-types'
import { Form as FormikForm } from 'formik'
import {
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
  Row
} from 'react-bootstrap'

import moment from 'moment'

import { findGridByName } from '../../util/grid'
import { getTemporalDateFormat } from '../../util/edscDate'
import { getValueForTag } from '../../../../../sharedUtils/tags'
import { pluralize } from '../../util/pluralize'

import SidebarFiltersItem from '../Sidebar/SidebarFiltersItem'
import SidebarFiltersList from '../Sidebar/SidebarFiltersList'
import TemporalSelection from '../TemporalSelection/TemporalSelection'
import Button from '../Button/Button'

import './GranuleFiltersForm.scss'

/**
 * Renders GranuleFiltersForm.
 * @param {Object} props - The props passed into the component.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Object} props.collectionMetadata - The focused collection metadata.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 */
export const GranuleFiltersForm = (props) => {
  const {
    collectionMetadata,
    errors,
    excludedGranuleIds,
    handleBlur,
    handleChange,
    handleSubmit,
    onUndoExcludeGranule,
    setFieldTouched,
    setFieldValue,
    touched,
    values
  } = props

  const {
    browseOnly = false,
    cloudCover = {},
    dayNightFlag = '',
    equatorCrossingDate = {},
    equatorCrossingLongitude = {},
    readableGranuleName = '',
    gridCoords = '',
    onlineOnly = false,
    orbitNumber = {},
    tilingSystem = '',
    temporal = {}
  } = values

  const { isRecurring } = temporal

  // For recurring dates we don't show the year, it's displayed on the slider
  const temporalDateFormat = getTemporalDateFormat(isRecurring)

  const {
    min: cloudCoverMin = '',
    max: cloudCoverMax = ''
  } = cloudCover

  const {
    min: orbitNumberMin = '',
    max: orbintNumberMax = ''
  } = orbitNumber

  const {
    min: equatorCrossingLongitudeMin = '',
    max: equatorCrossingLongitudeMax = ''
  } = equatorCrossingLongitude

  const {
    id: collectionId,
    isOpenSearch,
    tags,
    tilingIdentificationSystems = []
  } = collectionMetadata

  const capabilities = getValueForTag('collection_capabilities', tags)

  let dayNightCapable
  let cloudCoverCapable
  let orbitCalculatedSpatialDomainsCapable

  if (capabilities) {
    dayNightCapable = capabilities.day_night_flag
    cloudCoverCapable = capabilities.cloud_cover
    orbitCalculatedSpatialDomainsCapable = capabilities.orbit_calculated_spatial_domains
  }

  const {
    cloudCover: cloudCoverError = {},
    gridCoords: gridCoordsError = '',
    orbitNumber: orbitNumberError = {},
    equatorCrossingLongitude: equatorCrossingLongitudeError = {},
    equatorCrossingDate: equatorCrossingDateError = {},
    temporal: temporalError = {},
    readableGranuleName: readableGranuleNameError
  } = errors

  const {
    cloudCover: cloudCoverTouched = {},
    gridCoords: gridCoordsTouched = false,
    orbitNumber: orbitNumberTouched = {},
    equatorCrossingLongitude: equatorCrossingLongitudeTouched = {},
    equatorCrossingDate: equatorCrossingDateTouched = {},
    temporal: temporalTouched = {},
    readableGranuleName: readableGranuleNameTouched
  } = touched

  // Determine the tiling system names
  const tilingSystemOptions = []

  let axis0label
  let axis1label

  let coordinateOneLimits
  let coordinateTwoLimits

  // If the collection supports tiling identification systems
  if (
    tilingIdentificationSystems
    && tilingIdentificationSystems.length > 0
  ) {
    tilingIdentificationSystems.forEach((system) => {
      const { tilingIdentificationSystemName } = system

      tilingSystemOptions.push(
        <option key={tilingIdentificationSystemName} value={tilingIdentificationSystemName}>
          {tilingIdentificationSystemName}
        </option>
      )
    })

    // If the form field for tiling system has a value
    if (tilingSystem) {
      // Retrieve predefined coordinate system information
      const selectedGrid = findGridByName(tilingSystem);

      ({
        axis0label,
        axis1label
      } = selectedGrid)

      // Find the selected tiling system within the collection metadata
      const systemFromMetadata = tilingIdentificationSystems.find((system) => (
        system.tilingIdentificationSystemName === tilingSystem
      ))

      // Don't render these fields if no tiling system is found
      if (!systemFromMetadata) return null

      const {
        coordinate1,
        coordinate2
      } = systemFromMetadata

      // Fetch coordinate limits from the collection metadata
      coordinateOneLimits = `(min: ${coordinate1.minimumValue}, max: ${coordinate1.maximumValue})`
      coordinateTwoLimits = `(min: ${coordinate2.minimumValue}, max: ${coordinate2.maximumValue})`
    }
  }

  // Blur the field and submit the form. Should be used on text fields.
  const submitOnBlur = (e) => {
    handleBlur(e)
    handleSubmit(e)
  }

  // Submit the form when the enter key is pressed. Should be used on text fields.
  const submitOnKeypress = (e) => {
    const {
      key = ''
    } = e
    if (key === 'Enter') {
      handleBlur(e)
      handleSubmit(e)
    }
  }

  // Change the field and submit the form. Should be used on checkboxes or selects.
  const submitOnChange = (e) => {
    handleChange(e)
    handleSubmit(e)
  }

  return (
    <FormikForm className="granule-filters-form">
      <SidebarFiltersList>
        {
          excludedGranuleIds.length > 0 && (
            <SidebarFiltersItem heading="Filtered Granules">
              <div className="granule-filters-form__item">
                <span className="granule-filters-form__item-meta">
                  { excludedGranuleIds.length }
                  {' '}
                  {
                    pluralize('Granule', excludedGranuleIds.length)
                  }
                  {' Filtered'}
                </span>
                <Button
                  className="granule-filters-form__item-button"
                  label="Undo last filtered granule"
                  onClick={() => onUndoExcludeGranule(collectionId)}
                  type="button"
                  bootstrapSize="sm"
                  bootstrapVariant="primary"
                >
                  Undo
                </Button>
              </div>
            </SidebarFiltersItem>
          )
        }
        {
          !isOpenSearch && (
            <SidebarFiltersItem
              heading="Granule Search"
            >
              <div>
                <Form.Group
                  controlId="granule-filters_granule-search"
                >
                  <Form.Label className="mb-1" sm="auto">
                    Granule ID(s)
                  </Form.Label>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={(
                      <Tooltip
                        id="tooltip__granule-search"
                        className="tooltip--large tooltip--ta-left tooltip--wide"
                      >
                        <strong>Wildcards:</strong>
                        {' '}
                        <ul className="m-0">
                          <li>
                            * (asterisk) matches any number of characters
                          </li>
                          <li>
                            ? (question mark) matches exactly one character.
                          </li>
                        </ul>
                        <br />
                        <strong>Delimiters:</strong>
                        {' '}
                        Separate multiple granule IDs by commas.
                      </Tooltip>
                    )}
                  >
                    <Form.Control
                      name="readableGranuleName"
                      data-test-id="granule-filters__readable-granule-name"
                      size="sm"
                      type="text"
                      placeholder="Search Single or Multiple Granule IDs..."
                      value={readableGranuleName}
                      onChange={handleChange}
                      onBlur={submitOnBlur}
                      onKeyPress={submitOnKeypress}
                    />
                  </OverlayTrigger>
                  {
                    readableGranuleNameTouched && (
                      <Form.Control.Feedback type="invalid">
                        {readableGranuleNameError}
                      </Form.Control.Feedback>
                    )
                  }
                </Form.Group>
              </div>
            </SidebarFiltersItem>
          )
        }
        {
          tilingSystemOptions.length > 0 && (
            <SidebarFiltersItem heading="Grid Coordinates">
              <div>
                <Form.Group controlId="granule-filters_tiling-system">
                  <Form.Label sm="auto">
                    Tiling System
                  </Form.Label>
                  <Form.Control
                    name="tilingSystem"
                    data-test-id="granule-filters__tiling-system"
                    size="sm"
                    as="select"
                    value={tilingSystem}
                    onChange={(e) => {
                      // Call the default change handler
                      handleChange(e)

                      const { target = {} } = e
                      const { value = '' } = target

                      // If the tiling system is empty clear the grid coordinates
                      if (value === '') {
                        setFieldValue('gridCoords', '')
                      }
                    }}
                  >
                    {[
                      <option key="tiling-system-none" value="">None</option>,
                      ...tilingSystemOptions
                    ]}
                  </Form.Control>
                </Form.Group>
                {
                  tilingSystem && (
                    <Form.Group
                      controlId="granule-filters_grid-coordinates"
                      className="mt-1"
                    >
                      <Form.Control
                        name="gridCoords"
                        data-test-id="granule-filters__grid-coordinates"
                        size="sm"
                        type="text"
                        placeholder="Coordinates..."
                        value={gridCoords}
                        onChange={handleChange}
                        onBlur={submitOnBlur}
                        onKeyPress={submitOnKeypress}
                        isInvalid={gridCoordsTouched && gridCoordsError}
                      />
                      {
                        gridCoordsTouched && (
                          <>
                            <Form.Control.Feedback type="invalid">
                              {gridCoordsError}
                            </Form.Control.Feedback>
                          </>
                        )
                      }
                      <Form.Text muted>
                        {`Enter ${axis0label} ${coordinateOneLimits} and ${axis1label} ${coordinateTwoLimits} coordinates separated by spaces, e.g. "2,3 5,7"`}
                      </Form.Text>
                    </Form.Group>
                  )
                }
              </div>
            </SidebarFiltersItem>
          )
        }
        <SidebarFiltersItem
          heading="Temporal"
        >
          <Form.Group controlId="granule-filters__temporal">
            <Form.Control
              as="div"
              className="form-control-basic"
              isInvalid={
                (temporalTouched.startDate && !!temporalError.startDate)
                || (temporalTouched.endDate && !!temporalError.endDate)
              }
            >
              <TemporalSelection
                controlId="granule-filters__temporal-selection"
                size="sm"
                format={temporalDateFormat}
                temporal={temporal}
                validate={false}
                onRecurringToggle={(e) => {
                  const isChecked = e.target.checked

                  setFieldValue('temporal.isRecurring', isChecked)
                  setFieldTouched('temporal.isRecurring', isChecked)

                  setTimeout(() => {
                    handleSubmit()
                  }, 0)
                }}
                onChangeRecurring={(value) => {
                  const { temporal } = values

                  const newStartDate = moment(temporal.startDate || undefined).utc()
                  newStartDate.set({
                    year: value.min,
                    hour: '00',
                    minute: '00',
                    second: '00'
                  })

                  const newEndDate = moment(temporal.endDate || undefined).utc()
                  newEndDate.set({
                    year: value.max,
                    hour: '23',
                    minute: '59',
                    second: '59'
                  })

                  setFieldValue('temporal.startDate', newStartDate.toISOString())
                  setFieldTouched('temporal.startDate')

                  setFieldValue('temporal.endDate', newEndDate.toISOString())
                  setFieldTouched('temporal.endDate')

                  setFieldValue('temporal.recurringDayStart', newStartDate.dayOfYear())
                  setFieldValue('temporal.recurringDayEnd', newEndDate.dayOfYear())

                  handleSubmit()
                }}
                onSubmitStart={(startDate) => {
                  // eslint-disable-next-line no-underscore-dangle
                  const value = startDate.isValid() ? startDate.toISOString() : startDate._i
                  setFieldValue('temporal.startDate', value)
                  setFieldTouched('temporal.startDate')

                  const { temporal } = values
                  if (temporal.isRecurring) {
                    setFieldValue('temporal.recurringDayStart', startDate.dayOfYear())
                  }

                  handleSubmit()
                }}
                onSubmitEnd={(endDate) => {
                  // eslint-disable-next-line no-underscore-dangle
                  const value = endDate.isValid() ? endDate.toISOString() : endDate._i
                  setFieldValue('temporal.endDate', value)
                  setFieldTouched('temporal.endDate')

                  const { temporal } = values
                  if (temporal.isRecurring) {
                    setFieldValue('temporal.recurringDayEnd', endDate.dayOfYear())
                  }

                  handleSubmit()
                }}
              />
            </Form.Control>
            {
              temporalTouched.startDate && (
                <>
                  <Form.Control.Feedback type="invalid">
                    {temporalError.startDate}
                  </Form.Control.Feedback>
                </>
              )
            }
            {
              temporalTouched.endDate && (
                <>
                  <Form.Control.Feedback type="invalid">
                    {temporalError.endDate}
                  </Form.Control.Feedback>
                </>
              )
            }
          </Form.Group>
        </SidebarFiltersItem>
        {
          !isOpenSearch && (
            <>
              {
                dayNightCapable && (
                  <SidebarFiltersItem
                    heading="Day/Night"
                    description="Find granules captured during the day, night or anytime."
                  >
                    <Row>
                      <Col>
                        <Form.Group controlId="granule-filters__day-night-flag">
                          <Form.Control
                            name="dayNightFlag"
                            data-test-id="granule-filters__day-night-flag"
                            as="select"
                            value={dayNightFlag}
                            onChange={submitOnChange}
                            size="sm"
                          >
                            <option value="">Anytime</option>
                            <option value="DAY">Day</option>
                            <option value="NIGHT">Night</option>
                            <option value="BOTH">Both</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                  </SidebarFiltersItem>
                )
              }
              <SidebarFiltersItem
                heading="Data Access"
              >
                <Form.Group controlId="granule-filters__data-access">
                  <Form.Check
                    id="input__browse-only"
                    data-test-id="granule-filters__browse-only"
                    name="browseOnly"
                    label="Find only granules that have browse images"
                    checked={browseOnly}
                    value={browseOnly}
                    onChange={submitOnChange}
                  />
                  <Form.Check
                    id="input__online-only"
                    data-test-id="granule-filters__online-only"
                    name="onlineOnly"
                    label="Find only granules that are available online"
                    checked={onlineOnly}
                    value={onlineOnly}
                    onChange={submitOnChange}
                  />
                </Form.Group>
              </SidebarFiltersItem>
              {
                cloudCoverCapable && (
                  <SidebarFiltersItem
                    heading="Cloud Cover"
                    description="Find granules by cloud cover percentage."
                  >
                    <Form.Group
                      as={Row}
                      controlId="granule-filters__cloud-cover-min"
                      noGutters
                    >
                      <Form.Label column sm={5}>
                        Minimum
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          name="cloudCover.min"
                          data-test-id="granule-filters__cloud-cover-min"
                          type="text"
                          size="sm"
                          placeholder="Example: 10"
                          value={cloudCoverMin}
                          onChange={handleChange}
                          onBlur={submitOnBlur}
                          isInvalid={cloudCoverTouched.min && !!cloudCoverError.min}
                        />
                        {
                          cloudCoverTouched.min && (
                            <Form.Control.Feedback type="invalid">
                              {cloudCoverError.min}
                            </Form.Control.Feedback>
                          )
                        }
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      controlId="granule-filters__cloud-cover-max"
                      noGutters
                    >
                      <Form.Label column sm={5}>
                        Maximum
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          name="cloudCover.max"
                          data-test-id="granule-filters__cloud-cover-max"
                          type="text"
                          size="sm"
                          placeholder="Example: 50"
                          value={cloudCoverMax}
                          onChange={handleChange}
                          onBlur={submitOnBlur}
                          isInvalid={cloudCoverTouched.max && !!cloudCoverError.max}
                        />
                        {
                          cloudCoverTouched.max && (
                            <Form.Control.Feedback type="invalid">
                              {cloudCoverError.max}
                            </Form.Control.Feedback>
                          )
                        }
                      </Col>
                    </Form.Group>
                  </SidebarFiltersItem>
                )
              }
              {
                (!isOpenSearch && orbitCalculatedSpatialDomainsCapable) && (
                  <>
                    <SidebarFiltersItem
                      heading="Orbit Number"
                    >
                      <Form.Group
                        as={Row}
                        controlId="granule-filters__orbit-number-min"
                        noGutters
                      >
                        <Form.Label column="sm">
                          Minimum
                        </Form.Label>
                        <Col sm={7}>
                          <Form.Control
                            name="orbitNumber.min"
                            data-test-id="granule-filters__orbit-number-min"
                            type="text"
                            size="sm"
                            placeholder="Example: 30000"
                            value={orbitNumberMin}
                            onChange={handleChange}
                            onBlur={submitOnBlur}
                            onKeyPress={submitOnKeypress}
                            isInvalid={orbitNumberTouched.min && !!orbitNumberError.min}
                          />
                          {
                            orbitNumberTouched.min && (
                              <Form.Control.Feedback type="invalid">
                                {orbitNumberError.min}
                              </Form.Control.Feedback>
                            )
                          }
                        </Col>
                      </Form.Group>
                      <Form.Group
                        as={Row}
                        controlId="granule-filters__orbit-number-max"
                        size="sm"
                        noGutters
                      >
                        <Form.Label column="sm" sm={5}>
                          Maximum
                        </Form.Label>
                        <Col sm={7}>
                          <Form.Control
                            name="orbitNumber.max"
                            data-test-id="granule-filters__orbit-number-max"
                            type="text"
                            size="sm"
                            placeholder="Example: 30009"
                            value={orbintNumberMax}
                            onChange={handleChange}
                            onBlur={submitOnBlur}
                            onKeyPress={submitOnKeypress}
                            isInvalid={orbitNumberTouched.max && !!orbitNumberError.max}
                          />
                          {
                            orbitNumberTouched.min && (
                              <Form.Control.Feedback type="invalid">
                                {orbitNumberError.max}
                              </Form.Control.Feedback>
                            )
                          }
                        </Col>
                      </Form.Group>
                    </SidebarFiltersItem>

                    <SidebarFiltersItem
                      heading="Equatorial Crossing Longitude"
                    >
                      <Form.Group
                        as={Row}
                        controlId="granule-filters__equatorial-crossing-longitude-min"
                        noGutters
                      >
                        <Form.Label column="sm" sm={5}>
                          Minimum
                        </Form.Label>
                        <Col sm={7}>
                          <Form.Control
                            name="equatorCrossingLongitude.min"
                            data-test-id="granule-filters__equatorial-crossing-longitude-min"
                            type="text"
                            size="sm"
                            placeholder="Example: -45"
                            value={equatorCrossingLongitudeMin}
                            onChange={handleChange}
                            onBlur={submitOnBlur}
                            onKeyPress={submitOnKeypress}
                            isInvalid={equatorCrossingLongitudeTouched.min
                              && !!equatorCrossingLongitudeError.min}
                          />
                          {
                            equatorCrossingLongitudeTouched.min && (
                              <Form.Control.Feedback type="invalid">
                                {equatorCrossingLongitudeError.min}
                              </Form.Control.Feedback>
                            )
                          }
                        </Col>
                      </Form.Group>
                      <Form.Group
                        as={Row}
                        controlId="granule-filters__equatorial-crossing-longitude-max"
                        noGutters
                      >
                        <Form.Label column="sm" sm={5}>
                          Maximum
                        </Form.Label>
                        <Col sm={7}>
                          <Form.Control
                            name="equatorCrossingLongitude.max"
                            data-test-id="granule-filters__equatorial-crossing-longitude-max"
                            type="text"
                            size="sm"
                            placeholder="Example: 45"
                            value={equatorCrossingLongitudeMax}
                            onChange={handleChange}
                            onBlur={submitOnBlur}
                            onKeyPress={submitOnKeypress}
                            isInvalid={equatorCrossingLongitudeTouched.max
                              && !!equatorCrossingLongitudeError.max}
                          />
                          {
                            equatorCrossingLongitudeTouched.max && (
                              <Form.Control.Feedback type="invalid">
                                {equatorCrossingLongitudeError.max}
                              </Form.Control.Feedback>
                            )
                          }
                        </Col>
                      </Form.Group>
                    </SidebarFiltersItem>

                    <SidebarFiltersItem
                      heading="Equatorial Crossing Date"
                    >
                      <Form.Group controlId="granule-filters__equatorial-crossing-date">
                        <Form.Control
                          as="div"
                          className="form-control-basic"
                          isInvalid={
                            (equatorCrossingDateTouched.startDate
                              && !!equatorCrossingDateError.startDate)
                            || (equatorCrossingDateTouched.endDate
                              && !!equatorCrossingDateError.endDate)
                          }
                        >
                          <TemporalSelection
                            allowRecurring={false}
                            controlId="granule-filters__equatorial-crossing-date-selection"
                            size="sm"
                            format={temporalDateFormat}
                            temporal={equatorCrossingDate}
                            validate={false}
                            onSubmitStart={(startDate) => {
                              const value = startDate.isValid()
                                // eslint-disable-next-line no-underscore-dangle
                                ? startDate.toISOString() : startDate._i
                              setFieldValue('equatorCrossingDate.startDate', value)
                              setFieldTouched('equatorCrossingDate.startDate')

                              handleSubmit()
                            }}
                            onSubmitEnd={(endDate) => {
                              const value = endDate.isValid()
                              // eslint-disable-next-line no-underscore-dangle
                                ? endDate.toISOString() : endDate._i
                              setFieldValue('equatorCrossingDate.endDate', value)
                              setFieldTouched('equatorCrossingDate.endDate')

                              handleSubmit()
                            }}
                          />
                        </Form.Control>
                        {
                          equatorCrossingDateTouched.startDate && (
                            <>
                              <Form.Control.Feedback type="invalid">
                                {equatorCrossingDateError.startDate}
                              </Form.Control.Feedback>
                            </>
                          )
                        }
                        {
                          equatorCrossingDateTouched.endDate && (
                            <>
                              <Form.Control.Feedback type="invalid">
                                {equatorCrossingDateError.endDate}
                              </Form.Control.Feedback>
                            </>
                          )
                        }
                      </Form.Group>
                    </SidebarFiltersItem>
                  </>
                )
              }
            </>
          )
        }
      </SidebarFiltersList>
    </FormikForm>
  )
}

GranuleFiltersForm.propTypes = {
  collectionMetadata: PropTypes.shape({
    id: PropTypes.string,
    isOpenSearch: PropTypes.bool,
    tags: PropTypes.shape({}),
    tilingIdentificationSystems: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  errors: PropTypes.shape({
    cloudCover: PropTypes.shape({}),
    gridCoords: PropTypes.string,
    orbitNumber: PropTypes.shape({}),
    equatorCrossingLongitude: PropTypes.shape({}),
    equatorCrossingDate: PropTypes.shape({}),
    temporal: PropTypes.shape({}),
    readableGranuleName: PropTypes.string
  }).isRequired,
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onUndoExcludeGranule: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.shape({
    cloudCover: PropTypes.shape({}),
    gridCoords: PropTypes.string,
    orbitNumber: PropTypes.shape({}),
    equatorCrossingLongitude: PropTypes.shape({}),
    equatorCrossingDate: PropTypes.shape({}),
    temporal: PropTypes.shape({}),
    readableGranuleName: PropTypes.string
  }).isRequired,
  values: PropTypes.shape({
    browseOnly: PropTypes.bool,
    cloudCover: PropTypes.shape({}),
    dayNightFlag: PropTypes.string,
    equatorCrossingDate: PropTypes.shape({}),
    equatorCrossingLongitude: PropTypes.shape({}),
    readableGranuleName: PropTypes.string,
    gridCoords: PropTypes.string,
    onlineOnly: PropTypes.bool,
    orbitNumber: PropTypes.shape({}),
    tilingSystem: PropTypes.string,
    temporal: PropTypes.shape({
      isRecurring: PropTypes.bool,
      endDate: PropTypes.string,
      startDate: PropTypes.string
    })
  }).isRequired
}

export default GranuleFiltersForm
