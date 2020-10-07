import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Dropdown } from 'react-bootstrap'
import { PropTypes } from 'prop-types'

import Button from '../Button/Button'
import { getFilenameFromPath } from '../../util/getFilenameFromPath'

import './GranuleResultsDataLinksButton.scss'

/**
 * Renders CustomDataLinksToggle.
 * @param {Object} props - The props passed into the component.
 * @param {Function} props.onClick - The click callback.null
 */
class CustomDataLinksToggle extends Component {
  constructor(props, context) {
    super(props, context)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    const { onClick } = this.props
    onClick(e)
  }

  render() {
    return (
      <Button
        className="button granule-results-data-links-button__button"
        type="button"
        label="Download single granule data"
        onClick={this.handleClick}
      >
        <i className="fa fa-download" />
      </Button>
    )
  }
}

CustomDataLinksToggle.propTypes = {
  onClick: PropTypes.func.isRequired
}

/**
 * Renders GranuleResultsDataLinksButton.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - The collection ID.
 * @param {String} props.buttonVariant - The button variant.
 * @param {Array} props.dataLinks - An array of data links.
 * @param {Function} props.onMetricsDataAccess - The metrics callback.
 */
export const GranuleResultsDataLinksButton = ({
  collectionId,
  buttonVariant,
  dataLinks,
  onMetricsDataAccess
}) => {
  if (dataLinks.length > 1) {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomDataLinksToggle} />
        {
          ReactDOM.createPortal(
            <Dropdown.Menu>
              {
                dataLinks.map((dataLink, i) => {
                  const key = `data_link_${i}`
                  let dataLinkTitle = dataLink.title

                  if (!dataLinkTitle) dataLinkTitle = getFilenameFromPath(dataLink.href)

                  return (
                    <Dropdown.Item
                      key={key}
                      href={dataLink.href}
                      onClick={() => onMetricsDataAccess({
                        type: 'single_granule_download',
                        collections: [{
                          collectionId
                        }]
                      })}
                    >
                      {dataLinkTitle}
                    </Dropdown.Item>
                  )
                })
              }
            </Dropdown.Menu>,
            document.querySelector('#root')
          )
        }
      </Dropdown>
    )
  }

  if (dataLinks.length === 1) {
    return (
      <Button
        className="button granule-results-data-links-button__button"
        variant={buttonVariant}
        href={dataLinks[0].href}
        onClick={() => onMetricsDataAccess({
          type: 'single_granule_download',
          collections: [{
            collectionId
          }]
        })}
        rel="noopener noreferrer"
        label="Download single granule data"
        target="_blank"
      >
        <i className="fa fa-download" />
      </Button>
    )
  }

  return (
    <Button
      className="button granule-results-data-links-button__button"
      variant={buttonVariant}
      type="button"
      label="No download link available"
      disabled
      onClick={e => e.preventDefault()}
    >
      <i className="fa fa-download" />
    </Button>
  )
}

GranuleResultsDataLinksButton.displayName = 'GranuleResultsDataLinksButton'

GranuleResultsDataLinksButton.defaultProps = {
  buttonVariant: ''
}

GranuleResultsDataLinksButton.propTypes = {
  buttonVariant: PropTypes.string,
  collectionId: PropTypes.string.isRequired,
  dataLinks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired
}

export default GranuleResultsDataLinksButton
