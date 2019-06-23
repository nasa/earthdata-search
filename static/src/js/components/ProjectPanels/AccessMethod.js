import React from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import ProjectPanelSection from './ProjectPanelSection'
import Radio from '../FormFields/Radio/Radio'
import RadioList from '../FormFields/Radio/RadioList'

import './AccessMethod.scss'

/**
 * Renders AccessMethod.
 * @param {object} props - The props passed into the component.
 * @param {number} props.index - The index of the current collection.
 * @param {function} props.onSetActivePanel - Switches the currently active panel.
 */
export const AccessMethod = ({
  index,
  metadata,
  onSelectAccessMethod,
  onSetActivePanel
}) => {
  const {
    id,
    tags
  } = metadata

  const handleAccessMethodSelection = (method) => {
    console.log('handleAccessMethodSelection', method)
    onSelectAccessMethod({
      collectionId: id,
      selectedAccessMethod: method
    })
  }

  const collectionCapibilities = tags['edsc.extra.serverless.collection_capabilities']

  const { data = {} } = collectionCapibilities
  const { granule_online_access_flag: downloadable } = data

  const radioList = []

  if (downloadable) {
    radioList.push((
      <Radio
        id={`${id}_access-method__direct-download`}
        name={`${id}_access-method__direct-download`}
        key={`${id}_access-method__direct-download`}
        value="Download"
        onClick={() => handleAccessMethodSelection('download')}
      >
        Direct Download
        <OverlayTrigger
          placement="right"
          overlay={(
            <Tooltip
              className="tooltip--large tooltip--ta-left"
            >
              Direct download of all data associated with the selected granules.
              The desired data will be available for download immediately.
              Files will be accessed from a list of links displayed in the
              browser or by using a download script.
            </Tooltip>
          )}
        >
          <i className="access-method__radio-tooltip fa fa-info-circle" />
        </OverlayTrigger>
      </Radio>
    ))
  }

  if (Object.keys(tags).indexOf('edsc.extra.serverless.subset_service.echo_orders') !== -1) {
    radioList.push((
      <Radio
        id={`${id}_access-method__stage-for-deliver`}
        name={`${id}_access-method__stage-for-deliver`}
        key={`${id}_access-method__stage-for-deliver`}
        value="Stage For Delivery"
        onClick={() => handleAccessMethodSelection('echoOrder')}
      >
        Stage For Delivery
        <OverlayTrigger
          placement="right"
          overlay={(
            <Tooltip
              className="tooltip--large tooltip--ta-left"
            >
              Submit a request for data to be staged for delivery. Data files will be
              compressed in zip format and stored for retrieval via HTTP. You will
              receive an email from the data provider when your files are ready to download.
            </Tooltip>
          )}
        >
          <i className="access-method__radio-tooltip fa fa-info-circle" />
        </OverlayTrigger>
      </Radio>
    ))
  }

  if (Object.keys(tags).indexOf('edsc.extra.serverless.subset_service.opendap') !== -1) {
    radioList.push((
      <Radio
        id={`${id}_access-method__opendap`}
        name={`${id}_access-method__opendap`}
        key={`${id}_access-method__opendap`}
        value="OPenDAP"
        onClick={() => handleAccessMethodSelection('opendap')}
      >
        Customize (OPeNDAP)
        <OverlayTrigger
          placement="right"
          overlay={(
            <Tooltip
              className="tooltip--large tooltip--ta-left"
            >
              Select options like variables, transformations, and output formats to customize
              your data. The desired data files will be made available for access immediately.
              Files will be accessed from a list of links in the browser or by using a
              download script.
            </Tooltip>
          )}
        >
          <i className="access-method__radio-tooltip fa fa-info-circle" />
        </OverlayTrigger>
      </Radio>
    ))
  }

  if (Object.keys(tags).indexOf('edsc.extra.serverless.subset_service.egi') !== -1) {
    radioList.push((
      <Radio
        id={`${id}_access-method__customize`}
        name={`${id}_access-method__customize`}
        key={`${id}_access-method__customize`}
        value="Customize"
        onClick={() => handleAccessMethodSelection('egi')}
      >
        Customize
        <OverlayTrigger
          placement="right"
          overlay={(
            <Tooltip
              className="tooltip--large tooltip--ta-left"
            >
              Select options like variables, transformations, and output formats to
              customize your data. The desired data files will be made available for
              access after the data provider has finished processing your request.
              You will receive an email from the data provider when your
              files are ready to download.
            </Tooltip>
          )}
        >
          <i className="access-method__radio-tooltip fa fa-info-circle" />
        </OverlayTrigger>
      </Radio>
    ))
  }

  return (
    <div className="access-method">
      <ProjectPanelSection heading="Select Data Access Method">
        <div className="access-method__radio-list">
          {/* <RadioList defaultValue="Download"> */}
          <RadioList>
            {radioList}
          </RadioList>
        </div>
      </ProjectPanelSection>
      <ProjectPanelSection>
        Access options go here
        <br />
        <button
          type="button"
          onClick={() => onSetActivePanel(`0.${index}.1`)}
        >
          Go to another panel item
        </button>
      </ProjectPanelSection>
    </div>
  )
}

AccessMethod.defaultProps = {
  index: null,
  metadata: {},
  onSetActivePanel: null
}

AccessMethod.propTypes = {
  index: PropTypes.number,
  metadata: PropTypes.shape({}),
  onSelectAccessMethod: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func
}

export default AccessMethod
