/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { PropTypes } from 'prop-types'
import { Waypoint } from 'react-waypoint'
import queryString from 'query-string'
import { Link } from 'react-router-dom'

import './GranuleResultsItem.scss'

/**
 * Renders GranuleResultsItem.
 * @param {object} props - The props passed into the component.
 * @param {object} props.granule - Granule passed from redux store.
 */
const GranuleResultsItem = ({
  collectionId,
  granule,
  isLast,
  location,
  waypointEnter,
  onExcludeGranule,
  onFocusedGranuleChange
}) => {
  const handleRemoveClick = () => {
    const { id } = granule
    onExcludeGranule({ collectionId, granuleId: id })
  }

  const handleClickGranuleDetails = (granuleId) => {
    onFocusedGranuleChange(granuleId)
  }

  const {
    browse_flag: browseFlag,
    formatted_temporal: formattedTemporal,
    id,
    links,
    online_access_flag: onlineAccessFlag,
    producer_granule_id: producerGranuleId,
    thumbnail: granuleThumbnail,
    title: granuleTitle
  } = granule

  const title = producerGranuleId || granuleTitle
  const temporal = formattedTemporal
  const timeStart = temporal[0]
  const timeEnd = temporal[1]
  const thumbnail = browseFlag ? granuleThumbnail : false

  const dataLinks = () => {
    // All 'http' data links that are not inherited
    const httpDataLinks = links.filter((link) => {
      const {
        href,
        inherited = false,
        rel
      } = link

      return href.indexOf('http') !== -1 && rel.indexOf('/data#') !== -1 && inherited !== true
    })

    // Strip filenames from httpDataLinks
    const filenames = httpDataLinks.map(link => link.href.substr(link.href.lastIndexOf('/') + 1).replace('.html', ''))

    // Find any 'ftp' data links that are not interited that have filenames not already included with 'http' links
    const ftpLinks = links.filter((link) => {
      const {
        href,
        inherited = false,
        rel
      } = link

      const filename = href.substr(href.lastIndexOf('/') + 1)

      return href.indexOf('ftp://') !== -1 && rel.indexOf('/data#') !== -1 && inherited !== true && filenames.indexOf(filename) === -1
    })

    // Return http and ftp data links with a unique list of filenames, prefering http
    return [
      ...httpDataLinks,
      ...ftpLinks
    ]
  }

  return (
    <li className="granule-results-item">
      <div className="granule-results-item__header">
        <h3 className="granule-results-item__title">{title}</h3>
      </div>
      <div className="granule-results-item__body">
        {
          thumbnail && (
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
              <Link
                onClick={() => handleClickGranuleDetails(id)}
                className="collection-results__item-title-link"
                to={{
                  pathname: '/search/granules/granule-details',
                  search: queryString
                    .stringify(
                      Object.assign(
                        {},
                        queryString.parse(location.search),
                        { g: id }
                      )
                    )
                }}
              >
                <button
                  className="button granule-results-item__button"
                  type="button"
                  title="View granule details"
                >
                  <i className="fa fa-info-circle" />
                </button>
              </Link>
              {
                onlineAccessFlag && (
                  <a
                    className="button granule-results-item__button"
                    href={dataLinks()[0].href}
                    rel="noopener noreferrer"
                    type="button"
                    title="Download single granule data"
                    target="_blank"
                  >
                    <i className="fa fa-download" />
                    {/*
                      TODO handle multiple download links dropdown,
                      example: C1548317484-PODAAC
                    */}
                  </a>
                )
              }

              <button
                className="button granule-results-item__button"
                type="button"
                title="Remove granule"
                onClick={handleRemoveClick}
              >
                <i className="fa fa-close" />
              </button>
            </div>
          </div>
        </div>
      </div>
      { isLast && <Waypoint onEnter={waypointEnter} /> }
    </li>
  )
}

GranuleResultsItem.propTypes = {
  collectionId: PropTypes.string.isRequired,
  granule: PropTypes.shape({}).isRequired,
  isLast: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  waypointEnter: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired
}

export default GranuleResultsItem
