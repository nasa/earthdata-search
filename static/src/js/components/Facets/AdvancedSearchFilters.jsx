import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { pick } from 'lodash-es'
import { FaTimes } from 'react-icons/fa'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import FacetsList from './FacetsList'
import AdvancedFilterValueInput from './AdvancedFilterValueInput'
import DatepickerContainer from '../../containers/DatepickerContainer/DatepickerContainer'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import advancedCollectionFilters from '../../data/advancedCollectionFilters'
import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'

import './AdvancedSearchFilters.scss'

const advancedFilterKeys = advancedCollectionFilters.map(({ key }) => key)
const identifierFilterKeys = ['entryId', 'shortName', 'version']
const toArray = (value) => {
  if (Array.isArray(value)) return value

  return value ? [value] : []
}

const renderSelectedCount = (value) => {
  const count = Array.isArray(value) ? value.length : Number(Boolean(value))

  if (!count) return null

  return (
    <span className="facets-group__selected-count">
      {`${count} Selected`}
    </span>
  )
}

const AdvancedSearchFilters = ({
  onClose = null
}) => {
  const query = useEdscStore(getCollectionsQuery)
  const changeQuery = useEdscStore((state) => state.query.changeQuery)
  const [advancedFilters, setAdvancedFilters] = useState(pick(query, advancedFilterKeys))
  const appliedFiltersKey = JSON.stringify(pick(query, advancedFilterKeys))
  const formRef = useRef(null)
  const selectedOptionsCount = advancedCollectionFilters.reduce((count, { key }) => {
    const value = query[key]
    const selectedCountForFilter = Array.isArray(value)
      ? value.length
      : Number(Boolean(value))

    return count + selectedCountForFilter
  }, 0)

  // Move keyboard focus into the advanced filter column when it opens
  useEffect(() => {
    formRef.current?.focus()
  }, [])

  // Sync the advanced controls when their applied query values change
  useEffect(() => {
    setAdvancedFilters(JSON.parse(appliedFiltersKey))
  }, [appliedFiltersKey])

  const updateAdvancedFilter = (key, nextValue) => {
    setAdvancedFilters((current) => ({
      ...current,
      [key]: nextValue
    }))

    let queryValue = nextValue
    if (typeof queryValue === 'string') queryValue = queryValue.trim() || undefined
    if (Array.isArray(queryValue) && !queryValue.length) queryValue = undefined

    changeQuery({ collection: { [key]: queryValue } })
  }

  const renderAdvancedFilter = ({
    key, label, type, options = []
  }) => {
    const value = advancedFilters[key]
    const updateValue = (nextValue) => updateAdvancedFilter(key, nextValue)

    if (type === 'array') {
      const selected = toArray(value)
      if (options.length === 0) {
        return (
          <fieldset key={key}>
            <legend>
              {label}
              {renderSelectedCount(selected)}
            </legend>
            <AdvancedFilterValueInput
              label={label}
              selected={selected}
              onChange={updateValue}
            />
          </fieldset>
        )
      }

      const choices = [...new Set([...options, ...selected])]

      return (
        <fieldset key={key}>
          <legend>
            {label}
            {renderSelectedCount(selected)}
          </legend>
          <FacetsList
            facetCategory={key}
            optimisticSelection={false}
            facets={
              choices.map((choice) => ({
                title: choice.replaceAll('_', ' '),
                value: choice,
                applied: selected.includes(choice)
              }))
            }
            changeHandler={
              (event, { value: choice }) => updateValue(event.target.checked
                ? [...selected, choice] : selected.filter((entry) => entry !== choice))
            }
          />
        </fieldset>
      )
    }

    if (type === 'boolean') {
      return (
        <div key={key} className="advanced-search-filters__availability">
          <Form.Check
            type="checkbox"
            id={`advanced-search-${key}`}
            label={label}
            checked={!!value}
            onChange={(event) => updateValue(event.target.checked || undefined)}
          />
          {renderSelectedCount(value)}
        </div>
      )
    }

    if (type === 'date') {
      const selectedDate = value ? new Date(value.split(',')[0]) : null
      const pickerValue = selectedDate && Number.isFinite(selectedDate.getTime())
        ? selectedDate.toISOString()
        : ''

      return (
        <Form.Group
          key={key}
          controlId={`advanced-search-${key}`}
          role="group"
          aria-label={label}
        >
          <div className="advanced-search-filters__filter-label">
            <Form.Label>{label}</Form.Label>
            {renderSelectedCount(value)}
          </div>
          <DatepickerContainer
            filterType="collection"
            format="YYYY-MM-DD"
            id={`advanced-search-${key}-datepicker`}
            label={label}
            onSubmit={(dateValue, shouldSubmit, action) => {
              if (!shouldSubmit) return
              if (action === 'Clear') {
                updateValue(undefined)
                return
              }

              if (dateValue?.isValid()) {
                const utcMidnight = dateValue.clone().utc().startOf('day')
                updateValue(`${utcMidnight.toISOString().replace('.000Z', 'Z')},`)
              }
            }}
            shouldValidate={false}
            size="sm"
            type="start"
            value={pickerValue}
            viewMode="years"
          />
        </Form.Group>
      )
    }

    return (
      <Form.Group
        key={key}
        controlId={`advanced-search-${key}`}
        role="group"
        aria-label={label}
      >
        <Form.Label>{label}</Form.Label>
        <Form.Control
          size="sm"
          type={type}
          value={value || ''}
          onChange={
            (event) => {
              updateValue(event.target.value)
            }
          }
        />
      </Form.Group>
    )
  }

  const getAdvancedFilters = (keys) => (
    advancedCollectionFilters.filter(({ key }) => keys.includes(key))
  )
  const granuleDateFilters = getAdvancedFilters(['hasGranulesCreatedAt', 'hasGranulesRevisedAt'])
  const identifierFilters = getAdvancedFilters(identifierFilterKeys)
  const enumFilters = getAdvancedFilters(['consortium', 'collectionDataType', 'collectionProgress'])
  const textEntryFilters = getAdvancedFilters(['doi', 'entryTitle', 'variableName', 'serviceName', 'toolName'])
  const accessFilters = getAdvancedFilters(['downloadable', 'browsable'])

  return (
    <Form
      as="div"
      role="form"
      className="advanced-search-filters"
      ref={formRef}
      tabIndex={-1}
      aria-label="Advanced Filters"
      onKeyDown={
        (event) => {
          if (event.key === 'Escape' && onClose) onClose()
        }
      }
    >
      <header className="advanced-search-filters__header">
        <h2>
          Advanced Filters
          {
            selectedOptionsCount > 0 && (
              <span className="facets-group__selected-count">
                {`${selectedOptionsCount} Selected`}
              </span>
            )
          }
        </h2>
        {
          onClose && (
            <Button
              size="sm"
              variant="link"
              type="button"
              aria-label="Close Advanced Filters"
              title="Close Advanced Filters"
              onClick={onClose}
            >
              <EDSCIcon icon={FaTimes} />
            </Button>
          )
        }
      </header>
      <div className="advanced-search-filters__body">
        <fieldset className="advanced-search-filters__date-section">
          <legend className="advanced-search-filters__section-heading">Granule Activity</legend>
          <div className="advanced-search-filters__date-filters">
            {granuleDateFilters.map(renderAdvancedFilter)}
          </div>
        </fieldset>
        <fieldset className="advanced-search-filters__identifier-section">
          <legend className="advanced-search-filters__section-heading">Collection Identifier</legend>
          <div className="advanced-search-filters__identifier-filters">
            {identifierFilters.map(renderAdvancedFilter)}
          </div>
        </fieldset>
        <fieldset>
          <legend className="advanced-search-filters__section-heading">Collection Metadata</legend>
          {enumFilters.map(renderAdvancedFilter)}
          {textEntryFilters.map(renderAdvancedFilter)}
        </fieldset>
        <fieldset>
          <legend className="advanced-search-filters__section-heading">Access Options</legend>
          {accessFilters.map(renderAdvancedFilter)}
        </fieldset>
      </div>
    </Form>
  )
}

AdvancedSearchFilters.propTypes = {
  onClose: PropTypes.func
}

export default AdvancedSearchFilters
