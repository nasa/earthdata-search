import React, { Component } from 'react'
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
import { getApplicationConfig } from '../../../../../sharedUtils/config'

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
    Customize (Subset)
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

const formatMapping = {
  'NETCDF-3': 'nc',
  'NETCDF-4': 'nc4',
  BINARY: 'dods',
  ASCII: 'ascii'
}

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
export class AccessMethod extends Component {
  constructor(props) {
    super(props)

    const {
      accessMethods,
      selectedAccessMethod
    } = props
    const selectedMethod = accessMethods[selectedAccessMethod]
    const {
      selectedOutputFormat = ''
    } = selectedMethod || {}

    this.state = { selectedOutputFormat }

    this.handleAccessMethodSelection = this.handleAccessMethodSelection.bind(this)
    this.handleOutputFormatSelection = this.handleOutputFormatSelection.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { selectedOutputFormat } = this.state
    const {
      accessMethods,
      selectedAccessMethod
    } = nextProps

    if (selectedAccessMethod === 'opendap') {
      const selectedMethod = accessMethods[selectedAccessMethod]
      const {
        selectedOutputFormat: nextSelectedOutputFormat,
        supportedOutputFormats = []
      } = selectedMethod || {}

      // If there is no selected option, select the first option
      if (nextSelectedOutputFormat !== selectedOutputFormat) {
        if (!nextSelectedOutputFormat) {
          // Filter the supportedOutputFormats to only those formats CMR supports
          const cmrSupportedFormats = supportedOutputFormats.filter(
            format => formatMapping[format] !== undefined
          )

          const defaultSelectedOutputFormat = formatMapping[cmrSupportedFormats[0]]
          this.setState({ selectedOutputFormat: defaultSelectedOutputFormat })
        } else {
          this.setState({ selectedOutputFormat: nextSelectedOutputFormat })
        }
      }
    }
  }

  handleAccessMethodSelection(method) {
    const { metadata, onSelectAccessMethod } = this.props
    const { granule_count: granuleCount, id: collectionId } = metadata

    const { defaultGranulesPerOrder } = getApplicationConfig()

    const orderCount = Math.ceil(granuleCount / parseInt(defaultGranulesPerOrder, 10))

    onSelectAccessMethod({
      collectionId,
      selectedAccessMethod: method,
      orderCount: ['download', 'opendap'].includes(method) ? 0 : orderCount
    })
  }

  handleOutputFormatSelection(event) {
    const { metadata, onUpdateAccessMethod } = this.props
    const { id: collectionId } = metadata

    const { target } = event
    const { value } = target

    this.setState({ selectedOutputFormat: value })

    onUpdateAccessMethod({
      collectionId,
      method: {
        opendap: {
          selectedOutputFormat: value
        }
      }
    })
  }

  render() {
    const { selectedOutputFormat } = this.state
    const {
      accessMethods,
      index,
      isActive,
      metadata,
      selectedAccessMethod,
      shapefileId,
      spatial,
      onSetActivePanel,
      onUpdateAccessMethod
    } = this.props

    const { id: collectionId } = metadata

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
          containerStyle={{
            height: '40px',
            width: '300px',
            marginBottom: '8px'
          }}
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
      selectedVariables = [],
      supportedOutputFormats = []
    } = selectedMethod || {}

    const isOpendap = (selectedAccessMethod === 'opendap')

    let supportedOutputFormatOptions
    if (isOpendap) {
      // Filter the supportedOutputFormats to only those formats CMR supports
      const cmrSupportedFormats = supportedOutputFormats.filter(
        format => formatMapping[format] !== undefined
      )

      // Build options for supportedOutputFormats
      supportedOutputFormatOptions = cmrSupportedFormats.map(format => (
        <option key={format} value={formatMapping[format]}>{format}</option>
      ))
    }

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
                    onChange={methodName => this.handleAccessMethodSelection(methodName)}
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
            <>
              <ProjectPanelSection heading="Variable Selection">
                <p className="access-method__section-intro">
                  Use science keywords to subset your collection
                  granules by measurements and variables.
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
              <ProjectPanelSection heading="Output Format Selection">
                <p className="access-method__section-intro">
                  Choose from output format options like GeoTIFF, NETCDF, and other file types.
                </p>

                <select
                  id="input__output-format"
                  className="form-control form-control-sm"
                  onChange={this.handleOutputFormatSelection}
                  value={selectedOutputFormat}
                >
                  {supportedOutputFormatOptions}
                </select>
              </ProjectPanelSection>
            </>
          )
        }
      </div>
    )
  }
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
