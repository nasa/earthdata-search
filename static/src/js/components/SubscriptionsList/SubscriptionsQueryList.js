import React from 'react'
import PropTypes from 'prop-types'

import { queryToHumanizedList } from '../../util/queryToHumanizedList'
import { humanizedQueryKeysMap } from '../../util/humanizedQueryKeysMap'
import { humanizedQueryValueFormattingMap } from '../../util/humanizedQueryValueFormattingMap'

import './SubscriptionsQueryList.scss'

const hierarcicalKeys = [
  'dataCenterH',
  'granuleDataFormatH',
  'horizontalDataResolutionRange',
  'instrumentH',
  'latency',
  'platformsH',
  'processingLevelIdH',
  'projectH',
  'scienceKeywordsH',
  'tilingSystem',
  'twoDCoordinateSystemName'
]

const buildHumanizedQueryDisplay = (key, value) => {
  // Display temporal items
  if ([
    'temporal',
    'temporalString'
  ].includes(key)) {
    const [start, end] = value
    const startValue = `Start: ${start}`
    const endValue = `End: ${end}`
    const tooltipText = `${startValue}\n${endValue}`
    return (
      <div
        className="subscriptions-query-list__query-list-item-value"
        title={tooltipText}
      >
        {start && <div>{`Start: ${start}`}</div>}
        {end && <div>{`End: ${end}`}</div>}
      </div>
    )
  }

  // Display spatial items that have an unknown number of points
  if ([
    'line',
    'point',
    'polygon'
  ].includes(key)) {
    return (
      <div className="subscriptions-query-list__query-list-item-value">
        {
          value.map(
            // Display the coordinates like [[1, 1], [2, 2], ...]
            (coordinates) => {
              const value = coordinates.map(
                (coordinate) => (
                  `[${coordinate.join(', ')}]`
                )
              ).join(', ')

              return (
                <div key={value} title={value}>{value}</div>
              )
            }
          )
        }
      </div>
    )
  }

  // Display bounding box
  if (key === 'boundingBox') {
    return (
      <div>
        {value.map(
          (boundingBox) => {
            const [sw, ne] = boundingBox
            const swValue = `SW: ${sw.join(', ')}`
            const neValue = `NE: ${ne.join(', ')}`
            const tooltipText = `${swValue}\n${neValue}`
            return (
              <div key={boundingBox} title={tooltipText}>
                <div>{swValue}</div>
                <div>{neValue}</div>
              </div>
            )
          }
        )}
      </div>
    )
  }

  // Display circle
  if (key === 'circle') {
    return (
      <div className="subscriptions-query-list__query-list-item-value">
        {value.map(
          (circle) => {
            const [x, y, radius] = circle
            const centerValue = `Center: ${x}, ${y}`
            const radValue = `Radius (m): ${radius}`
            const tooltipValue = `${centerValue}\n${radValue}`
            return (
              <div key={circle} title={tooltipValue}>
                <div>{centerValue}</div>
                <div>{radValue}</div>
              </div>
            )
          }
        )}
      </div>
    )
  }

  // Display hierarchical facets
  if (hierarcicalKeys.includes(key)) {
    return (
      <div className="subscriptions-query-list__query-list-item-value">
        {value.map((hierarchy) => {
          const hierarchyValue = hierarchy.join(' > ')
          return (
            <div key={hierarchy} title={hierarchyValue}>
              {hierarchy.join(' > ')}
            </div>
          )
        })}
      </div>
    )
  }

  return null
}

/**
 * Renders the humanized subscription query list
 * @param {Object} params
 * @param {Boolean} params.displayEmptyMessage Displays an empty state if the query is empty. Defaults to true.
 * @param {Object} params.query Subscription query object, with camelCased keys
 * @param {String} params.subscriptionType Subscription type, collection or granule
 */
export const SubscriptionsQueryList = ({
  displayEmptyMessage,
  disabledFields,
  showCheckboxes,
  query,
  subscriptionType,
  onUpdateSubscriptionDisabledFields
}) => {
  const humanReadableQueryList = queryToHumanizedList(query, subscriptionType)

  const handleCheckboxChange = (e) => {
    const { id } = e.target

    const [, idWithoutType] = id.split(`${subscriptionType}-`)
    onUpdateSubscriptionDisabledFields({
      [subscriptionType]: {
        [idWithoutType]: !e.target.checked
      }
    })
  }

  // If showCheckboxes is true, wrap the query list item in a label
  const buildName = (key, humanizedKey, value) => {
    const queryListItem = (
      <>
        {
          showCheckboxes && (
            <input
              id={`${subscriptionType}-${key}`}
              className="subscriptions-query-list__query-list-item__checkbox"
              type="checkbox"
              value={value}
              onChange={handleCheckboxChange}
              checked={!disabledFields[key]}
            />
          )
        }
        <span className="subscriptions-query-list__query-list-item-heading">
          {humanizedQueryKeysMap[humanizedKey] || humanizedKey}
        </span>
        {
          // If the values have been humanized, the will exist in this array
          Object.keys(humanizedQueryValueFormattingMap).includes(humanizedKey)
            ? buildHumanizedQueryDisplay(humanizedKey, value)
            : (
              // If the vaules do not exist in the humanized map, the will be displayed here. As a fallback
              // JSON stringify non-string values
              <span
                className="subscriptions-query-list__query-list-item-value"
                title={typeof value === 'string' ? value : JSON.stringify(value)}
              >
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </span>
            )
        }
      </>
    )

    if (showCheckboxes) {
      return (
        <label htmlFor={`${subscriptionType}-${key}`}>
          {
            queryListItem
          }
        </label>
      )
    }

    return queryListItem
  }

  return (
    <ul className="subscriptions-query-list__query-list">
      {
        humanReadableQueryList.map(({ key, humanizedKey, humanizedValue }) => (
          <li key={key} className="subscriptions-query-list__query-list-item">
            {
              buildName(key, humanizedKey, humanizedValue)
            }
          </li>
        ))
      }
      {
        (humanReadableQueryList.length === 0 && displayEmptyMessage) && (
          <li className="subscriptions-query-list__query-list-item">
            This subscription has no search filters applied.
          </li>
        )
      }
    </ul>
  )
}

SubscriptionsQueryList.defaultProps = {
  displayEmptyMessage: true,
  showCheckboxes: false,
  disabledFields: null,
  onUpdateSubscriptionDisabledFields: null
}

SubscriptionsQueryList.propTypes = {
  displayEmptyMessage: PropTypes.bool,
  disabledFields: PropTypes.shape({}),
  showCheckboxes: PropTypes.bool,
  query: PropTypes.shape({}).isRequired,
  subscriptionType: PropTypes.string.isRequired,
  onUpdateSubscriptionDisabledFields: PropTypes.func
}

export default SubscriptionsQueryList
