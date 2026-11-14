import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import { useShallow } from 'zustand/react/shallow'
import { FaQuestionCircle, FaTimes } from 'react-icons/fa'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

// @ts-expect-error: This file does not have types
import FacetsList from './FacetsList'
import AdvancedFilterValueInput from './AdvancedFilterValueInput'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
// @ts-expect-error: This file does not have types
import advancedCollectionFilters from '../../data/advancedCollectionFilters'
import useEdscStore from '../../zustand/useEdscStore'
import { getAdvancedFilters } from '../../zustand/selectors/query'
import type { QuerySlice } from '../../zustand/types'
import renderTooltip from '../../util/renderTooltip'

import './AdvancedSearchFilters.scss'

/** Collection search parameters managed by the query store. */
type CollectionQuery = QuerySlice['query']['collection']

/** Collection parameters exposed by the advanced filter controls. */
type AdvancedFilterKey = 'doi'
  | 'entryTitle'
  | 'consortium'
  | 'entryId'
  | 'shortName'
  | 'version'
  | 'collectionDataType'
  | 'collectionProgress'
  | 'downloadable'
  | 'browsable'
  | 'variableName'
  | 'serviceName'
  | 'toolName'

/** Applied advanced filters, with unselected parameters omitted. */
type AdvancedFilterValues = Pick<Partial<CollectionQuery>, AdvancedFilterKey>
/** A selected value or list of values for an advanced filter. */
type AdvancedFilterValue = AdvancedFilterValues[AdvancedFilterKey]

/** Configuration used to render an advanced filter control. */
interface AdvancedFilterDefinition {
  /** Collection query parameter updated by the control. */
  key: AdvancedFilterKey
  /** Display label for the filter. */
  label: string
  /** Whether the filter accepts multiple values or a boolean selection. */
  type: 'array' | 'boolean'
  /** Predefined choices; omitted for free-text and boolean filters. */
  options?: string[]
}

const filterDefinitions = advancedCollectionFilters as AdvancedFilterDefinition[]
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
  /** Closes the Advanced Filters column */
  onClose: () => void
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  onClose
}) => {
  const appliedAdvancedFilters: AdvancedFilterValues = useEdscStore(useShallow(getAdvancedFilters))
  const onlyEosdisCollections = useEdscStore(
    (state) => state.query.collection.onlyEosdisCollections
  )
  const hasPortalConsortium = useEdscStore(
    (state) => Boolean(state.portal.query?.consortium?.length)
  )
  const visibleFilters = filterDefinitions.filter(({ key }) => key !== 'consortium'
    || !hasPortalConsortium)
  const changeQuery = useEdscStore((state) => state.query.changeQuery)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterValues>(
    appliedAdvancedFilters
  )

  const formRef = useRef<HTMLDivElement>(null)
  const selectedOptionsCount = visibleFilters.reduce((count, { key }) => {
    if (key === 'consortium' && onlyEosdisCollections) return count

    const value = appliedAdvancedFilters[key]
    const selectedCountForFilter = Array.isArray(value)
      ? value.length
      : Number(Boolean(value))

    return count + selectedCountForFilter
  }, 0)

  // Move keyboard focus to the Entry ID input when the column opens
  useEffect(() => {
    formRef.current?.querySelector<HTMLInputElement>('input')?.focus()
  }, [])

  // Sync the advanced controls when their applied query values change
  useEffect(() => {
    setAdvancedFilters(appliedAdvancedFilters)
  }, [appliedAdvancedFilters])

  const updateAdvancedFilter = (key: AdvancedFilterKey, nextValue: AdvancedFilterValue) => {
    setAdvancedFilters((current) => ({
      ...current,
      [key]: nextValue
    }))

    let queryValue = nextValue
    if (Array.isArray(queryValue) && !queryValue.length) queryValue = undefined

    changeQuery({ collection: { [key]: queryValue } as Partial<CollectionQuery> })
  }

  const clearAdvancedFilters = () => {
    setAdvancedFilters({})
    changeQuery({
      collection: Object.fromEntries(filterDefinitions.map(({ key }) => [key, undefined]))
    })
  }

  const renderAdvancedFilter = ({
    key,
    label,
    type,
    options = []
  }: AdvancedFilterDefinition) => {
    const isEosdisOnlyConsortium = key === 'consortium' && onlyEosdisCollections
    const value = isEosdisOnlyConsortium ? undefined : advancedFilters[key]
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
        <fieldset key={key} disabled={!!isEosdisOnlyConsortium}>
          <legend>
            {label}
            {renderSelectedCount(selected)}
            {
              key === 'consortium' && (
                <OverlayTrigger
                  placement="top"
                  trigger={['hover', 'focus']}
                  overlay={
                    (tooltipProps) => renderTooltip({
                      ...tooltipProps,
                      id: 'advanced-search-consortium-disabled',
                      children: 'Consortium filtering is disabled when only including EOSDIS collections'
                    })
                  }
                >
                  <Button
                    className="advanced-search-filters__consortium-info"
                    size="sm"
                    variant="link"
                    type="button"
                    aria-label="Consortium filtering information"
                  >
                    <EDSCIcon icon={FaQuestionCircle} />
                  </Button>
                </OverlayTrigger>
              )
            }
          </legend>
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

    return null
  }

  const getFilterDefinitions = (keys: AdvancedFilterKey[]) => (
    visibleFilters.filter(({ key }) => keys.includes(key))
  )
  const identifierFilters = getFilterDefinitions(identifierFilterKeys)
  const enumFilters = getFilterDefinitions(['consortium', 'collectionDataType', 'collectionProgress'])
  const textEntryFilters = getFilterDefinitions(['doi', 'entryTitle', 'variableName', 'serviceName', 'toolName'])
  const accessFilters = getFilterDefinitions(['downloadable', 'browsable'])

  return (
    <Form
      as="div"
      role="form"
      className="advanced-search-filters"
      ref={formRef}
      aria-label="Advanced Filters"
      onKeyDown={
        (event: React.KeyboardEvent<HTMLFormElement>) => {
          if (event.key === 'Escape') onClose()
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
      </header>
      <div className="advanced-search-filters__body">
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
      <footer className="advanced-search-filters__footer">
        <Button
          variant="link"
          size="sm"
          type="button"
          aria-label="Clear All Advanced Filters"
          onClick={clearAdvancedFilters}
        >
          Clear All Advanced Filters
        </Button>
      </footer>
    </Form>
  )
}

export default AdvancedSearchFilters
