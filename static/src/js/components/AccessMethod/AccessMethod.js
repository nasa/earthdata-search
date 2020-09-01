import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { pluralize } from '../../util/pluralize'

import Button from '../Button/Button'
import ProjectPanelSection from '../ProjectPanels/ProjectPanelSection'
import Radio from '../FormFields/Radio/Radio'
import RadioList from '../FormFields/Radio/RadioList'
import Skeleton from '../Skeleton/Skeleton'
import Spinner from '../Spinner/Spinner'

import './AccessMethod.scss'
import {
  ousFormatMapping,
  harmonyFormatMapping
} from '../../../../../sharedUtils/outputFormatMaps'

const EchoForm = lazy(() => import('./EchoForm'))

const downloadButton = collectionId => (
  <Radio
    id={`${collectionId}_access-method__direct-download`}
    dataTestId={`${collectionId}_access-method__direct-download`}
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
    dataTestId={`${collectionId}_access-method__stage-for-delivery_${methodKey}`}
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
    dataTestId={`${collectionId}_access-method__customize_${methodKey}`}
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
    dataTestId={`${collectionId}_access-method__opendap_${methodKey}`}
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

const harmonyButton = (collectionId, methodKey) => (
  <Radio
    id={`${collectionId}_access-method__harmony_${methodKey}`}
    dataTestId={`${collectionId}_access-method__harmony_${methodKey}`}
    name={`${collectionId}_access-method__harmony_${methodKey}`}
    key={`${collectionId}_access-method__harmony_${methodKey}`}
    value={methodKey}
  >
    Customize (Harmony)
    <OverlayTrigger
      placement="right"
      overlay={(
        <Tooltip
          className="tooltip--large tooltip--ta-left"
        >
          Select options like variables, transformations, and output formats to customize your data.
          The desired data files will be made available in a variety of ways, allowing you to choose
          your preferred method for using the data.
        </Tooltip>
      )}
    >
      <i className="access-method__radio-tooltip fa fa-info-circle" />
    </OverlayTrigger>
  </Radio>
)

/**
 * Renders AccessMethod.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.accessMethods - The accessMethods of the current collection.
 * @param {Number} props.index - The index of the current collection.
 * @param {Object} props.metadata - The metadata of the current collection.
 * @param {String} props.selectedAccessMethod - The selected access method of the current collection.
 * @param {String} props.shapefileId - The shapefile id of the uploaded shapefile.
 * @param {Function} props.onSelectAccessMethod - Selects an access method.
 * @param {Function} props.onSetActivePanel - Switches the currently active panel.
 * @param {Function} props.onUpdateAccessMethod - Updates an access method.
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
      selectedOutputFormat = '',
      selectedOutputProjection = '',
      supportedOutputFormats = [],
      supportedOutputProjections = []
    } = selectedMethod || {}

    this.state = {
      selectedOutputFormat: selectedOutputFormat || supportedOutputFormats[0],
      selectedOutputProjection: selectedOutputProjection || supportedOutputProjections[0]
    }

    this.handleAccessMethodSelection = this.handleAccessMethodSelection.bind(this)
    this.handleOutputFormatSelection = this.handleOutputFormatSelection.bind(this)
    this.handleOutputProjectionSelection = this.handleOutputProjectionSelection.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { selectedOutputFormat, selectedOutputProjection } = this.state
    const {
      accessMethods,
      selectedAccessMethod
    } = nextProps

    if (
      selectedAccessMethod
      && (selectedAccessMethod === 'opendap'
      || selectedAccessMethod.includes('harmony'))
    ) {
      const selectedMethod = accessMethods[selectedAccessMethod]
      const {
        selectedOutputFormat: nextSelectedOutputFormat,
        selectedOutputProjection: nextSelectedOutputProjection,
        supportedOutputFormats = [],
        supportedOutputProjections = []
      } = selectedMethod || {}

      // If there is no selected option, select the first option
      if (nextSelectedOutputFormat !== selectedOutputFormat) {
        if (!nextSelectedOutputFormat) {
          let defaultSelectedOutputFormat

          if (selectedAccessMethod === 'opendap') {
            // Pull out the ext value from formatMappings
            const ousSupportedFormats = supportedOutputFormats.filter(
              format => ousFormatMapping[format] !== undefined
            )

            defaultSelectedOutputFormat = ousFormatMapping[ousSupportedFormats[0]]
          } else if (selectedAccessMethod.includes('harmony')) {
            // Pull out the ext value from formatMappings
            const harmonySupportedFormats = supportedOutputFormats.filter(
              format => harmonyFormatMapping[format] !== undefined
            )

            defaultSelectedOutputFormat = harmonyFormatMapping[harmonySupportedFormats[0]]
          }

          this.setState({ selectedOutputFormat: defaultSelectedOutputFormat })
        } else {
          this.setState({ selectedOutputFormat: nextSelectedOutputFormat })
        }
      }

      // If there is no selected option, select the first option
      if (nextSelectedOutputProjection !== selectedOutputProjection) {
        if (!nextSelectedOutputProjection) {
          const defaultSelectedOutputProjection = supportedOutputProjections[0]
          this.setState({ selectedOutputProjection: defaultSelectedOutputProjection })
        } else {
          this.setState({ selectedOutputProjection: nextSelectedOutputProjection })
        }
      }
    }
  }

  handleAccessMethodSelection(method) {
    const { metadata, onSelectAccessMethod } = this.props

    const { conceptId: collectionId } = metadata

    onSelectAccessMethod({
      collectionId,
      selectedAccessMethod: method
    })
  }

  handleOutputFormatSelection(event) {
    const { metadata, onUpdateAccessMethod, selectedAccessMethod } = this.props
    const { conceptId: collectionId } = metadata

    const { target } = event
    const { value } = target

    this.setState({ selectedOutputFormat: value })

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          selectedOutputFormat: value
        }
      }
    })
  }

  handleOutputProjectionSelection(event) {
    const { metadata, onUpdateAccessMethod, selectedAccessMethod } = this.props
    const { conceptId: collectionId } = metadata

    const { target } = event
    const { value } = target

    this.setState({ selectedOutputProjection: value })

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          selectedOutputProjection: value
        }
      }
    })
  }

  render() {
    const { selectedOutputFormat, selectedOutputProjection } = this.state
    const {
      accessMethods,
      index,
      isActive,
      metadata,
      onSetActivePanel,
      onTogglePanels,
      onUpdateAccessMethod,
      selectedAccessMethod,
      shapefileId,
      spatial
    } = this.props

    const { conceptId: collectionId } = metadata

    const accessMethodsByType = {
      download: [],
      'ECHO ORDERS': [],
      ESI: [],
      OPeNDAP: [],
      Harmony: []
    }

    Object.keys(accessMethods).forEach((methodKey) => {
      const accessMethod = accessMethods[methodKey]
      const { type } = accessMethod

      switch (type) {
        case 'download':
          accessMethodsByType[type].push(downloadButton(collectionId))
          break
        case 'ECHO ORDERS':
          accessMethodsByType[type].push(echoOrderButton(collectionId, methodKey))
          break
        case 'ESI':
          accessMethodsByType[type].push(esiButton(collectionId, methodKey))
          break
        case 'OPeNDAP':
          accessMethodsByType[type].push(opendapButton(collectionId, methodKey))
          break
        case 'Harmony':
          accessMethodsByType[type].push(harmonyButton(collectionId, methodKey))
          break
        default:
          break
      }
    })

    const radioList = [
      ...accessMethodsByType.Harmony,
      ...accessMethodsByType.OPeNDAP,
      ...accessMethodsByType.ESI,
      ...accessMethodsByType['ECHO ORDERS'],
      ...accessMethodsByType.download
    ]

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
      rawModel = null,
      selectedVariables = [],
      supportedOutputFormats = [],
      supportedOutputProjections = [],
      supportsVariableSubsetting = false
    } = selectedMethod || {}

    const isOpendap = (selectedAccessMethod && selectedAccessMethod === 'opendap')

    // Harmony access methods are postfixed with an index given that there can be more than one
    const isHarmony = (selectedAccessMethod && selectedAccessMethod.includes('harmony'))

    // Default supportedOutputFormat
    let supportedOutputFormatOptions = supportedOutputFormats

    if (isOpendap) {
      // Filter the supportedOutputFormats to only those formats CMR supports
      supportedOutputFormatOptions = supportedOutputFormats.filter(
        format => ousFormatMapping[format] !== undefined
      )

      // Build options for supportedOutputFormats
      supportedOutputFormatOptions = supportedOutputFormatOptions.map(format => (
        <option key={format} value={ousFormatMapping[format]}>{format}</option>
      ))
    }

    let supportedOutputProjectionOptions
    if (isHarmony) {
      // Filter the supportedOutputFormats to only those formats Harmony supports
      supportedOutputFormatOptions = supportedOutputFormats.filter(
        format => harmonyFormatMapping[format] !== undefined
      )

      // Build options for supportedOutputFormats
      supportedOutputFormatOptions = supportedOutputFormatOptions.map(format => (
        <option key={format} value={harmonyFormatMapping[format]}>{format}</option>
      ))

      // Build options for supportedOutputFormats
      supportedOutputProjectionOptions = supportedOutputProjections.map(format => (
        <option key={format} value={format}>{format}</option>
      ))
    }

    const echoFormFallback = (
      <div className="access-method__echoform-loading">
        <Spinner className="access-method__echoform-spinner" size="tiny" type="dots" />
      </div>
    )

    const isCustomizationAvailable = supportsVariableSubsetting
      || supportedOutputFormats.length > 0
      || (form && isActive)

    return (
      <div className="access-method">
        <ProjectPanelSection
          heading="Select a data access method"
          intro="The selected access method will determine which customization and output options are available."
          step={1}
        >
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
        <ProjectPanelSection
          heading="Configure data customization options"
          intro="Edit the options below to configure the customization and output options for the selected data product."
          step={2}
          faded={!selectedAccessMethod}
        >
          {
            isCustomizationAvailable && (
              <>
                {
                  form && isActive && (
                    <ProjectPanelSection nested>
                      <Suspense fallback={echoFormFallback}>
                        <EchoForm
                          collectionId={collectionId}
                          form={form}
                          methodKey={selectedAccessMethod}
                          rawModel={rawModel}
                          shapefileId={shapefileId}
                          spatial={spatial}
                          onUpdateAccessMethod={onUpdateAccessMethod}
                        />
                      </Suspense>
                    </ProjectPanelSection>
                  )
                }
                {
                  supportsVariableSubsetting && (
                    <>
                      <ProjectPanelSection
                        customHeadingTag="h4"
                        heading="Variables"
                        intro="Use science keywords to subset your collection granules by measurements and variables."
                        nested
                      >
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
                          onClick={() => {
                            onSetActivePanel(`0.${index}.1`)
                            onTogglePanels(true)
                          }}
                        >
                          Edit Variables
                        </Button>
                      </ProjectPanelSection>
                    </>
                  )
                }
                {
                  supportedOutputFormats.length > 0 && (
                    <>
                      <ProjectPanelSection
                        customHeadingTag="h4"
                        heading="Output Format"
                        intro="Choose from output format options like GeoTIFF, NETCDF, and other file types."
                        nested
                      >
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
                {
                  supportedOutputProjections.length > 0 && (
                    <>
                      <ProjectPanelSection heading="Output Projection Selection">
                        <p className="access-method__section-intro">
                          Choose from output projection options.
                        </p>

                        <select
                          id="input__output-projection"
                          className="form-control form-control-sm"
                          onChange={this.handleOutputProjectionSelection}
                          value={selectedOutputProjection}
                        >
                          {supportedOutputProjectionOptions}
                        </select>
                      </ProjectPanelSection>
                    </>
                  )
                }
              </>
            )
          }
          {
            (!isCustomizationAvailable && selectedAccessMethod) && (
              <ProjectPanelSection nested>
                No customization options are available for the selected access method.
              </ProjectPanelSection>
            )
          }
        </ProjectPanelSection>
      </div>
    )
  }
}

AccessMethod.defaultProps = {
  accessMethods: {},
  index: null,
  isActive: false,
  metadata: {},
  onSetActivePanel: null,
  onTogglePanels: null,
  selectedAccessMethod: null,
  shapefileId: null,
  spatial: {}
}

AccessMethod.propTypes = {
  accessMethods: PropTypes.shape({}),
  index: PropTypes.number,
  isActive: PropTypes.bool,
  metadata: PropTypes.shape({}),
  onSelectAccessMethod: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func,
  onTogglePanels: PropTypes.func,
  onUpdateAccessMethod: PropTypes.func.isRequired,
  selectedAccessMethod: PropTypes.string,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({})
}

export default AccessMethod
