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
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import advancedCollectionFilters from '../../data/advancedCollectionFilters'
import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import { getCollections } from '../../zustand/selectors/collections'

import './AdvancedSearchFacets.scss'

const advancedFilterKeys = advancedCollectionFilters.map(({ key }) => key)
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : [])

const AdvancedSearchFacets = ({ onClose = null }) => {
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
  const [advancedFilters, setAdvancedFilters] = useState(pick(query, advancedFilterKeys))
  const [collections, setCollections] = useState(items)
  const appliedFiltersKey = JSON.stringify(pick(query, advancedFilterKeys))
  const formRef = useRef(null)
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

  // Retain previously loaded choices so filtering results does not remove other options
  useEffect(() => {
    setCollections((current) => uniqBy([...current, ...items], (collection) => (
      collection.entryId || `${collection.shortName}_${collection.versionId}`
    )))
  }, [items])

  // Sync identifier controls with the query, preserving the chosen mode when identifiers are cleared
  useEffect(() => {
    setSelectedIds(appliedEntryId || [])
    setSelectedShortNames(appliedShortNames)
    setSelectedVersions(appliedVersions)
    if (appliedShortNames.length || appliedVersions.length) setMode('shortName')
    else if (appliedEntryId?.length) setMode('entryId')
  }, [appliedEntryId, appliedShortName, appliedVersion])

  const availableIds = [...new Set([
    ...collections.map((collection) => collection.entryId),
    ...selectedIds
  ].filter(Boolean))].sort()
  const availableShortNames = [...new Set([
    ...collections.map((collection) => collection.shortName),
    ...selectedShortNames
  ].filter(Boolean))].sort()
  const availableVersions = [...new Set([
    ...collections.filter((collection) => selectedShortNames.includes(collection.shortName))
      .map((collection) => collection.versionId),
    ...selectedVersions
  ].filter(Boolean))].sort()

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

  return (
    <Form
      as="div"
      role="form"
      className="advanced-search-facets"
      ref={formRef}
      tabIndex={-1}
      aria-label="Advanced Filters"
      onKeyDown={
        (event) => {
          if (event.key === 'Escape' && onClose) onClose()
        }
      }
    >
      <header className="advanced-search-facets__header">
        <h2>
          Advanced Filters
          {selectedOptionsCount > 0 && (
            <span className="badge bg-primary ms-2">
              {`${selectedOptionsCount} ${selectedOptionsCount === 1 ? 'Option' : 'Options'} Selected`}
            </span>
          )}
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
      <div className="advanced-search-facets__body">
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
              <div className="advanced-search-facets__entry-ids mb-3">
                <FacetsList
                  facetCategory="advancedSearch"
                  optimisticSelection={false}
                  facets={
                    availableIds.map((value) => ({
                      title: value,
                      value,
                      applied: selectedIds.includes(value)
                    }))
                  }
                  changeHandler={
                    (event, { value }) => changeFilters({
                      entryId: event.target.checked
                        ? [...selectedIds, value]
                        : selectedIds.filter((selectedId) => selectedId !== value)
                    })
                  }
                />
              </div>
            ) : (
              <div className="mb-3">
                <fieldset>
                  <legend>Short Name</legend>
                  <div className="advanced-search-facets__identifier-options">
                    <FacetsList
                      facetCategory="advancedSearchShortName"
                      optimisticSelection={false}
                      facets={availableShortNames.map((value) => ({
                        title: value,
                        value,
                        applied: selectedShortNames.includes(value)
                      }))}
                      changeHandler={
                        (event, { value }) => {
                          const nextShortNames = event.target.checked
                            ? [...selectedShortNames, value]
                            : selectedShortNames.filter((selected) => selected !== value)

                          changeFilters({
                            shortName: nextShortNames,
                            version: nextShortNames.length === 1 ? selectedVersions : []
                          })
                        }
                      }
                    />
                  </div>
                </fieldset>
                {
                  selectedShortNames.length > 0 && (
                    <fieldset disabled={selectedShortNames.length > 1}>
                      <legend>Version</legend>
                      <div className="advanced-search-facets__identifier-options">
                        <FacetsList
                          facetCategory="advancedSearchVersion"
                          optimisticSelection={false}
                          facets={availableVersions.map((value) => ({
                            title: value,
                            value,
                            applied: selectedVersions.includes(value)
                          }))}
                          changeHandler={
                            (event, { value }) => changeFilters({
                              version: event.target.checked
                                ? [...selectedVersions, value]
                                : selectedVersions.filter((selected) => selected !== value)
                            })
                          }
                        />
                      </div>
                    </fieldset>
                  )
                }
              </div>
            )
          }
          <Button size="sm" variant="link" type="button" onClick={clear}>Clear</Button>
        </fieldset>
        {
          advancedCollectionFilters.map(({
            key, label, type, options = []
          }) => {
            const value = advancedFilters[key]
            const updateValue = (nextValue) => {
              setAdvancedFilters((current) => ({
                ...current,
                [key]: nextValue
              }))

              let queryValue = nextValue
              if (typeof queryValue === 'string') queryValue = queryValue.trim() || undefined
              if (Array.isArray(queryValue) && !queryValue.length) queryValue = undefined

              changeQuery({ collection: { [key]: queryValue } })
            }

            if (type === 'array') {
              const selected = value || []
              const choices = [...new Set([
                ...options,
                ...(key === 'consortium' ? collections.flatMap((item) => item.consortiums || []) : []),
                ...selected
              ])]

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
                <div key={key} className="advanced-search-facets__availability">
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

            return (
              <Form.Group key={key} controlId={`advanced-search-${key}`}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  size="sm"
                  type={type}
                  step={type === 'datetime-local' ? 1 : undefined}
                  value={
                    type === 'datetime-local'
                      ? (value || '').split(',')[0].replace(/Z$/, '') : value || ''
                  }
                  onChange={
                    (event) => {
                      const nextValue = event.target.value
                      updateValue(type === 'datetime-local' && nextValue
                        ? `${new Date(`${nextValue}Z`).toISOString().replace('.000Z', 'Z')},`
                        : nextValue)
                    }
                  }
                />
              </Form.Group>
            )
          })
        }
      </div>
    </Form>
  )
}

AdvancedSearchFacets.propTypes = {
  onClose: PropTypes.func
}

export default AdvancedSearchFacets
