import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Card } from 'react-bootstrap'

import { constructDownloadableFile } from '../../util/files/constructDownloadableFile'
import { generateDownloadScript } from '../../util/files/generateDownloadScript'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

import Button from '../Button/Button'

import './CollectionDownloadDisplay.scss'

const mapStateToProps = (state) => ({
  earthdataEnvironment: getEarthdataEnvironment(state),
  granuleDownload: state.granuleDownload,
  retrieval: state.retrieval
})

export class CollectionDownloadDisplay extends Component {
  componentDidMount() {
    const {
      onFetchRetrievalCollectionGranuleLinks,
      retrievalCollection
    } = this.props

    const { id } = retrievalCollection

    if (id) {
      onFetchRetrievalCollectionGranuleLinks(retrievalCollection)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      onFetchRetrievalCollectionGranuleLinks,
      retrievalCollection
    } = this.props

    const { id } = retrievalCollection

    const {
      retrievalCollection: nextRetrievalCollection
    } = nextProps

    const { id: nextId } = nextRetrievalCollection

    if (nextId && (id !== nextId)) {
      onFetchRetrievalCollectionGranuleLinks(nextRetrievalCollection)
    }
  }

  render() {
    const {
      earthdataEnvironment,
      granuleDownload,
      match,
      retrievalCollection
    } = this.props

    const { path } = match

    // The last part of the path will define what format the user expecting the links
    const pathParts = path.split('/')
    const granuleFormat = pathParts[pathParts.length - 1]

    // Pull the retrieval collection from the store
    const {
      id,
      access_method: accessMethod,
      granule_count: totalGranules = 0,
      retrieval_id: retrievalId
    } = retrievalCollection

    // If not all necessary data is avaialble don't attempt to render the component
    if (accessMethod == null) return null

    // User the retrieval id and access method type to construct a relevant file name
    const { type } = accessMethod

    const { [id]: granuleLinks = [], isLoaded, isLoading } = granuleDownload

    let downloadButtonLabel
    let downloadButtonMessage
    let downloadFileContents
    let downloadFileExtension

    if (granuleFormat === 'links') {
      downloadButtonLabel = 'Download Links File'
      downloadButtonMessage = 'Please click the button to download these links'
      downloadFileContents = granuleLinks.join('\n')
      downloadFileExtension = 'txt'
    } else if (granuleFormat === 'script') {
      downloadButtonLabel = 'Download Script'
      downloadButtonMessage = 'Please click the button to download the script'
      downloadFileContents = generateDownloadScript(
        granuleLinks,
        retrievalCollection,
        earthdataEnvironment
      )
      downloadFileExtension = 'sh'
    }
    const downloadFileName = `${retrievalId}-${type}.${downloadFileExtension}`

    return (
      <section className="collection-download-display">
        <header className="collection-download-display__header">
          {
            granuleFormat === 'script' && (
              <>
                <h4>How to use this script</h4>
                <p className="collection-download-display__intro">
                  <strong>Linux: </strong>
                  { 'You must first make the script an executable by running the line \'chmod 777 download.sh\' from the command line. After that is complete, the file can be executed by typing \'./download.sh\'. ' }
                  { 'For a detailed walk through of this process, please reference this ' }
                  <a href="https://wiki.earthdata.nasa.gov/display/EDSC/How+To%3A+Use+the+Download+Access+Script">How To guide</a>
                  .
                </p>
                <p>
                  <strong>Windows: </strong>
                  {
                    'The file can be executed within Windows by first installing a Unix-like command line utility such as '
                  }
                  <a href="https://www.cygwin.com/">Cygwin</a>
                  {
                    '. After installing Cygwin (or a similar utility), run the line \'chmod 777 download.sh\' from the utility\'s command line, and then execute by typing \'./download.sh\'.'
                  }
                </p>
              </>
            )
          }
          {
            isLoading && (
              <h4>{ `Retrieving links, please wait (parsed ${granuleLinks.length} of ${totalGranules} granules)` }</h4>
            )
          }
          {
            (isLoaded && granuleLinks.length > 0) && (
              <>
                <h4>Collection granule links have been retrieved</h4>
                <p className="collection-download-display__state">
                  {downloadButtonMessage}
                  <Button
                    className="collection-download-display__button"
                    bootstrapVariant="primary"
                    bootstrapSize="sm"
                    label={downloadButtonLabel}
                    onClick={(e) => {
                      constructDownloadableFile(downloadFileContents, downloadFileName)
                      e.stopPropagation()
                    }}
                  >
                    {downloadButtonLabel}
                  </Button>
                </p>
              </>
            )
          }
        </header>
        <div className="collection-download-display__body">
          {
            isLoaded && (
              <Card
                bg="light"
              >
                <Card.Body>
                  {
                    granuleFormat === 'links' && (
                      <ul className="collection-download-display__list">
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
                    )
                  }
                  {
                    granuleFormat === 'script' && (
                      <pre className="collection-download-display__list">
                        {downloadFileContents}
                      </pre>
                    )
                  }
                </Card.Body>
              </Card>
            )
          }
        </div>
      </section>
    )
  }
}

CollectionDownloadDisplay.propTypes = {
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired,
  retrievalCollection: PropTypes.shape({
    access_method: PropTypes.shape({}),
    granule_count: PropTypes.number,
    id: PropTypes.number,
    retrieval_id: PropTypes.number
  }).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(CollectionDownloadDisplay)
)
