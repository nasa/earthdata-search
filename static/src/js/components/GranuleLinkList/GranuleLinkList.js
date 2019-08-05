import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'

import Button from '../Button/Button'

import './GranuleLinksList.scss'

export class GranuleLinkList extends Component {
  componentDidMount() {
    const { onFetchRetrievalCollection, retrievalCollectionId, authToken } = this.props
    if (authToken !== '') {
      onFetchRetrievalCollection(retrievalCollectionId, authToken)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { onFetchRetrievalCollection, retrievalCollectionId, authToken } = this.props
    if (authToken !== nextProps.authToken && nextProps.authToken !== '') {
      onFetchRetrievalCollection(retrievalCollectionId, nextProps.authToken)
    }
  }

  render() {
    const { granuleDownload } = this.props
    const { retrievalCollection, granuleLinks } = granuleDownload

    const { granule_count: totalGranules = 0 } = retrievalCollection

    const isLoading = totalGranules > granuleLinks.length

    return (
      <section className="granule-links-list">
        <header className="granule-links-list__header">
          {
            isLoading && (
              <h4>{`Preparing links for download, please wait (parsed ${granuleLinks.length} of ${totalGranules})`}</h4>
            )
          }
          {
            (!isLoading && granuleLinks.length > 0) && (
              <>
                <h4>Collection granule links have been retrieved</h4>
                <p className="granule-links-list__intro">
                  Please click the button to download these links
                  <Button
                    className="granule-links-list__button"
                    bootstrapVariant="primary"
                    bootstrapSize="sm"
                    disabled
                    label="Download Links File"
                  >
                    Download Links File
                  </Button>
                </p>
              </>
            )
          }
        </header>
        <div className="granule-links-list__body">
          {
            granuleLinks.length > 0 && (
              <Card
                bg="light"
              >
                <Card.Body>
                  <ul className="granule-links-list__list">
                    {
                      granuleLinks.map((link, i) => {
                        const key = `link_${i}`
                        return (
                          <li key={key}>
                            <a href={link}>{link}</a>
                          </li>
                        )
                      })
                    }
                  </ul>
                </Card.Body>
              </Card>
            )
          }
        </div>
      </section>
    )
  }
}

GranuleLinkList.propTypes = {
  authToken: PropTypes.string.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  retrievalCollectionId: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired
}

export default GranuleLinkList
