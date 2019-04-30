/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { PropTypes } from 'prop-types'

import './GranuleResultsItem.scss'

/**
 * Renders GranuleResultsItem.
 * @param {object} props - The props passed into the component.
 * @param {object} props.granule - Granule passed from redux store.
 */
const GranuleResultsItem = ({ granule }) => {
  const title = granule.producer_granule_id ? granule.producer_granule_id : granule.title
  const temporal = granule.formatted_temporal
  const timeStart = temporal[0]
  const timeEnd = temporal[1]
  const thumbnail = granule.browse_flag ? granule.thumbnail : false

  return (
    <li className="granule-results-item">
      <div className="granule-results-item__header">
        <h3 className="granule-results-item__title">{title}</h3>
      </div>
      <div className="granule-results-item__body">
        { thumbnail && (
          <div className="granule-results-item__thumb">
            <img src={thumbnail} height="85" width="85" alt={`Browse Image for ${title}`} />
          </div>
        )
        }
        <div className="granule-results-item__meta">
          <div className="granule-results-item__temporal granule-results-item__temporal--start">
            <h5>Start</h5>
            <p>{timeStart}</p>
          </div>
          <div className="granule-results-item__temporal granule-results-item__temporal--end">
            <h5>End</h5>
            <p>{timeEnd}</p>
          </div>
          <div className="granule-results-item__actions">
            <div className="granule-results-item__buttons">
              <button
                className="button granule-results-item__button"
                type="button"
                title="View granule details"
              >
                <i className="fa fa-info-circle" />
              </button>
              <button
                className="button granule-results-item__button"
                type="button"
                title="Download single granule details"
              >
                <i className="fa fa-download" />
                {/* TODO handle multiple download links dropdown */}
              </button>
              <button
                className="button granule-results-item__button"
                type="button"
                title="Remove granule"
              >
                <i className="fa fa-close" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

GranuleResultsItem.propTypes = {
  granule: PropTypes.shape({}).isRequired
}

export default GranuleResultsItem
