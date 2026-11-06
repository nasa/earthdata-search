import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import { pick } from 'lodash-es'
import type { Moment } from 'moment'
import { FaTimes } from 'react-icons/fa'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// @ts-expect-error: This file does not have types
import FacetsList from './FacetsList'
import AdvancedFilterValueInput from './AdvancedFilterValueInput'
// @ts-expect-error: This file does not have types
import DatepickerContainer from '../../containers/DatepickerContainer/DatepickerContainer'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
// @ts-expect-error: This file does not have types
import advancedCollectionFilters from '../../data/advancedCollectionFilters'
import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import type { QuerySlice } from '../../zustand/types'

import './AdvancedSearchFilters.scss'

type CollectionQuery = QuerySlice['query']['collection']

type AdvancedFilterKey = 'doi'
  | 'entryTitle'
  | 'consortium'
  | 'entryId'
  | 'shortName'
  | 'version'
  | 'hasGranulesCreatedAt'
  | 'hasGranulesRevisedAt'
  | 'collectionDataType'
  | 'collectionProgress'
  | 'downloadable'
  | 'browsable'
  | 'variableName'
  | 'serviceName'
  | 'toolName'

type AdvancedFilterValues = Pick<Partial<CollectionQuery>, AdvancedFilterKey>
type AdvancedFilterValue = AdvancedFilterValues[AdvancedFilterKey]

interface AdvancedFilterDefinition {
  key: AdvancedFilterKey
  label: string
  type: string
  options?: string[]
}

type DateBound = 'start' | 'end'

const filterDefinitions = advancedCollectionFilters as AdvancedFilterDefinition[]
const advancedFilterKeys = filterDefinitions.map(({ key }) => key)
const identifierFilterKeys: AdvancedFilterKey[] = ['entryId', 'shortName', 'version']
const toArray = (value: AdvancedFilterValue): string[] => {
  if (Array.isArray(value)) return value

  return typeof value === 'string' && value ? [value] : []
}

const renderSelectedCount = (value: AdvancedFilterValue) => {
  const count = Array.isArray(value) ? value.length : Number(Boolean(value))

  if (!count) return null

  return (
    <span className="facets-group__selected-count">
      {`${count} Selected`}
    </span>
  )
}

interface AdvancedSearchFiltersProps {
  /** Closes the Advanced Filters column; the close button is hidden when omitted */
  onClose?: (() => void) | null
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  onClose = null
}) => {
  const query: Partial<CollectionQuery> = useEdscStore(getCollectionsQuery)
  const changeQuery = useEdscStore((state) => state.query.changeQuery)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterValues>(
    pick(query, advancedFilterKeys)
  )

  const appliedFiltersKey = JSON.stringify(pick(query, advancedFilterKeys))
  const formRef = useRef<HTMLDivElement>(null)
  const selectedOptionsCount = filterDefinitions.reduce((count, { key }) => {
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

  const updateAdvancedFilter = (key: AdvancedFilterKey, nextValue: AdvancedFilterValue) => {
    setAdvancedFilters((current) => ({
      ...current,
      [key]: nextValue
    }))

    let queryValue = nextValue
    if (typeof queryValue === 'string') queryValue = queryValue.trim() || undefined
    if (Array.isArray(queryValue) && !queryValue.length) queryValue = undefined

    changeQuery({ collection: { [key]: queryValue } as Partial<CollectionQuery> })
  }

  const renderAdvancedFilter = ({
    key, label, type, options = []
  }: AdvancedFilterDefinition) => {
    const value = advancedFilters[key]
    const updateValue = (nextValue: AdvancedFilterValue) => updateAdvancedFilter(key, nextValue)

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
          {/* This filter updates selected state before fetching; FacetsList's loading inversion would undo that display. */}
          <FacetsList
            facetCategory={key}
            optimisticSelection={false}
            facets={
              choices.map((choice) => ({
                title: choice.replace(/_/g, ' '),
                value: choice,
                applied: selected.includes(choice)
              }))
            }
            changeHandler={
              (
                event: React.ChangeEvent<HTMLInputElement>,
                { value: choice }: { value: string }
              ) => updateValue(event.target.checked
                ? [...selected, choice] : selected.filter((entry) => entry !== choice))
            }
          />
        </fieldset>
      )
    }

    if (type === 'boolean') {
      return (
        <div
          key={key}
          className="advanced-search-filters__availability"
          role="group"
          aria-label={label}
        >
          <Form.Check
            type="checkbox"
            id={`advanced-search-${key}`}
            label={label}
            checked={!!value}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>) => (
                updateValue(event.target.checked || undefined)
              )
            }
          />
          {renderSelectedCount(value)}
        </div>
      )
    }

    if (type === 'date') {
      const [startValue = '', endValue = ''] = (typeof value === 'string' ? value : '').split(',')
      const getPickerValue = (dateValue: string) => {
        if (!dateValue) return ''

        const selectedDate = new Date(dateValue)

        return Number.isFinite(selectedDate.getTime()) ? selectedDate.toISOString() : ''
      }

      const updateDateRange = (
        bound: DateBound,
        dateValue: Moment | undefined,
        shouldSubmit: boolean,
        action?: string
      ) => {
        if (!shouldSubmit) return

        const nextBounds = [startValue, endValue]
        const boundIndex = bound === 'start' ? 0 : 1

        if (action === 'Clear') {
          nextBounds[boundIndex] = ''
        } else if (dateValue?.isValid()) {
          const utcDate = dateValue.clone().utc()
          if (bound === 'start') utcDate.startOf('day')
          else utcDate.endOf('day').millisecond(0)
          nextBounds[boundIndex] = utcDate.toISOString().replace('.000Z', 'Z')
        } else {
          return
        }

        updateValue(nextBounds.some(Boolean) ? nextBounds.join(',') : undefined)
      }

      const renderDateBound = (bound: DateBound, boundValue: string) => {
        const boundLabel = bound === 'start' ? 'From' : 'To'

        return (
          <Form.Group
            key={bound}
            controlId={`advanced-search-${key}-${bound}`}
            className="advanced-search-filters__date-bound"
          >
            <Form.Label>{boundLabel}</Form.Label>
            <DatepickerContainer
              filterType="collection"
              format="YYYY-MM-DD"
              id={`advanced-search-${key}-${bound}-datepicker`}
              label={`${label} ${boundLabel.toLowerCase()} date`}
              onSubmit={
                (
                  dateValue: Moment | undefined,
                  shouldSubmit: boolean,
                  action?: string
                ) => (
                  updateDateRange(bound, dateValue, shouldSubmit, action)
                )
              }
              shouldValidate={false}
              size="sm"
              type={bound}
              value={getPickerValue(boundValue)}
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
          <div className="advanced-search-filters__filter-label">
            <Form.Label>{label}</Form.Label>
            {renderSelectedCount(value)}
          </div>
          <div className="advanced-search-filters__date-range">
            {renderDateBound('start', startValue)}
            {renderDateBound('end', endValue)}
          </div>
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
          value={typeof value === 'string' ? value : ''}
          onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => {
              updateValue(event.target.value)
            }
          }
        />
      </Form.Group>
    )
  }

  const getAdvancedFilters = (keys: AdvancedFilterKey[]) => (
    filterDefinitions.filter(({ key }) => keys.includes(key))
  )
  // TODO: Temporarly disabled because CMR returns a 500 if `includeFacets=v2` is included
  // const granuleDateFilters = getAdvancedFilters(['hasGranulesCreatedAt', 'hasGranulesRevisedAt'])
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
        (event: React.KeyboardEvent<HTMLFormElement>) => {
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
        {/* TODO: Temporarly disabled because CMR returns a 500 if `includeFacets=v2` is included
        <fieldset className="advanced-search-filters__date-section">
          <legend className="advanced-search-filters__section-heading">Granule Activity</legend>
          <div className="advanced-search-filters__date-filters">
            {granuleDateFilters.map(renderAdvancedFilter)}
          </div>
        </fieldset>
        */}
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

export default AdvancedSearchFilters
