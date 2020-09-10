/* eslint-disable no-unused-vars */
import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { pluralize } from '../../util/pluralize'

import Button from '../Button/Button'
import ProjectPanelSection from '../ProjectPanels/ProjectPanelSection'
import AccessMethodRadio from '../FormFields/Radio/AccessMethodRadio'
import RadioList from '../FormFields/Radio/RadioList'
import Skeleton from '../Skeleton/Skeleton'
import Spinner from '../Spinner/Spinner'

import './AccessMethod.scss'
import {
  ousFormatMapping,
  harmonyFormatMapping
} from '../../../../../sharedUtils/outputFormatMaps'

const EchoForm = lazy(() => import('./EchoForm'))

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

      const { type, name } = accessMethod

      let id = null
      let title = null
      let subtitle = null
      let description = null
      let details = null

      switch (type) {
        case 'download': {
          id = `${collectionId}_access-method__direct-download`
          title = 'Direct Download'
          description = 'Direct download of all data associated with the selected granules.'
          details = 'The requested data files will be available for download immediately. Files will be accessed from a list of links displayed in the browser or by using a download script.'

          break
        }
        case 'ECHO ORDERS': {
          id = `${collectionId}_access-method__customize_${methodKey}`
          title = 'Stage For Delivery'
          subtitle = 'ECHO Orders'
          description = 'Submit a request for data to be staged for delivery.'
          details = 'The requested data files will be compressed in zip format and stored for retrieval via HTTP. You will receive an email from the data provider when your files are ready to download.'

          break
        }
        case 'ESI': {
          id = `${collectionId}_access-method__customize_${methodKey}`
          title = 'Customize'
          subtitle = 'ESI'
          description = 'Select options like variables, transformations, and output formats for access via the data provider.'
          details = 'The requested data files will be made available for access after the data provider has finished processing your request. You will receive an email from the data provider when your files are ready to download.'

          break
        }
        case 'OPeNDAP': {
          id = `${collectionId}_access-method__opendap_${methodKey}`
          title = 'Customize'
          subtitle = 'OPeNDAP'
          description = 'Select options like variables, transformations, and output formats for direct access via link or script.'
          details = 'The requested data files will be made available for access immediately. Files will be accessed from a list of links in the browser or by using a download script.'

          break
        }
        case 'Harmony': {
          id = `${collectionId}_access-method__harmony_${methodKey}`
          title = 'Customize'
          subtitle = 'Harmony'
          description = 'Select options like variables, transformations, and output formats for in-region cloud access.'
          details = 'The requested data will be processed using the Harmony service and stored in the cloud for analysis.'

          break
        }
        default:
          break
      }

      accessMethodsByType[type].push(
        <AccessMethodRadio
          key={id}
          id={id}
          value={methodKey}
          title={title}
          subtitle={subtitle}
          serviceName={name}
          description={description}
          details={details}
        />
      )
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
