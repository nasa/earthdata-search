import React, {
  useState,
  useEffect,
  lazy,
  Suspense
} from 'react'
import PropTypes from 'prop-types'
import { Alert, Form } from 'react-bootstrap'
import * as Select from '@radix-ui/react-select'
import * as ScrollArea from '@radix-ui/react-scroll-area'

import { pluralize } from '../../util/pluralize'
import { createSpatialDisplay } from '../../util/createSpatialDisplay'
import { createTemporalDisplay } from '../../util/createTemporalDisplay'
import { ousFormatMapping, harmonyFormatMapping } from '../../../../../sharedUtils/outputFormatMaps'

import AccessMethodRadio from '../FormFields/AccessMethodRadio/AccessMethodRadio'
import Button from '../Button/Button'
import ExternalLink from '../ExternalLink/ExternalLink'
import ProjectPanelSection from '../ProjectPanels/ProjectPanelSection'
import RadioList from '../FormFields/RadioList/RadioList'
import Spinner from '../Spinner/Spinner'
import SwodlrForm from './SwodlrForm'

import { maxSwodlrGranuleCount } from '../../constants/swodlrConstants'

import './AccessMethod.scss'

const EchoForm = lazy(() => import('./EchoForm'))

/**
 * Renders AccessMethod.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.accessMethods - The accessMethods of the current collection.
 * @param {Object} props.granuleMetadata - The metadata for the granules on the collection.
 * @param {Number} props.index - The index of the current collection.
 * @param {Object} props.metadata - The metadata of the current collection.
 * @param {Function} props.onSelectAccessMethod - Selects an access method.
 * @param {Function} props.onSetActivePanel - Switches the currently active panel.
 * @param {Function} props.onUpdateAccessMethod - Updates an access method.
 * @param {Object} props.projectCollection - The project collection.
 * @param {String} props.selectedAccessMethod - The selected access method of the current collection.
 * @param {String} props.shapefileId - The shapefile id of the uploaded shapefile.
*/
const AccessMethod = ({
  accessMethods,
  granuleMetadata,
  index,
  isActive,
  metadata,
  onSelectAccessMethod,
  onSetActivePanel,
  onTogglePanels,
  onUpdateAccessMethod,
  projectCollection,
  selectedAccessMethod,
  shapefileId,
  spatial,
  temporal,
  ursProfile
}) => {
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
    defaultConcatenation = false,
    enableTemporalSubsetting: hasEnabledTemporalSubsetting
  } = selectedMethod || {}

  const { isRecurring } = temporal

  // EnabledTemporalSubsetting by default
  let setTemporal = true

  // If enabledTemporalSubsetting is explicitly false, set the initial value to false
  if (hasEnabledTemporalSubsetting === false) {
    setTemporal = false
  }

  // Initialize State Variables
  const [enableTemporalSubsetting, setEnableTemporalSubsetting] = useState(setTemporal)
  const [enableSpatialSubsetting, setEnableSpatialSubsetting] = useState(false)
  const [enableConcatenateDownload, setEnableConcatenateDownload] = useState(defaultConcatenation)
  const [isHarmony, setIsHarmony] = useState(false)
  const [selectedHarmonyMethodName, setSelectedHarmonyMethodName] = useState('')
  const [granuleList, setGranuleList] = useState([])

  const {
    granules: projectCollectionGranules = {}
  } = projectCollection

  const {
    addedGranuleIds = [],
    allIds: granulesAllIds = []
  } = projectCollectionGranules

  let granulesToDisplay = []

  // If a Harmony selection is made with concatenation service update to be enabled on form mount
  useEffect(() => {
    setEnableConcatenateDownload(defaultConcatenation)
  }, [defaultConcatenation])

  useEffect(() => {
    if (addedGranuleIds.length > 0) {
      granulesToDisplay = addedGranuleIds
    } else {
      granulesToDisplay = granulesAllIds
    }

    // Build the list of granules
    const granuleListObj = granulesToDisplay.map((id) => granuleMetadata[id])
    setGranuleList(granuleListObj)

    // Disable temporal subsetting if the user has a recurring date selected
    if (enableTemporalSubsetting && isRecurring) {
      setEnableTemporalSubsetting(false)
    }

    if (selectedAccessMethod) {
      setIsHarmony(selectedAccessMethod.startsWith('harmony'))
    }

    if (selectedAccessMethod && selectedAccessMethod.startsWith('harmony')
    && accessMethods[selectedAccessMethod].name
    && selectedHarmonyMethodName === '') {
      setSelectedHarmonyMethodName(accessMethods[selectedAccessMethod].name)
    }
  }, [projectCollection])

  const handleHarmonyTypeAccessMethodSelection = () => {
    setIsHarmony(true)

    const { conceptId: collectionId } = metadata

    onSelectAccessMethod({
      collectionId,
      selectedAccessMethod: null
    })

    // Clear the text for the <Select> in step 2
    setSelectedHarmonyMethodName('')
  }

  const handleAccessMethodSelection = (method) => {
    const { conceptId: collectionId } = metadata

    if (!method.includes('harmony')) {
      setIsHarmony(false)
    }

    onSelectAccessMethod({
      collectionId,
      selectedAccessMethod: method
    })
  }

  const handleOutputFormatSelection = (event) => {
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

  const handleOutputProjectionSelection = (event) => {
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

  const handleConcatenationSelection = (event) => {
    const { conceptId: collectionId } = metadata

    const { target } = event
    const { checked } = target

    setEnableConcatenateDownload(checked)

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          enableConcatenateDownload: checked
        }
      }
    })
  }

  const handleToggleTemporalSubsetting = (event) => {
    const { conceptId: collectionId } = metadata

    const { target } = event
    const { checked } = target

    setEnableTemporalSubsetting(checked)

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          enableTemporalSubsetting: checked
        }
      }
    })
  }

  const handleToggleSpatialSubsetting = (event) => {
    const { conceptId: collectionId } = metadata

    const { target } = event
    const { checked } = target

    setEnableSpatialSubsetting(checked)

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          enableSpatialSubsetting: checked
        }
      }
    })
  }

  const handleHarmonySelection = (event, harmonyMethods) => {
    if (event) {
      const setHarmonyMethodVar = harmonyMethods.find(({ methodKey }) => methodKey === event).name
      setSelectedHarmonyMethodName(setHarmonyMethodVar)

      handleAccessMethodSelection(event)
    }
  }

  const renderRadioItem = (radioItem, onPropsChange, selected) => {
    const {
      id,
      methodKey,
      title,
      subtitle,
      description,
      details,
      disabled,
      errorMessage
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
        disabled={disabled}
        errorMessage={errorMessage}
      />
    )
  }

  const getAccessMethodTypes = (hasHarmony, radioList, collectionId) => {
    if (hasHarmony) {
      const id = `${collectionId}_access-method__harmony_type`

      return (
        <>
          <AccessMethodRadio
            key={id}
            id={id}
            value="HarmonyMethodType"
            title="Customize with Harmony"
            description="Select a Harmony service to customize options"
            details="Select options like variables, transformations, and output formats by applying a Harmony service. Data will be staged in the cloud for download and analysis."
            onChange={() => handleHarmonyTypeAccessMethodSelection()}
            checked={isHarmony}
          />

          <RadioList
            defaultValue={selectedAccessMethod}
            onChange={(methodName) => handleAccessMethodSelection(methodName)}
            radioList={radioList}
            renderRadio={renderRadioItem}
          />
        </>
      )
    }

    return (
      <RadioList
        defaultValue={selectedAccessMethod}
        onChange={(methodName) => handleAccessMethodSelection(methodName)}
        radioList={radioList}
        renderRadio={renderRadioItem}
      />
    )
  }

  const createHarmonySelectItem = (radioItem, selected) => {
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

  const createHarmonySelector = (harmonyMethods) => (
    <Select.Root
      name="harmony-method-selector"
      value={selectedHarmonyMethodName}
      onValueChange={(e) => handleHarmonySelection(e, harmonyMethods)}
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
                      (radio) => createHarmonySelectItem(radio, selectedAccessMethod)
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
      supportsConcatenation: hasCombine
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
    let disabled = false
    let errorMessage = ''

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
        disabled = granuleList && granuleList.length > maxSwodlrGranuleCount
        // Update the error message if more than 10 granules are selected
        errorMessage = granuleList && granuleList.length > maxSwodlrGranuleCount ? 'SWODLR customization is only available with a maximum of 10 granules. Reduce your granule selection to enable this option.' : ''
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
          customizationOptions,
          disabled,
          errorMessage
        }
      )
    }
  })

  const radioList = [
    ...accessMethodsByType.OPeNDAP,
    ...accessMethodsByType.ESI,
    ...accessMethodsByType['ECHO ORDERS'],
    ...accessMethodsByType.SWODLR,
    ...accessMethodsByType.download
  ]

  const isOpendap = (selectedAccessMethod && selectedAccessMethod === 'opendap')

  // Harmony access methods are postfixed with an index given that there can be more than one
  // const { isHarmony, selectedHarmonyMethodName } = this.state

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
    endDate = ''
  } = temporal

  // Get spatial and temporal display values
  const selectedTemporalDisplay = createTemporalDisplay(temporal)
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
              : getAccessMethodTypes(
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
            createHarmonySelector(harmonyMethods)
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
                    <ExternalLink href="https://harmony.earthdata.nasa.gov/docs#service-capabilities">
                      Documentation
                    </ExternalLink>
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
                        onChange={handleConcatenationSelection}
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
                            onChange={handleToggleTemporalSubsetting}
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
                          No temporal range selected.
                          Make a temporal selection to enable temporal subsetting.
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
                              onChange={handleToggleSpatialSubsetting}
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
                          No spatial area selected.
                          Make a spatial selection to enable spatial subsetting.
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
                      onChange={handleOutputFormatSelection}
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
                      onChange={handleOutputProjectionSelection}
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
          (supportsSwodlr && granuleList.length <= maxSwodlrGranuleCount) && (
            <SwodlrForm
              granuleList={granuleList}
              collectionId={collectionId}
              onUpdateAccessMethod={onUpdateAccessMethod}
              selectedAccessMethod={selectedAccessMethod}
              setGranuleList={setGranuleList}
            />
          )
        }
      </ProjectPanelSection>
    </div>
  )
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
  spatial: {},
  granuleMetadata: {},
  projectCollection: {
    granules: {}
  }
}

AccessMethod.propTypes = {
  accessMethods: PropTypes.shape({}),
  index: PropTypes.number,
  isActive: PropTypes.bool,
  metadata: PropTypes.shape({
    conceptId: PropTypes.string,
    endDate: PropTypes.string,
    startDate: PropTypes.string
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
  }).isRequired,
  granuleMetadata: PropTypes.shape({}),
  projectCollection: PropTypes.shape({
    granules: PropTypes.shape({})
  })
}

export default AccessMethod
