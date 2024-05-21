import React, {
  Component,
  lazy,
  Suspense
} from 'react'
import PropTypes from 'prop-types'
import {
  Accordion,
  Alert,
  Card,
  Form,
  Container,
  Row,
  Table,
  OverlayTrigger,
  Tooltip,
  Col
} from 'react-bootstrap'
import moment from 'moment'
import * as Select from '@radix-ui/react-select'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import {
  FaFileAlt,
  FaExternalLinkAlt,
  FaQuestionCircle
} from 'react-icons/fa'

import { pluralize } from '../../util/pluralize'
import { createSpatialDisplay } from '../../util/createSpatialDisplay'
import { getTemporalDateFormat } from '../../../../../sharedUtils/edscDate'
import { ousFormatMapping, harmonyFormatMapping } from '../../../../../sharedUtils/outputFormatMaps'
import { swodlrToolTips } from '../../constants/swodlrToolTips'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import ProjectPanelSection from '../ProjectPanels/ProjectPanelSection'
import AccessMethodRadio from '../FormFields/AccessMethodRadio/AccessMethodRadio'
import RadioList from '../FormFields/RadioList/RadioList'
import Spinner from '../Spinner/Spinner'

import './AccessMethod.scss'

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
      selectedAccessMethod,
      temporal,
      spatial
    } = props

    const { isRecurring } = temporal
    const {
      boundingBox,
      circle,
      line,
      point,
      polygon
    } = spatial

    const selectedMethod = accessMethods[selectedAccessMethod]

    // Disable temporal subsetting if the user has a recurring date selected
    const {
      enableTemporalSubsetting = !isRecurring
    } = selectedMethod || {}

    const {
      enableConcatenateDownload
    } = selectedMethod || false

    const {
      enableSpatialSubsetting = !(
        boundingBox === undefined
        && circle === undefined
        && line === undefined
        && point === undefined
        && polygon === undefined
      )
    } = selectedMethod || {}

    const isHarmony = selectedAccessMethod
      ? selectedAccessMethod.startsWith('harmony')
      : false

    let selectedHarmonyMethodName = ''
    if (selectedAccessMethod
      && isHarmony
      && accessMethods[selectedAccessMethod].name) {
      selectedHarmonyMethodName = accessMethods[selectedAccessMethod].name
    }

    this.state = {
      enableTemporalSubsetting,
      enableSpatialSubsetting,
      enableConcatenateDownload,
      isHarmony,
      selectedHarmonyMethodName
    }

    this.handleAccessMethodSelection = this.handleAccessMethodSelection.bind(this)
    this.handleOutputFormatSelection = this.handleOutputFormatSelection.bind(this)
    this.handleOutputProjectionSelection = this.handleOutputProjectionSelection.bind(this)
    this.handleToggleTemporalSubsetting = this.handleToggleTemporalSubsetting.bind(this)
    this.handleToggleSpatialSubsetting = this.handleToggleSpatialSubsetting.bind(this)
    this.handleConcatenationSelection = this.handleConcatenationSelection.bind(this)
    this.handleHarmonySelection = this.handleHarmonySelection.bind(this)
    this.handleSwoldrOptions = this.handleSwoldrOptions.bind(this)
  }

  UNSAFE_componentWillReceiveProps() {
    const { temporal } = this.props

    const { isRecurring } = temporal

    // Disable temporal subsetting if the user has a recurring date selected
    if (isRecurring) {
      this.setState({
        enableTemporalSubsetting: false
      })
    }
  }

  componentDidUpdate() {
    const { accessMethods, selectedAccessMethod } = this.props
    const { selectedHarmonyMethodName } = this.state

    if (selectedAccessMethod
      && selectedAccessMethod.startsWith('harmony')
      && accessMethods[selectedAccessMethod].name
      && selectedHarmonyMethodName === '') {
      this.setState({
        selectedHarmonyMethodName: accessMethods[selectedAccessMethod].name
      })
    }
  }

  handleHarmonyTypeAccessMethodSelection() {
    this.setState({ isHarmony: true })

    const { metadata, onSelectAccessMethod } = this.props
    const { conceptId: collectionId } = metadata

    onSelectAccessMethod({
      collectionId,
      selectedAccessMethod: null
    })

    // Clear the text for the <Select> in step 2
    this.setState({
      selectedHarmonyMethodName: ''
    })
  }

  handleAccessMethodSelection(method) {
    const { metadata, onSelectAccessMethod } = this.props
    const { conceptId: collectionId } = metadata

    if (!method.includes('harmony')) {
      this.setState({ isHarmony: false })
    }

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

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          selectedOutputProjection: value
        }
      }
    })
  }

  handleConcatenationSelection(event) {
    const { metadata, onUpdateAccessMethod, selectedAccessMethod } = this.props
    const { conceptId: collectionId } = metadata

    const { target } = event
    const { checked } = target

    this.setState({ enableConcatenateDownload: checked })

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          enableConcatenateDownload: checked
        }
      }
    })
  }

  handleToggleTemporalSubsetting(event) {
    const { metadata, onUpdateAccessMethod, selectedAccessMethod } = this.props
    const { conceptId: collectionId } = metadata

    const { target } = event
    const { checked } = target

    this.setState({ enableTemporalSubsetting: checked })

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          enableTemporalSubsetting: checked
        }
      }
    })
  }

  handleToggleSpatialSubsetting(event) {
    const { metadata, onUpdateAccessMethod, selectedAccessMethod } = this.props
    const { conceptId: collectionId } = metadata

    const { target } = event
    const { checked } = target

    this.setState({ enableSpatialSubsetting: checked })

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          enableSpatialSubsetting: checked
        }
      }
    })
  }

  handleHarmonySelection(event, harmonyMethods) {
    if (event) {
      this.setState({
        selectedHarmonyMethodName: harmonyMethods.find(({ methodKey }) => methodKey === event).name
      })

      this.handleAccessMethodSelection(event)
    }
  }

  handleSwoldrOptions() {
    console.log('Handling Swodlr')
    const { metadata, onUpdateAccessMethod, selectedAccessMethod } = this.props
    const { conceptId: collectionId } = metadata

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          json_data: {
            params: {
              rasterResolution: 6,
              outputSamplingGridType: 'GEO',
              outputGranuleExtentFlag: false
            },
            custom_params: {
              'G2938391118-POCLOUD': {
                utmZoneAdjust: null,
                mgrsBandAdjust: null
              },
              'G2938390924-POCLOUD': {
                utmZoneAdjust: null,
                mgrsBandAdjust: null
              }
            }
          }
        }
      }
    })
  }

  getAccessMethodTypes(hasHarmony, radioList, collectionId, selectedAccessMethod) {
    if (hasHarmony) {
      const id = `${collectionId}_access-method__harmony_type`
      const { isHarmony } = this.state

      return (
        <>
          <AccessMethodRadio
            key={id}
            id={id}
            value="HarmonyMethodType"
            title="Customize with Harmony"
            description="Select a Harmony service to customize options"
            details="Select options like variables, transformations, and output formats by applying a Harmony service. Data will be staged in the cloud for download and analysis."
            onChange={() => this.handleHarmonyTypeAccessMethodSelection()}
            checked={isHarmony}
          />

          <RadioList
            defaultValue={selectedAccessMethod}
            onChange={(methodName) => this.handleAccessMethodSelection(methodName)}
            radioList={radioList}
            renderRadio={this.renderRadioItem}
          />
        </>
      )
    }

    return (
      <RadioList
        defaultValue={selectedAccessMethod}
        onChange={(methodName) => this.handleAccessMethodSelection(methodName)}
        radioList={radioList}
        renderRadio={this.renderRadioItem}
      />
    )
  }

  createHarmonySelectItem(radioItem, selected) {
    const {
      id,
      methodKey,
      title,
      subtitle,
      description,
      details,
      customizationOptions
    } = radioItem

    return (
      <Select.Item className="harmony-select-item" key={methodKey} value={methodKey}>
        <AccessMethodRadio
          key={id}
          id={id}
          value={methodKey}
          title={title}
          subtitle={subtitle}
          description={description}
          details={details}
          checked={selected === methodKey}
          customizationOptions={customizationOptions}
          onChange={() => true}
          isHarmony
        />
      </Select.Item>
    )
  }

  createHarmonySelector(harmonyMethods, selectedAccessMethod) {
    const { selectedHarmonyMethodName } = this.state

    return (
      <Select.Root
        name="harmony-method-selector"
        value={selectedHarmonyMethodName}
        onValueChange={(e) => this.handleHarmonySelection(e, harmonyMethods)}
      >
        <span>Service</span>
        <Select.Trigger key="harmony-trigger" className="harmony-select-trigger">
          <Select.Value placeholder="Choose a service">
            {selectedHarmonyMethodName}
          </Select.Value>
          <Select.Icon className="harmony-select-icon" />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="harmony-select-content" position="popper">
            <ScrollArea.Root className="harmony-scroll-area-root" type="auto">
              <Select.Viewport key="harmony-selector-viewport" className="harmony-select-viewport" asChild>
                <ScrollArea.Viewport className="harmony-scroll-area-viewport" style={{ overflowY: undefined }}>
                  <div id="harmony_methods">
                    {
                      harmonyMethods.map(
                        (radio) => this.createHarmonySelectItem(radio, selectedAccessMethod)
                      )
                    }
                  </div>
                </ScrollArea.Viewport>
              </Select.Viewport>
              <ScrollArea.Scrollbar
                className="harmony-scroll-area-scrollbar"
                orientation="vertical"
              >
                <ScrollArea.Thumb className="harmony-scroll-area-thumb" />
              </ScrollArea.Scrollbar>
              <Select.Arrow />
            </ScrollArea.Root>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    )
  }

  renderRadioItem(radioItem, onPropsChange, selected) {
    const {
      id,
      methodKey,
      title,
      subtitle,
      description,
      details
    } = radioItem

    return (
      <AccessMethodRadio
        key={id}
        id={id}
        value={methodKey}
        title={title}
        subtitle={subtitle}
        description={description}
        details={details}
        onChange={onPropsChange}
        checked={selected === methodKey}
      />
    )
  }

  render() {
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
      spatial,
      temporal,
      ursProfile
    } = this.props

    const { conceptId: collectionId } = metadata

    const accessMethodsByType = {
      download: [],
      'ECHO ORDERS': [],
      ESI: [],
      OPeNDAP: [],
      Harmony: [],
      SWODLR: []
    }

    let hasHarmony = false

    console.log('🚀 ~ file: AccessMethod.js:485 ~ AccessMethod ~ Object.keys ~ accessMethods:', accessMethods)
    Object.keys(accessMethods).forEach((methodKey) => {
      const { [methodKey]: accessMethod = {} } = accessMethods

      const {
        type,
        name,
        description: descriptionFromMetadata,
        supportsBoundingBoxSubsetting: hasBBoxSubsetting,
        supportsShapefileSubsetting: hasShapefileSubsetting,
        supportsTemporalSubsetting: hasTemporalSubsetting,
        supportsVariableSubsetting: hasVariables,
        supportsConcatenation: hasCombine,
        supportedOutputFormats,
        supportedOutputProjections
      } = accessMethod

      let id = null
      let title = null
      let subtitle = null
      let description = null
      let details = null
      let hasFormats = null
      let hasProjections = null
      let hasTransform = null
      let hasSpatialSubsetting = null
      let customizationOptions = null

      console.log('🚀 ~ file: AccessMethod.js:512 ~ AccessMethod ~ Object.keys ~ type:', type)
      switch (type) {
        case 'download': {
          id = `${collectionId}_access-method__direct-download`
          title = 'Download all data'
          description = 'Direct download of all selected data'
          details = 'The data will be available for download immediately.'

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
          title = 'Customize with OPeNDAP'
          description = 'Select options like variables, transformations, and output formats for direct access via link or script'
          details = 'The data will be made available for access immediately.'

          break
        }

        case 'Harmony': {
          id = `${collectionId}_access-method__harmony_${methodKey}`
          title = name
          description = descriptionFromMetadata
          hasHarmony = true
          hasSpatialSubsetting = hasShapefileSubsetting || hasBBoxSubsetting
          hasFormats = supportedOutputFormats
            ? supportedOutputFormats.length > 0
            : false

          hasProjections = supportedOutputProjections
            ? supportedOutputProjections.length > 1
            : false

          // TODO: include interpolation in hasTransform boolean once Harmony supports interpolation
          hasTransform = hasProjections

          customizationOptions = {
            hasTemporalSubsetting,
            hasVariables,
            hasCombine,
            hasSpatialSubsetting,
            hasFormats,
            hasTransform
          }

          break
        }

        case 'SWODLR': {
          id = `${collectionId}_access-method__swodlr_${methodKey}`
          title = 'Generate with SWODLR'
          description = 'Set options and generate new standard products'
          details = 'Select options and generate customized products using the SWODLR service. Data will be avaliable for access once any necessary processing is complete.'

          break
        }

        default:
          break
      }

      if (type) {
        accessMethodsByType[type].push(
          {
            id,
            methodKey,
            title,
            subtitle,
            name,
            description,
            details,
            customizationOptions
          }
        )
      }
    })

    const radioList = [
      ...accessMethodsByType.OPeNDAP,
      ...accessMethodsByType.ESI,
      ...accessMethodsByType['ECHO ORDERS'],
      ...accessMethodsByType.download,
      ...accessMethodsByType.SWODLR
    ]

    const { [selectedAccessMethod]: selectedMethod = {} } = accessMethods

    const {
      form,
      rawModel = null,
      selectedVariables = [],
      selectedOutputFormat,
      selectedOutputProjection,
      supportedOutputFormats = [],
      supportedOutputProjections = [],
      supportsTemporalSubsetting = false,
      supportsShapefileSubsetting = false,
      supportsBoundingBoxSubsetting = false,
      supportsVariableSubsetting = false,
      supportsConcatenation = false,
      supportsSwodlr = false,
      defaultConcatenation = false
    } = selectedMethod || {}

    const {
      enableTemporalSubsetting,
      enableSpatialSubsetting,
      enableConcatenateDownload = defaultConcatenation
    } = this.state

    const isOpendap = (selectedAccessMethod && selectedAccessMethod === 'opendap')

    // Harmony access methods are postfixed with an index given that there can be more than one
    const { isHarmony, selectedHarmonyMethodName } = this.state

    // Default supportedOutputFormatOptions
    let supportedOutputFormatOptions = []

    if (isOpendap) {
      // Filter the supportedOutputFormats to only those formats CMR supports
      supportedOutputFormatOptions = supportedOutputFormats.filter(
        (format) => ousFormatMapping[format] !== undefined
      )

      // Build options for supportedOutputFormats
      supportedOutputFormatOptions = supportedOutputFormatOptions.map((format) => (
        <option key={format} value={ousFormatMapping[format]}>{format}</option>
      ))
    }

    // Default supportedOutputProjectionOptions
    let supportedOutputProjectionOptions = []

    if (isHarmony) {
      // Filter the supportedOutputFormats to only those formats Harmony supports
      supportedOutputFormatOptions = supportedOutputFormats.filter(
        (format) => harmonyFormatMapping[format] !== undefined
      )

      // Build options for supportedOutputFormats
      supportedOutputFormatOptions = supportedOutputFormatOptions.map((format) => (
        <option key={format} value={harmonyFormatMapping[format]}>{format}</option>
      ))

      // Build options for supportedOutputFormats
      supportedOutputProjectionOptions = supportedOutputProjections.map((format) => (
        <option key={format} value={format}>{format}</option>
      ))
    }

    const echoFormFallback = (
      <div className="access-method__echoform-loading">
        <Spinner className="access-method__echoform-spinner" dataTestId="access-method-echoform-spinner" size="tiny" type="dots" />
      </div>
    )

    const isCustomizationAvailable = supportsVariableSubsetting
      || supportsTemporalSubsetting
      || supportsShapefileSubsetting
      || supportsBoundingBoxSubsetting
      || supportedOutputFormatOptions.length > 0
      || supportedOutputProjectionOptions.length > 0
      || supportsSwodlr
      || supportsConcatenation
      || (form && isActive)

    const {
      startDate = '',
      endDate = '',
      isRecurring = false
    } = temporal

    const temporalDateFormat = getTemporalDateFormat(isRecurring)
    const format = 'YYYY-MM-DDTHH:m:s.SSSZ'

    let startDateObject
    let endDateObject = moment.utc(endDate, format, true)
    let startDateDisplay
    let endDateDisplay

    if (startDate) {
      startDateObject = moment.utc(startDate, format, true)
    }

    if (endDate) {
      endDateObject = moment.utc(endDate, format, true)
    }

    if (startDateObject) {
      startDateDisplay = startDateObject.format(temporalDateFormat)
    }

    if (endDateObject) {
      endDateDisplay = endDateObject.format(temporalDateFormat)
    }

    let selectedTemporalDisplay

    if (startDate && endDate) {
      selectedTemporalDisplay = `${startDateDisplay} to ${endDateDisplay}`
    }

    if (startDate && !endDate) {
      selectedTemporalDisplay = `${startDateDisplay} ongoing`
    }

    if (endDate && !startDate) {
      selectedTemporalDisplay = `Up to ${endDateDisplay}`
    }

    const selectedSpatialDisplay = createSpatialDisplay(spatial)

    // Checking to see if the selectedMethod variables exists and has at least one variable
    const hasVariables = selectedMethod.variables
      ? Object.keys(selectedMethod.variables).length > 0
      : false

    const harmonyMethods = accessMethodsByType.Harmony

    return (
      <div className="access-method">
        <ProjectPanelSection
          heading="Choose how you want to download your data"
          step={1}
        >
          <div className="access-method__radio-list">
            {
              radioList.length === 0 && hasHarmony === false
                ? (
                  <Alert
                    variant="warning"
                  >
                    No access methods exist for this collection.
                  </Alert>
                )
                : this.getAccessMethodTypes(
                  hasHarmony,
                  radioList,
                  collectionId,
                  selectedAccessMethod
                )
            }
          </div>
        </ProjectPanelSection>
        <ProjectPanelSection
          heading="Select a service and customize options"
          step={2}
          faded={!selectedAccessMethod && !isHarmony}
        >
          {
            isHarmony && harmonyMethods.length > 0 && (
              this.createHarmonySelector(harmonyMethods, selectedAccessMethod)
            )
          }
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
                          temporal={temporal}
                          ursProfile={ursProfile}
                          onUpdateAccessMethod={onUpdateAccessMethod}
                        />
                      </Suspense>
                    </ProjectPanelSection>
                  )
                }
                {
                  // Show Harmony method description
                  isHarmony && (
                    <div className="access-method__harmony-method-info">
                      <h3 className="project-panel-section__heading">{selectedHarmonyMethodName}</h3>
                      <p>{accessMethods[selectedAccessMethod].description}</p>
                      <p>
                        <a
                          className="link"
                          href="https://harmony.earthdata.nasa.gov/docs#service-capabilities"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <EDSCIcon icon={FaFileAlt} className="access-method__documentation-icon" />
                          Documentation
                          <EDSCIcon icon={FaExternalLinkAlt} size="12" className="access-method__external-link-icon" />
                        </a>
                      </p>
                    </div>
                  )
                }
                {
                  supportsConcatenation && (
                    <ProjectPanelSection
                      customHeadingTag="h4"
                      heading="Combine Data"
                      intro="Select from available operations to combine the data."
                      nested
                    >
                      <Form.Group controlId="input__concatinate-subsetting" className="mb-0">
                        <Form.Check
                          id="input__concatinate-subsetting"
                          type="checkbox"
                          label={
                            (
                              <div>
                                <span className="mb-1 d-block">
                                  Enable Concatenation
                                </span>
                                <span className="mb-1 d-block text-muted">
                                  Data will be concatenated along a newly created dimension
                                </span>
                              </div>
                            )
                          }
                          checked={enableConcatenateDownload}
                          disabled={isRecurring}
                          onChange={this.handleConcatenationSelection}
                        />
                      </Form.Group>
                    </ProjectPanelSection>
                  )
                }
                {
                  supportsTemporalSubsetting && (
                    <ProjectPanelSection
                      customHeadingTag="h4"
                      heading="Temporal Subsetting"
                      intro="When enabled, temporal subsetting will trim the data to the selected temporal range."
                      warning={isRecurring && 'To prevent unexpected results, temporal subsetting is not supported for recurring dates.'}
                      nested
                    >
                      {
                        (startDate || endDate) && (
                          <Form.Group controlId="input__temporal-subsetting" className="mb-0">
                            <Form.Check
                              id="input__temporal-subsetting"
                              type="checkbox"
                              label={
                                (
                                  <span className={`mb-1 d-block ${!enableTemporalSubsetting && 'text-muted'}`}>
                                    Trim output granules to the selected temporal constraint
                                  </span>
                                )
                              }
                              checked={enableTemporalSubsetting}
                              disabled={isRecurring}
                              onChange={this.handleToggleTemporalSubsetting}
                            />
                            {
                              enableTemporalSubsetting && (
                                <p className="access-method__section-status mt-2 mb-0">
                                  Selected Range:
                                  <br />
                                  {selectedTemporalDisplay}
                                </p>
                              )
                            }
                          </Form.Group>
                        )
                      }
                      {
                        !(startDate || endDate) && (
                          <p className="access-method__section-status mb-0">
                            { /* eslint-disable-next-line max-len */}
                            No temporal range selected. Make a temporal selection to enable temporal subsetting.
                          </p>
                        )
                      }
                    </ProjectPanelSection>
                  )
                }
                {
                  (supportsShapefileSubsetting || supportsBoundingBoxSubsetting) && (
                    <ProjectPanelSection
                      customHeadingTag="h4"
                      heading="Spatial Subsetting"
                      intro="When enabled, spatial subsetting will trim the data to the selected area range."
                      nested
                    >
                      {
                        selectedSpatialDisplay
                        && (
                          <Form.Group controlId="input__spatial-subsetting" className="mb-0">
                            <Form.Check
                              id="input__spatial-subsetting"
                              type="checkbox"
                              label={
                                (
                                  <span className={`mb-1 d-block ${(!(enableSpatialSubsetting) && 'text-muted')}`}>
                                    Trim output granules to the selected spatial constraint
                                  </span>
                                )
                              }
                              checked={enableSpatialSubsetting}
                              onChange={this.handleToggleSpatialSubsetting}
                            />
                            {
                              enableSpatialSubsetting && (
                                <p className="access-method__section-status mt-2 mb-0">
                                  Selected Area:
                                  <br />
                                  {selectedSpatialDisplay}
                                </p>
                              )
                            }
                          </Form.Group>
                        )
                      }
                      {
                        !selectedSpatialDisplay && (
                          <p className="access-method__section-status mb-0">
                            { /* eslint-disable-next-line max-len */}
                            No spatial area selected. Make a spatial selection to enable spatial subsetting.
                          </p>
                        )
                      }
                    </ProjectPanelSection>
                  )
                }
                {
                  supportsVariableSubsetting && (
                    <ProjectPanelSection
                      customHeadingTag="h4"
                      heading="Variables"
                      intro="Use science keywords to subset your collection granules by measurements and variables."
                      nested
                    >
                      {
                        !hasVariables ? (
                          <p className="access-method__section-status">
                            No variables available for selected item.
                          </p>
                        ) : (
                          <>
                            <p className="access-method__section-status">
                              {
                                selectedVariables.length > 0
                                  ? `${selectedVariables.length} ${pluralize('variable', selectedVariables.length)} selected`
                                  : 'No variables selected. All variables will be included in download.'
                              }
                            </p>
                            <Button
                              type="button"
                              bootstrapVariant="primary"
                              label="Edit Variables"
                              bootstrapSize="sm"
                              onClick={
                                () => {
                                  onSetActivePanel(`0.${index}.1`)
                                  onTogglePanels(true)
                                }
                              }
                            >
                              Edit Variables
                            </Button>
                          </>
                        )
                      }
                    </ProjectPanelSection>
                  )
                }
                {
                  supportedOutputFormatOptions.length > 0 && (
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
                        data-testid="access-methods__output-format-options"
                      >
                        {
                          [
                            <option key="output-format-none" value="">No Data Conversion</option>,
                            ...supportedOutputFormatOptions
                          ]
                        }
                      </select>
                    </ProjectPanelSection>
                  )
                }
                {
                  supportedOutputProjectionOptions.length > 0 && (
                    <ProjectPanelSection
                      heading="Output Projection Selection"
                      intro="Choose a desired output projection from supported EPSG Codes."
                      nested
                    >
                      <select
                        id="input__output-projection"
                        className="form-control form-control-sm"
                        onChange={this.handleOutputProjectionSelection}
                        value={selectedOutputProjection}
                        data-testid="access-methods__output-projection-options"
                      >
                        {
                          [
                            <option key="output-projection-none" value="">None</option>,
                            ...supportedOutputProjectionOptions
                          ]
                        }
                      </select>
                    </ProjectPanelSection>
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
          {
            supportsSwodlr && (
              <ProjectPanelSection
                customHeadingTag="h4"
                nested
              >
                <Container fluid>
                  <Row>
                    <Col>
                      Granule Extent
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          (
                            <Tooltip style={{ width: '20rem' }}>
                              {swodlrToolTips.GranuleExtent}
                            </Tooltip>
                          )
                        }
                      >
                        <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details-span" />
                      </OverlayTrigger>

                    </Col>
                    <Col>
                      <Form>
                        <div className="mb-3">
                          <Form.Check inline label="128 x 128 km" name="128-by-128" type="radio" id="granule-extent-128-by-128" checked />
                          <Form.Check inline label="256 x 128 km" name="256-by-128" type="radio" id="granule-extent-256-by-128" />
                        </div>
                      </Form>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      Sampling Grid Type
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          (
                            <Tooltip style={{ width: '20rem' }}>
                              {swodlrToolTips.SamplingGridResolution}
                            </Tooltip>
                          )
                        }
                      >
                        <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details-span" />
                      </OverlayTrigger>
                    </Col>
                    <Col>
                      <Form>
                        <div className="mb-3">
                          <Form.Check inline label="UTM" name="UTM" type="radio" id="sample-grid-utm" checked />
                          <Form.Check inline label="LAT/LON" name="latLon" type="radio" id="sample-grid-lat-lon" />
                        </div>
                      </Form>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      Raster Resolution
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          (
                            <Tooltip style={{ width: '20rem' }}>
                              {swodlrToolTips.RasterResolution}
                            </Tooltip>
                          )
                        }
                      >
                        <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details-span" />
                      </OverlayTrigger>
                    </Col>
                    <Col>
                      <Form>
                        <Form.Control as="select" onChange={this.handleSwoldrOptions}>
                          <option value={90}>90 Meters</option>
                          <option value={100}>100 Meters</option>
                          <option value={120}>120 Meters</option>
                          <option value={125}>125 Meters</option>
                          <option value={200}>200 Meters</option>
                          <option value={250}>250 Meters</option>
                          <option value={500}>500 Meters</option>
                          <option value={1000}>1000 Meters</option>
                          <option value={2500}>2500 Meters</option>
                          <option value={5000}>5000 Meters</option>
                          <option value={10000}>10000 Meters</option>
                        </Form.Control>
                      </Form>

                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <Accordion>
                        <Card>
                          <Accordion.Toggle as={Card.Header} eventKey="0">
                            Advanced options
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>
                              <Table striped bordered size="sm" responsive>
                                <thead>
                                  <tr>
                                    <th>Granule</th>
                                    <th>
                                      UTM Zone Adjust
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          (
                                            <Tooltip style={{ width: '20rem' }}>
                                              {swodlrToolTips.UTM}
                                            </Tooltip>
                                          )
                                        }
                                      >
                                        <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details-span" />
                                      </OverlayTrigger>
                                    </th>
                                    <th>
                                      MGRS Band Adjust
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          (
                                            <Tooltip style={{ width: '20rem' }}>
                                              {swodlrToolTips.MGRS}
                                            </Tooltip>
                                          )
                                        }
                                      >
                                        <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details-span" />
                                      </OverlayTrigger>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    metadata && metadata.granules && metadata.granules.items
                                    && metadata.granules.items.map((granule) => (
                                      <tr key={granule.conceptId}>
                                        <td>{granule.conceptId}</td>
                                        <td>
                                          <Form.Check inline label="+1" name={`${granule.conceptId}-plus-1-UTM-zone`} type="radio" id={`${granule.conceptId}-plus-1-UTM-zone`} />
                                          <Form.Check inline label="0" name={`${granule.conceptId}-0-UTM-zone`} type="radio" id={`${granule.conceptId}-0-UTM-zone`} checked />
                                          <Form.Check inline label="-1" name={`${granule.conceptId}-minus-1-UTM-zone`} type="radio" id={`${granule.conceptId}-minus-1-UTM-zone`} />
                                        </td>
                                        <td>
                                          <Form.Check inline label="+1" name={`${granule.conceptId}-plus-1-MGRS-band`} type="radio" id={`${granule.conceptId}-plus-1-MGRS-band`} />
                                          <Form.Check inline label="0" name={`${granule.conceptId}-0-MGRS-band`} type="radio" id={`${granule.conceptId}-0-MGRS-band`} checked />
                                          <Form.Check inline label="-1" name={`${granule.conceptId}-minus-1-MGRS-band`} type="radio" id={`${granule.conceptId}-minus-1-MGRS-band`} />
                                        </td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </Table>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </Col>
                  </Row>
                </Container>
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
  metadata: PropTypes.shape({
    conceptId: PropTypes.string,
    endDate: PropTypes.string,
    startDate: PropTypes.string,
    granules: []
  }),
  onSelectAccessMethod: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func,
  onTogglePanels: PropTypes.func,
  onUpdateAccessMethod: PropTypes.func.isRequired,
  selectedAccessMethod: PropTypes.string,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({
    boundingBox: PropTypes.arrayOf(PropTypes.string),
    circle: PropTypes.arrayOf(PropTypes.string),
    line: PropTypes.arrayOf(PropTypes.string),
    point: PropTypes.arrayOf(PropTypes.string),
    polygon: PropTypes.arrayOf(PropTypes.string)
  }),
  temporal: PropTypes.shape({
    endDate: PropTypes.string,
    isRecurring: PropTypes.bool,
    startDate: PropTypes.string
  }).isRequired,
  ursProfile: PropTypes.shape({
    email_address: PropTypes.string
  }).isRequired
}

export default AccessMethod
