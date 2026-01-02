import React from 'react'
import PropTypes from 'prop-types'
import { Form as FormikForm } from 'formik'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'

import { FaQuestionCircle } from 'react-icons/fa'
import moment from 'moment'

import { findGridByName } from '../../util/grid'
import { getTemporalDateFormat } from '../../../../../sharedUtils/edscDate'
import { getValueForTag } from '../../../../../sharedUtils/tags'
import { pluralize } from '../../util/pluralize'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import renderTooltip from '../../util/renderTooltip'
import { metricsGranuleFilter } from '../../util/metrics/metricsGranuleFilter'

import SidebarFiltersItem from '../Sidebar/SidebarFiltersItem'
import SidebarFiltersList from '../Sidebar/SidebarFiltersList'
import TemporalSelection from '../TemporalSelection/TemporalSelection'
import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedCollectionGranuleQuery } from '../../zustand/selectors/query'
import { getFocusedCollectionMetadata } from '../../zustand/selectors/collection'

import './GranuleFiltersForm.scss'

/**
 * Renders GranuleFiltersForm.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.handleSubmit - Callback function passed from the container.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 */
export const GranuleFiltersForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    touched,
    values
  } = props

  const collectionMetadata = useEdscStore(getFocusedCollectionMetadata)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const { excludedGranuleIds = [] } = granuleQuery
  const undoExcludeGranule = useEdscStore((state) => state.query.undoExcludeGranule)

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
    minimumTemporalDateString,
    temporalDateFormatFull
  } = getApplicationConfig()
  const minDate = moment(
    minimumTemporalDateString,
    temporalDateFormatFull
  )

  const {
    min: cloudCoverMin = '',
    max: cloudCoverMax = ''
  } = cloudCover

  const {
    min: orbitNumberMin = '',
    max: orbitNumberMax = ''
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

  // Handle parsing and submitting metrics for form events
  const handleEventMetrics = (event) => {
    const eventType = event.target.name
    const eventValue = event.target.value
    const checkboxForms = ['onlineOnly', 'browseOnly']
    if (checkboxForms.includes(eventType)) {
      const eventChecked = event.target.checked
      // Event checked is the current state of the checkbox which we want to take the metric for
      metricsGranuleFilter({
        type: eventType,
        value: eventChecked
      })

      return
    }

    metricsGranuleFilter({
      type: eventType,
      value: eventValue
    })
  }

  // Blur the field and submit the form. Should be used on text fields.
  const submitOnBlur = (event) => {
    handleBlur(event)
    handleSubmit(event)
    handleEventMetrics(event)
  }

  // Submit the form when the enter key is pressed. Should be used on text fields.
  const submitOnKeypress = (event) => {
    const {
      key = ''
    } = event
    if (key === 'Enter') {
      handleBlur(event)
      handleSubmit(event)

      // Get metrics for what text-field, strings are being used
      handleEventMetrics(event)
    }
  }

  // Change the field and submit the form. Should be used on checkboxes or selects.
  const submitOnChange = (event) => {
    handleChange(event)
    handleSubmit(event)

    // Get metrics for what checkbox was selected
    handleEventMetrics(event)
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
                  {pluralize('Granule', excludedGranuleIds.length)}
                  {' Filtered'}
                </span>
                <Button
                  className="granule-filters-form__item-button"
                  label="Undo last filtered granule"
                  onClick={() => undoExcludeGranule(collectionId)}
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
                    placement="top"
                    overlay={
                      (tooltipProps) => renderTooltip({
                        children: (
                          <>
                            <p>
                              Filter granules by using a granule ID.
                              Enter an ID to find an exact match or use a wildcard
                              and/or delimiter to search using a more complex query.
                            </p>
                            <strong className="granule-filters-form__readable-granule-name-tooltip-title">
                              Search granules using wildcard characters
                            </strong>
                            <ul className="m-0 font-size granule-filters-form__readable-granule-name-tooltip-list">
                              <li>
                                Question marks
                                {' ('}
                                <strong className="font-weight-bold">?</strong>
                                {') '}
                                match a single character in that location
                              </li>
                              <li>
                                Asterisks
                                {' ('}
                                <strong className="font-weight-bold">*</strong>
                                {') '}
                                match any number of characters in that location
                              </li>
                            </ul>
                            <br />
                            <strong className="granule-filters-form__readable-granule-name-tooltip-title">
                              Search granules using multiple IDs
                            </strong>
                            <ul className="m-0 granule-filters-form__readable-granule-name-tooltip-list">
                              <li>
                                Commas
                                {' ('}
                                <strong className="font-weight-bold">,</strong>
                                {') '}
                                are used to separate multiple searches
                              </li>
                            </ul>
                          </>
                        ),
                        className: 'tooltip--ta-left tooltip--wide',
                        id: 'granule-filters-form-id-filter-tooltip',
                        ...tooltipProps
                      })
                    }
                  >
                    <EDSCIcon
                      aria-label="A question mark in a circle"
                      icon={FaQuestionCircle}
                      role="img"
                      size="10"
                      variant="more-info"
                    />
                  </OverlayTrigger>
                  <Form.Control
                    name="readableGranuleName"
                    data-testid="granule-filters__readable-granule-name"
                    size="sm"
                    type="text"
                    placeholder="Example: *_20240101_*,*_20240102_*"
                    value={readableGranuleName}
                    onChange={handleChange}
                    onBlur={submitOnBlur}
                    onKeyPress={submitOnKeypress}
                  />
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
                    data-testid="granule-filters__tiling-system"
                    size="sm"
                    as="select"
                    value={tilingSystem}
                    onChange={
                      (event) => {
                        // Call the default change handler
                        handleChange(event)

                        const { target = {} } = event
                        const { value = '' } = target

                        // Track tiling system used
                        handleEventMetrics(event)

                        // If the tiling system is empty clear the grid coordinates
                        if (value === '') {
                          setFieldValue('gridCoords', '')
                        }
                      }
                    }
                  >
                    {
                      [
                        <option key="tiling-system-none" value="">None</option>,
                        ...tilingSystemOptions
                      ]
                    }
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
                        data-testid="granule-filters__grid-coordinates"
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
                          <Form.Control.Feedback type="invalid">
                            {gridCoordsError}
                          </Form.Control.Feedback>
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
                displayStartDate={temporal.startDate}
                displayEndDate={temporal.endDate}
                validate={false}
                onSliderChange={
                  (value) => {
                    const startDate = temporal.startDate ? moment(temporal.startDate) : moment()
                    const endDate = temporal.endDate ? moment(temporal.endDate) : moment()
                    setFieldValue('temporal.startDate', startDate.year(value.min).toISOString())
                    setFieldValue('temporal.endDate', endDate.year(value.max).toISOString())
                  }
                }
                onRecurringToggle={
                  (event) => {
                    const isChecked = event.target.checked

                    setFieldValue('temporal.isRecurring', isChecked)
                    setFieldTouched('temporal.isRecurring', isChecked)

                    if (isChecked && temporal) {
                      if (temporal.startDate) {
                        const startDate = moment(temporal.startDate).utc()

                        if (temporal.endDate) {
                          const endDate = moment(temporal.endDate).utc()

                          if (startDate.year() === endDate.year()) {
                            // Preserve original month/day while setting to minimum year
                            const newStartDate = moment(startDate).year(minDate.year())
                            setFieldValue('temporal.startDate', newStartDate.toISOString())
                          }

                          setFieldValue('temporal.recurringDayStart', startDate.dayOfYear())
                          // Use the start year to calculate the end day of year. This avoids leap years potentially causing day mismatches
                          setFieldValue('temporal.recurringDayEnd', endDate.year(startDate.year()).dayOfYear())
                        }
                      }
                    }

                    // Take metric when the isRecurring toggle is turned on
                    metricsGranuleFilter({
                      type: 'Set Recurring',
                      value: isChecked
                    })

                    handleSubmit()
                  }
                }
                onChangeRecurring={
                  (value) => {
                    const { temporal: newTemporal } = values

                    const newStartDate = moment(newTemporal.startDate || undefined)
                      .utc()
                      .year(value.min)

                    const newEndDate = moment(newTemporal.endDate || undefined)
                      .utc()
                      .year(value.max)

                    setFieldValue('temporal.startDate', newStartDate.toISOString())
                    setFieldTouched('temporal.startDate')

                    setFieldValue('temporal.endDate', newEndDate.toISOString())
                    setFieldTouched('temporal.endDate')

                    setFieldValue('temporal.recurringDayStart', newStartDate.dayOfYear())
                    setFieldValue('temporal.recurringDayEnd', newEndDate.year(value.min).dayOfYear())

                    handleSubmit()

                    // Add metrics for recurring temporal filter updates
                    metricsGranuleFilter({
                      type: 'Set Recurring',
                      value
                    })
                  }
                }
                onSubmitStart={
                  (startDate, shouldSubmit) => {
                    const { temporal: newTemporal } = values

                    // If the recurring toggle is toggled on, the format of the date drops the year, when
                    // converted into a moment object, this will erroneously set the year to the current year.
                    // To avoid this, we check if the temporal is recurring and set the year to the existing year in
                    // state.
                    if (newTemporal.isRecurring) {
                      const existingStartDate = moment(newTemporal.startDate)
                      if (existingStartDate.isValid()) {
                        const existingStartDateYear = existingStartDate.year()
                        startDate.year(existingStartDateYear)
                      }
                    }

                    const { input } = startDate.creationData()
                    const value = startDate.isValid() ? startDate.toISOString() : input
                    setFieldValue('temporal.startDate', value)
                    setFieldTouched('temporal.startDate')

                    if (newTemporal.isRecurring && newTemporal.endDate && startDate.isValid()) {
                      const endDate = moment(newTemporal.endDate).utc()

                      if (startDate.year() === endDate.year()) {
                        // Preserve original month/day while setting to minimum year
                        startDate.year(minDate.year())
                        setFieldValue('temporal.startDate', startDate.toISOString())
                      }
                    }

                    if (shouldSubmit && (startDate.isValid() || !input)) {
                      handleSubmit()

                      // Submit usage metric for setting Start Date granule filter
                      metricsGranuleFilter({
                        type: 'Set Start Date',
                        value
                      })
                    }
                  }
                }
                onSubmitEnd={
                  (endDate, shouldSubmit) => {
                    const { temporal: newTemporal } = values

                    // Like with start date, if the recurring toggle is toggled on, the format of the date drops the year.
                    // To avoid this, we check if the temporal is recurring and set the year to the existing year in state.
                    if (newTemporal.isRecurring) {
                      const existingEndDate = moment(newTemporal.endDate)
                      if (existingEndDate.isValid()) {
                        const existingEndDateYear = existingEndDate.year()
                        endDate.year(existingEndDateYear)
                      }
                    }

                    const { input } = endDate.creationData()
                    const value = endDate.isValid() ? endDate.toISOString() : input

                    setFieldValue('temporal.endDate', value)
                    setFieldTouched('temporal.endDate')

                    if (newTemporal.isRecurring && newTemporal.startDate && endDate.isValid()) {
                      const startDate = moment(newTemporal.startDate).utc()

                      if (startDate.year() === endDate.year()) {
                        // Preserve original month/day while setting to minimum year
                        startDate.year(minDate.year())
                        setFieldValue('temporal.startDate', startDate.toISOString())
                      }
                    }

                    if (shouldSubmit && (endDate.isValid() || !input)) {
                      handleSubmit()

                      // Submit usage metric for setting End Date granule filter
                      metricsGranuleFilter({
                        type: 'Set End Date',
                        value
                      })
                    }
                  }
                }
              />
            </Form.Control>
            {
              temporalTouched.startDate && (
                <Form.Control.Feedback type="invalid">
                  {temporalError.startDate}
                </Form.Control.Feedback>
              )
            }
            {
              temporalTouched.endDate && (
                <Form.Control.Feedback type="invalid">
                  {temporalError.endDate}
                </Form.Control.Feedback>
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
                            data-testid="granule-filters__day-night-flag"
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
                    data-testid="granule-filters__browse-only"
                    name="browseOnly"
                    label="Find only granules that have browse images"
                    checked={browseOnly}
                    value={browseOnly}
                    onChange={submitOnChange}
                  />
                  <Form.Check
                    id="input__online-only"
                    data-testid="granule-filters__online-only"
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
                      nogutters="true"
                    >
                      <Form.Label column sm={5}>
                        Minimum
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          name="cloudCover.min"
                          data-testid="granule-filters__cloud-cover-min"
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
                      nogutters="true"
                    >
                      <Form.Label column sm={5}>
                        Maximum
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          name="cloudCover.max"
                          data-testid="granule-filters__cloud-cover-max"
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
                        className="mb-1"
                        as={Row}
                        controlId="granule-filters__orbit-number-min"
                        nogutters="true"
                      >
                        <Form.Label column="sm">
                          Minimum
                        </Form.Label>
                        <Col sm={7}>
                          <Form.Control
                            name="orbitNumber.min"
                            data-testid="granule-filters__orbit-number-min"
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
                        nogutters="true"
                      >
                        <Form.Label column="sm" sm={5}>
                          Maximum
                        </Form.Label>
                        <Col sm={7}>
                          <Form.Control
                            name="orbitNumber.max"
                            data-testid="granule-filters__orbit-number-max"
                            type="text"
                            size="sm"
                            placeholder="Example: 30009"
                            value={orbitNumberMax}
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
                        className="mb-1"
                        as={Row}
                        controlId="granule-filters__equatorial-crossing-longitude-min"
                        nogutters="true"
                      >
                        <Form.Label column="sm" sm={5}>
                          Minimum
                        </Form.Label>
                        <Col sm={7}>
                          <Form.Control
                            name="equatorCrossingLongitude.min"
                            data-testid="granule-filters__equatorial-crossing-longitude-min"
                            type="text"
                            size="sm"
                            placeholder="Example: -45"
                            value={equatorCrossingLongitudeMin}
                            onChange={handleChange}
                            onBlur={submitOnBlur}
                            onKeyPress={submitOnKeypress}
                            isInvalid={
                              equatorCrossingLongitudeTouched.min
                              && !!equatorCrossingLongitudeError.min
                            }
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
                        nogutters="true"
                      >
                        <Form.Label column="sm" sm={5}>
                          Maximum
                        </Form.Label>
                        <Col sm={7}>
                          <Form.Control
                            name="equatorCrossingLongitude.max"
                            data-testid="granule-filters__equatorial-crossing-longitude-max"
                            type="text"
                            size="sm"
                            placeholder="Example: 45"
                            value={equatorCrossingLongitudeMax}
                            onChange={handleChange}
                            onBlur={submitOnBlur}
                            onKeyPress={submitOnKeypress}
                            isInvalid={
                              equatorCrossingLongitudeTouched.max
                              && !!equatorCrossingLongitudeError.max
                            }
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
                            displayStartDate={equatorCrossingDate.startDate}
                            displayEndDate={equatorCrossingDate.endDate}
                            validate={false}
                            onSubmitStart={
                              (startDate, shouldSubmit) => {
                                const { input } = startDate.creationData()
                                const value = startDate.isValid() ? startDate.toISOString() : input

                                setFieldValue('equatorCrossingDate.startDate', value)
                                setFieldTouched('equatorCrossingDate.startDate')

                                if (shouldSubmit && (startDate.isValid() || !input)) {
                                  handleSubmit()
                                  metricsGranuleFilter({
                                    type: 'Equatorial Crossing Set Start Date',
                                    value
                                  })
                                }
                              }
                            }
                            onSubmitEnd={
                              (endDate, shouldSubmit) => {
                                const { input } = endDate.creationData()
                                const value = endDate.isValid() ? endDate.toISOString() : input

                                setFieldValue('equatorCrossingDate.endDate', value)
                                setFieldTouched('equatorCrossingDate.endDate')

                                if (shouldSubmit && (endDate.isValid() || !input)) {
                                  handleSubmit()
                                  metricsGranuleFilter({
                                    type: 'Equatorial Crossing Set End Date',
                                    value
                                  })
                                }
                              }
                            }
                          />
                        </Form.Control>
                        {
                          equatorCrossingDateTouched.startDate && (
                            <Form.Control.Feedback type="invalid">
                              {equatorCrossingDateError.startDate}
                            </Form.Control.Feedback>
                          )
                        }
                        {
                          equatorCrossingDateTouched.endDate && (
                            <Form.Control.Feedback type="invalid">
                              {equatorCrossingDateError.endDate}
                            </Form.Control.Feedback>
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
  errors: PropTypes.shape({
    cloudCover: PropTypes.shape({}),
    gridCoords: PropTypes.string,
    orbitNumber: PropTypes.shape({}),
    equatorCrossingLongitude: PropTypes.shape({}),
    equatorCrossingDate: PropTypes.shape({}),
    temporal: PropTypes.shape({}),
    readableGranuleName: PropTypes.string
  }).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.shape({
    cloudCover: PropTypes.shape({}),
    gridCoords: PropTypes.bool,
    orbitNumber: PropTypes.shape({}),
    equatorCrossingLongitude: PropTypes.shape({}),
    equatorCrossingDate: PropTypes.shape({}),
    temporal: PropTypes.shape({}),
    readableGranuleName: PropTypes.bool
  }).isRequired,
  values: PropTypes.shape({
    browseOnly: PropTypes.bool,
    cloudCover: PropTypes.shape({}),
    dayNightFlag: PropTypes.string,
    equatorCrossingDate: PropTypes.shape({}),
    equatorCrossingLongitude: PropTypes.shape({}),
    readableGranuleName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
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
