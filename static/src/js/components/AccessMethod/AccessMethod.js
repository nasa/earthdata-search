import React from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { pluralize } from '../../util/pluralize'

import Skeleton from '../Skeleton/Skeleton'
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
  isActive,
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

  const skeleton = [1, 2, 3].map((skeleton, i) => {
    const key = `skeleton_${i}`
    return (
      <Skeleton
        key={key}
        containerStyle={{ height: '2.9375rem', width: '18.75rem' }}
        shapes={[{
          shape: 'rectangle',
          x: 0,
          y: 0,
          height: 40,
          width: 300,
          radius: 3
        }]}
      />
    )
  })

  const selectedMethod = accessMethods[selectedAccessMethod]
  const {
    form,
    rawModel,
    selectedVariables = []
  } = selectedMethod || {}

  const isOpendap = (selectedAccessMethod === 'opendap')

  return (
    <div className="access-method">
      <ProjectPanelSection heading="Select Data Access Method">
        <div className="access-method__radio-list">
          {
            radioList.length === 0
              ? skeleton
              : (
                <RadioList
                  defaultValue={selectedAccessMethod}
                  onChange={methodName => handleAccessMethodSelection(methodName)}
                >
                  {radioList}
                </RadioList>
              )
          }
        </div>
      </ProjectPanelSection>
      {
        form && isActive && (
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
          <ProjectPanelSection heading="Variable Selection">
            <p className="access-method__section-intro">
              Use science keywords to subset your collection granules by measurements and variables.
            </p>

            {
              selectedVariables.length > 0 && (
                <p className="access-method__section-status">
                  {`${selectedVariables.length} ${pluralize('variable', selectedVariables.length)} selected`}
                </p>
              )
            }

            {
              selectedVariables.length === 0 && (
                <p className="access-method__section-status">
                  No variables selected. All variables will be included in download.
                </p>
              )
            }

            <Button
              type="button"
              bootstrapVariant="primary"
              label="Edit Variables"
              bootstrapSize="sm"
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
  isActive: false,
  metadata: {},
  shapefileId: null,
  spatial: {},
  onSetActivePanel: null,
  selectedAccessMethod: null
}

AccessMethod.propTypes = {
  accessMethods: PropTypes.shape({}),
  index: PropTypes.number,
  isActive: PropTypes.bool,
  metadata: PropTypes.shape({}),
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({}),
  onSelectAccessMethod: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func,
  onUpdateAccessMethod: PropTypes.func.isRequired,
  selectedAccessMethod: PropTypes.string
}

export default AccessMethod
