import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'

import Button from '../Button/Button'

import './GranuleLinksList.scss'

export const GranuleLinkList = ({ granuleDownload }) => {
  const {
    granuleDownloadParams = {},
    granuleDownloadLinks = []
  } = granuleDownload
  const { granule_count: totalGranules = 0 } = granuleDownloadParams

  const isLoading = totalGranules > granuleDownloadLinks.length

  return (
    <section className="granule-links-list">
      <header className="granule-links-list__header">
        {
          isLoading && (
            <h4>{`Preparing links for download, please wait (parsed ${granuleDownloadLinks.length} of ${totalGranules})`}</h4>
          )
        }
        {
          (!isLoading && granuleDownloadLinks.length > 0) && (
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
          granuleDownloadLinks.length > 0 && (
            <Card
              bg="light"
            >
              <Card.Body>
                <ul className="granule-links-list__list">
                  {
                    granuleDownloadLinks.map((link, i) => {
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

GranuleLinkList.propTypes = {
  granuleDownload: PropTypes.shape({}).isRequired
}

export default GranuleLinkList
