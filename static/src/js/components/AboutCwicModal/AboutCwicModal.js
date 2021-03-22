/* eslint-disable max-len */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FaRegFilePdf, FaRegFileWord, FaExternalLinkAlt } from 'react-icons/fa'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

export class AboutCwicModal extends Component {
  constructor(props) {
    super(props)

    this.onModalClose = this.onModalClose.bind(this)
  }

  onModalClose() {
    const { onToggleAboutCwicModal } = this.props
    onToggleAboutCwicModal(false)
  }

  render() {
    const {
      isOpen
    } = this.props

    const body = (
      <>
        <p>
          This collection uses external services to find granules through a system called CWIC. These searches will be performed by external services which may vary in both
          {' '}
          <em>
            <strong>performance</strong>
          </em>
          {' '}
          and available
          {' '}
          <em>
            <strong>features</strong>
          </em>
          .
        </p>

        <p>
          CWIC is short for CEOS WGISS Integrated Catalog. WGISS (The Working Group on Information Systems and Services) is a subsidiary body supporting the Committee on Earth Observing Satellites (CEOS). WGISS promotes collaboration in the development of systems and services that manage and supply these observatory data.
        </p>

        <div>
          <p>Here are some places where you can find more information about CWIC and OpenSearch:</p>
          <ul>
            <li>
              <a href="http://ceos.org/wp-content/uploads/2014/12/CEOSOpenSearchBestPracticeDocument-PublicComment.pdf" target="_blank" rel="noopener noreferrer">
                CEOS OpenSearch Best Practice
                {' '}
                <EDSCIcon icon={FaRegFilePdf} />
              </a>
            </li>
            <li>
              <a href="http://ceos.org/document_management/Working_Groups/WGISS/Projects/CWIC/OpenSearch/CEOS%20Open%20Search%20Developer%20Guide.docx" target="_blank" rel="noopener noreferrer">
                CEOS OpenSearch Developer Guide
                {' '}
                <EDSCIcon icon={FaRegFileWord} />
              </a>
            </li>
            <li>
              <a href="https://wiki.earthdata.nasa.gov/display/CWIC/CWIC+Open+Search+Architecture" target="_blank" rel="noopener noreferrer">
                CWIC OpenSearch Architecture
                {' '}
                <EDSCIcon icon={FaExternalLinkAlt} />
              </a>
            </li>
          </ul>
        </div>

        <hr />

        <div>
          <h4>Performance and Availability</h4>
          <p>
            CWIC searches federate with international and interagency partners to perform searches, whereas Earthdata Search&apos;s standard searches are performed against the Common Metadata Repository, which has well-defined feature, performance, and availability requirements.
          </p>
          <p>
            While this allows us to search far more data than we otherwise could, there are drawbacks to WIC&apos;s federated searching and its reliance on a number of external partners to provide its capabilities.
          </p>
          <p>
            Performance, accuracy, and available features may vary from one collection to the next. These services may further become unavailable or experience degraded performance unexpectedly due to their differing maintenance schedules.
          </p>
          <p>
            Earthdata Search makes known differences apparent through the interface.
          </p>

          <h4>Feature Differences</h4>

          <h5>Spatial Searching</h5>
          <p>
            The CWIC OpenSearch standard only guarantees support for bounding box spatial searches. Because Earthdata Search additionally allows point and polygon searches, we provide our best approximation of these spatial search constraints to CWIC. For points, this means providing a very small bounding box, whereas for polygons, we provide the minimum bounding rectangle of the search area to CWIC. If your search is supplying a minimum bounding rectangle, an indication will appear in the interface.
          </p>
          <h5>Timeline</h5>
          <p>
            The OpenSearch standard does not provide the information necessary to populate the Earthdata Search timeline. For Int&apos;l/Interagency collections, we instead show an area from the collection&apos;s start date to its end date.
          </p>
          <h5>Temporal Searching</h5>
          <p>
            CWIC&apos;s OpenSearch supports temporal constraints such as start time and end time, but it does not support recurring temporal searches. If recurring parameters are specified in Earthdata Search, search results will show all granules from the start of the first temporal range to the end of the last.
          </p>
          <h5>Other Differences</h5>
          <ul>
            <li>Int&apos;l/Interagency granules cannot be excluded from the results list</li>
            <li>Int&apos;l/Interagency granule results cannot be sorted</li>
            <li>
              Advanced granule filters differ from those available within the CMR and may differ from one Int&apos;l / Interagency collection to the next.
            </li>
          </ul>
        </div>
      </>
    )

    return (
      <EDSCModalContainer
        className="about-cwic"
        id="about-cwic"
        isOpen={isOpen}
        onClose={this.onModalClose}
        size="lg"
        title="What's Int'l / Interagency Data"
        body={body}
      />
    )
  }
}

AboutCwicModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired
}

export default AboutCwicModal
