import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { pick, uniqBy } from 'lodash-es'
import { FaTimes } from 'react-icons/fa'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import FacetsList from './FacetsList'
import AdvancedFilterValueInput from './AdvancedFilterValueInput'
import DatepickerContainer from '../../containers/DatepickerContainer/DatepickerContainer'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import advancedCollectionFilters from '../../data/advancedCollectionFilters'
import useEdscStore from '../../zustand/useEdscStore'
import { getCollections } from '../../zustand/selectors/collections'
import { getCollectionsQuery } from '../../zustand/selectors/query'

import './AdvancedSearchFilters.scss'

const advancedFilterKeys = advancedCollectionFilters.map(({ key }) => key)
const toArray = (value) => {
  if (Array.isArray(value)) return value

  return value ? [value] : []
}

const textEntryFilterKeys = ['doi', 'entryTitle', 'variableName', 'serviceName', 'toolName']

const renderIdentifierOptions = (field, options, selected, onChange) => {
  const choices = [...new Set([...options, ...selected])]

  return (
    <FacetsList
      facetCategory={field}
      optimisticSelection={false}
      facets={
        choices.map((value) => ({
          title: value,
          value,
          applied: selected.includes(value)
        }))
      }
      changeHandler={
        (event, { value }) => onChange(event.target.checked
          ? [...selected, value] : selected.filter((entry) => entry !== value))
      }
    />
  )
}

const AdvancedSearchFilters = ({
  onClose = null
}) => {
  const query = useEdscStore(getCollectionsQuery)
  const { items = [] } = useEdscStore(getCollections)
  const changeQuery = useEdscStore((state) => state.query.changeQuery)
  const {
    entryId: appliedEntryId,
    shortName: appliedShortName,
    version: appliedVersion
  } = query
  const appliedShortNames = toArray(appliedShortName)
  const appliedVersions = toArray(appliedVersion)
  const [mode, setMode] = useState((appliedShortNames.length || appliedVersions.length) ? 'shortName' : 'entryId')
  const [selectedIds, setSelectedIds] = useState(appliedEntryId || [])
  const [selectedShortNames, setSelectedShortNames] = useState(appliedShortNames)
  const [selectedVersions, setSelectedVersions] = useState(appliedVersions)
  const [knownCollections, setKnownCollections] = useState(items)
  const [advancedFilters, setAdvancedFilters] = useState(pick(query, advancedFilterKeys))
  const appliedFiltersKey = JSON.stringify(pick(query, advancedFilterKeys))
  const formRef = useRef(null)
  const initialEntryIds = [...new Set(
    knownCollections.map(({ entryId }) => entryId).filter(Boolean)
  )].sort()
  const initialShortNames = [...new Set(
    knownCollections.map(({ shortName }) => shortName).filter(Boolean)
  )].sort()
  const initialVersions = [...new Set(knownCollections
    .filter(({ shortName }) => selectedShortNames.includes(shortName))
    .map(({ versionId }) => versionId)
    .filter(Boolean))].sort()
  // Count the number of selected identifiers (entryId and shortName)
  const entryIdCount = appliedEntryId?.length || 0
  const identifierSelectionCount = entryIdCount + appliedShortNames.length + appliedVersions.length
  // Count the number of selected advanced filters plus identifiers
  const selectedOptionsCount = advancedCollectionFilters.reduce((count, { key }) => {
    const value = query[key]
    const selectedCountForFilter = Array.isArray(value)
      ? value.length
      : Number(Boolean(value))

    return count + selectedCountForFilter
  }, identifierSelectionCount)

  // Move keyboard focus into the advanced filter column when it opens
  useEffect(() => {
    formRef.current?.focus()
  }, [])

  // Sync the advanced controls when their applied query values change
  useEffect(() => {
    setAdvancedFilters(JSON.parse(appliedFiltersKey))
  }, [appliedFiltersKey])

  useEffect(() => {
    setKnownCollections((current) => uniqBy([
      ...current,
      ...items
    ], (collection) => collection.entryId || `${collection.shortName}_${collection.versionId}`))
  }, [items])

  // Sync identifier controls with the query, preserving the chosen mode when identifiers are cleared
  useEffect(() => {
    setSelectedIds(appliedEntryId || [])
    setSelectedShortNames(appliedShortNames)
    setSelectedVersions(appliedVersions)
    if (appliedShortNames.length || appliedVersions.length) setMode('shortName')
    else if (appliedEntryId?.length) setMode('entryId')
  }, [appliedEntryId, appliedShortName, appliedVersion])

  const changeFilters = ({
    mode: nextMode = mode,
    entryId: nextIds = selectedIds,
    shortName: nextShortNames = selectedShortNames,
    version: nextVersions = selectedVersions
  }) => {
    setMode(nextMode)
    setSelectedIds(nextIds)
    setSelectedShortNames(nextShortNames)
    setSelectedVersions(nextVersions)
    changeQuery({
      collection: {
        entryId: nextMode === 'entryId' && nextIds.length ? nextIds : undefined,
        shortName: nextMode === 'shortName' && nextShortNames.length ? nextShortNames : undefined,
        version: nextMode === 'shortName' && nextVersions.length ? nextVersions : undefined
      }
    })
  }

  const clear = () => {
    changeFilters({
      entryId: [],
      shortName: [],
      version: []
    })
  }

  const changeMode = (nextMode) => changeFilters({
    mode: nextMode,
    entryId: [],
    shortName: [],
    version: []
  })

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
      if (textEntryFilterKeys.includes(key)) {
        return (
          <fieldset key={key}>
            <legend>{label}</legend>
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
          <legend>{label}</legend>
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
          <FacetsList
            facetCategory={key}
            optimisticSelection={false}
            facets={
              [{
                title: label,
                value: key,
                applied: !!value
              }]
            }
            changeHandler={(event) => updateValue(event.target.checked || undefined)}
          />
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
          <Form.Label>{label}</Form.Label>
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
  const enumFilters = getAdvancedFilters(['consortium', 'collectionDataType', 'collectionProgress'])
  const textEntryFilters = getAdvancedFilters(textEntryFilterKeys)
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
              <span className="badge bg-primary ms-2">
                {`${selectedOptionsCount} ${selectedOptionsCount === 1 ? 'Option' : 'Options'} Selected`}
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
        {granuleDateFilters.map(renderAdvancedFilter)}
        <fieldset>
          <legend>Collection Identifier</legend>
          <div className="d-flex flex-wrap gap-2 mb-2 small">
            <Form.Check
              type="radio"
              id="advanced-search-mode-entry-id"
              name="advanced-search-mode"
              label="Entry ID"
              checked={mode === 'entryId'}
              onChange={() => changeMode('entryId')}
              className="mb-1"
            />
            <Form.Check
              type="radio"
              id="advanced-search-mode-short-name"
              name="advanced-search-mode"
              label="Short Name and Version"
              checked={mode === 'shortName'}
              onChange={() => changeMode('shortName')}
              className="mb-1"
            />
          </div>
          {
            mode === 'entryId' ? (
              <div className="advanced-search-filters__entry-ids mb-3">
                {
                  renderIdentifierOptions('entryId', initialEntryIds, selectedIds, (entryId) => (
                    changeFilters({ entryId })
                  ))
                }
              </div>
            ) : (
              <div className="mb-3">
                <fieldset>
                  <legend>Short Name</legend>
                  <div className="advanced-search-filters__identifier-options">
                    {
                      renderIdentifierOptions('shortName', initialShortNames, selectedShortNames, (nextShortNames) => (
                        changeFilters({
                          shortName: nextShortNames,
                          version: nextShortNames.length === 1 ? selectedVersions : []
                        })
                      ))
                    }
                  </div>
                </fieldset>
                {
                  selectedShortNames.length === 1 && (
                    <fieldset>
                      <legend>Version</legend>
                      <div className="advanced-search-filters__identifier-options">
                        {
                          renderIdentifierOptions('version', initialVersions, selectedVersions, (version) => (
                            changeFilters({ version })
                          ))
                        }
                      </div>
                    </fieldset>
                  )
                }
              </div>
            )
          }
          <Button size="sm" variant="link" type="button" onClick={clear}>Clear</Button>
        </fieldset>
        {enumFilters.map(renderAdvancedFilter)}
        {textEntryFilters.map(renderAdvancedFilter)}
        <fieldset>
          <legend>Access Options</legend>
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
