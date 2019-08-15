import React from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import ProjectPanelSection from '../ProjectPanels/ProjectPanelSection'
import Radio from '../FormFields/Radio/Radio'
import RadioList from '../FormFields/Radio/RadioList'

import EchoForm from './EchoForm'
import Button from '../Button/Button'

import './AccessMethod.scss'

const downloadButton = collectionId => (
  <Radio
    id={`${collectionId}_access-method__direct-download`}
    name={`${collectionId}_access-method__direct-download`}
    key={`${collectionId}_access-method__direct-download`}
    value="download"
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
)

const echoOrderButton = (collectionId, methodKey) => (
  <Radio
    id={`${collectionId}_access-method__stage-for-delivery_${methodKey}`}
    name={`${collectionId}_access-method__stage-for-delivery_${methodKey}`}
    key={`${collectionId}_access-method__stage-for-delivery_${methodKey}`}
    value={methodKey}
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
)

const esiButton = (collectionId, methodKey) => (
  <Radio
    id={`${collectionId}_access-method__customize_${methodKey}`}
    name={`${collectionId}_access-method__customize_${methodKey}`}
    key={`${collectionId}_access-method__customize_${methodKey}`}
    value={methodKey}
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
)

const opendapButton = (collectionId, methodKey) => (
  <Radio
    id={`${collectionId}_access-method__opendap_${methodKey}`}
    name={`${collectionId}_access-method__opendap_${methodKey}`}
    key={`${collectionId}_access-method__opendap_${methodKey}`}
    value={methodKey}
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
)

/**
 * Renders AccessMethod.
 * @param {object} props - The props passed into the component.
 * @param {object} props.accessMethods - The accessMethods of the current collection.
 * @param {number} props.index - The index of the current collection.
 * @param {object} props.metadata - The metadata of the current collection.
 * @param {string} props.selectedAccessMethod - The selected access method of the current collection.
 * @param {string} props.shapefileId - The shapefile id of the uploaded shapefile.
 * @param {function} props.onSelectAccessMethod - Selects an access method.
 * @param {function} props.onSetActivePanel - Switches the currently active panel.
 * @param {function} props.onUpdateAccessMethod - Updates an access method.
 */
export const AccessMethod = ({
  accessMethods,
  index,
  metadata,
  selectedAccessMethod,
  shapefileId,
  spatial,
  onSelectAccessMethod,
  onSetActivePanel,
  onUpdateAccessMethod
}) => {
  const { id: collectionId } = metadata

  const handleAccessMethodSelection = (method) => {
    onSelectAccessMethod({
      collectionId,
      selectedAccessMethod: method
    })
  }

  const radioList = []
  Object.keys(accessMethods).forEach((methodKey) => {
    const accessMethod = accessMethods[methodKey]
    const { type } = accessMethod

    switch (type) {
      case 'download':
        radioList.push(downloadButton(collectionId))
        break
      case 'ECHO ORDERS':
        radioList.push(echoOrderButton(collectionId, methodKey))
        break
      case 'ESI':
        radioList.push(esiButton(collectionId, methodKey))
        break
      case 'OPeNDAP':
        radioList.push(opendapButton(collectionId, methodKey))
        break
      default:
        break
    }
  })

  const selectedMethod = accessMethods[selectedAccessMethod]
  const {
    form,
    rawModel,
    selectedVariables = []
  } = selectedMethod || {}

  let isOpendap = false
  if (selectedAccessMethod === 'opendap') {
    isOpendap = true
  }

  return (
    <div className="access-method">
      <ProjectPanelSection heading="Select Data Access Method">
        <div className="access-method__radio-list">
          <RadioList
            defaultValue={selectedAccessMethod}
            onChange={methodName => handleAccessMethodSelection(methodName)}
          >
            {radioList}
          </RadioList>
        </div>
      </ProjectPanelSection>
      {
        form && (
          <ProjectPanelSection>
            <EchoForm
              collectionId={collectionId}
              form={form}
              methodKey={selectedAccessMethod}
              rawModel={rawModel}
              shapefileId={shapefileId}
              spatial={spatial}
              onUpdateAccessMethod={onUpdateAccessMethod}
            />
          </ProjectPanelSection>
        )
      }
      {
        isOpendap && (
          <ProjectPanelSection>
            <h4>Variable Selection</h4>
            <p>
              Use science keywords to subset your collection granules by measurements and variables.
            </p>

            {
              selectedVariables.length > 0 && (
                <p className="panel-item-content panel-item-content-emphasis">
                  <span>{selectedVariables.length}</span>
                  variables selected
                </p>
              )
            }

            {
              selectedVariables.length === 0 && (
                <p className="panel-item-content panel-item-content-emphasis">
                  No variables selected. All variables will be included in download.
                </p>
              )
            }

            <Button
              type="button"
              varient="primary"
              bootstrapVariant="primary"
              label="Edit Variables"
              onClick={() => onSetActivePanel(`0.${index}.1`)}
            >
              Edit Variables
            </Button>
          </ProjectPanelSection>
        )
      }
    </div>
  )
}

AccessMethod.defaultProps = {
  accessMethods: {},
  index: null,
  metadata: {},
  shapefileId: null,
  onSetActivePanel: null,
  selectedAccessMethod: null
}

AccessMethod.propTypes = {
  accessMethods: PropTypes.shape({}),
  index: PropTypes.number,
  metadata: PropTypes.shape({}),
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({}).isRequired,
  onSelectAccessMethod: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func,
  onUpdateAccessMethod: PropTypes.func.isRequired,
  selectedAccessMethod: PropTypes.string
}

export default AccessMethod
