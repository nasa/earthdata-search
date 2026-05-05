import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useMemo,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'

import { AlertMediumPriority } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'

import { pluralize } from '../../util/pluralize'
import { createSpatialDisplay } from '../../util/createSpatialDisplay'
import { createTemporalDisplay } from '../../util/createTemporalDisplay'
import { harmonyFormatMapping, ousFormatMapping } from '../../../../../sharedUtils/outputFormatMaps'

import AccessMethodRadio from '../FormFields/AccessMethodRadio/AccessMethodRadio'
import Button from '../Button/Button'
import EDSCAlert from '../EDSCAlert/EDSCAlert'
import ProjectPanelSection from '../ProjectPanels/ProjectPanelSection'
import RadioList from '../FormFields/RadioList/RadioList'
import Spinner from '../Spinner/Spinner'
import SwodlrForm from './SwodlrForm'

import { maxSwodlrGranuleCount, swoldrMoreInfoPage } from '../../constants/swodlrConstants'

import useEdscStore from '../../zustand/useEdscStore'

import './AccessMethod.scss'

const EchoForm = lazy(() => import('./EchoForm'))

/**
 * Renders AccessMethod.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.accessMethods - The accessMethods of the current collection.
 * @param {Number} props.index - The index of the current collection.
 * @param {Object} props.metadata - The metadata of the current collection.
 * @param {Function} props.onSelectAccessMethod - Selects an access method.
 * @param {Function} props.onUpdateAccessMethod - Updates an access method.
 * @param {Object} props.projectCollection - The project collection.
 * @param {String} props.selectedAccessMethod - The selected access method of the current collection.
 * @param {String} props.spatial - The spatial constraints if applied.
 * @param {String} props.temporal - The temporal constraints if applied.
*/
const AccessMethod = ({
  accessMethods = {},
  index = null,
  isActive = false,
  metadata = {},
  onSelectAccessMethod,
  onUpdateAccessMethod,
  projectCollection = {
    granules: {}
  },
  selectedAccessMethod = null,
  spatial = {},
  temporal
}) => {
  const {
    setActivePanel
  } = useEdscStore((state) => ({
    setActivePanel: state.projectPanels.setActivePanel
  }))

  const { [selectedAccessMethod]: selectedMethod = {} } = accessMethods

  const isLoading = useEdscStore((state) => state.project.collections.isLoading)

  const {
    availableOutputFormats = [],
    form,
    rawModel = null,
    selectedVariables = [],
    selectedOutputFormat = undefined,
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
    enableTemporalSubsetting: isTemporalSubsettingSelected = false,
    enableSpatialSubsetting: isSpatialSubsettingSelected = false,
    enableConcatenateDownload: isConcatenateSelected = defaultConcatenation,
    isTemporalSubsettingDisabled = false,
    isSpatialSubsettingDisabled = false,
    isShapeSubsettingDisabled = false
  } = selectedMethod || {}

  // This does not work currently. It's supposed to disable temporalSubsetting but I dont know why that's needed.
  const { isRecurring } = temporal

  const [isHarmony, setIsHarmony] = useState(false)
  const [granuleList, setGranuleList] = useState([])

  const {
    granules: projectCollectionGranules = {}
  } = projectCollection

  const {
    addedGranuleIds = [],
    allIds: granulesAllIds = [],
    byId: granulesMetadata = {}
  } = projectCollectionGranules

  let granulesToDisplay = []

  useEffect(() => {
    if (addedGranuleIds.length > 0) {
      granulesToDisplay = addedGranuleIds
    } else {
      granulesToDisplay = granulesAllIds
    }

    // Build the list of granules
    const granuleListObj = granulesToDisplay.map((id) => granulesMetadata[id])
    setGranuleList(granuleListObj)

    // Disable temporal subsetting if the user has a recurring date selected
    if (isTemporalSubsettingSelected && isRecurring) {
      onUpdateAccessMethod({
        collectionId: metadata.conceptId,
        method: {
          [selectedAccessMethod]: {
            enableTemporalSubsetting: false
          }
        }
      })
    }

    if (selectedAccessMethod) {
      setIsHarmony(selectedAccessMethod === 'harmony')
    }
  }, [projectCollection])

  const handleCustomizeDownload = () => {
    setIsHarmony(true)

    const { conceptId: collectionId } = metadata

    onSelectAccessMethod({
      collectionId,
      selectedAccessMethod: 'harmony'
    })
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

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          enableSpatialSubsetting: checked
        }
      }
    })
  }

  const renderRadioItem = useCallback((radioItem, onPropsChange, selected) => {
    const {
      description,
      details,
      disabled,
      errorMessage,
      externalLink,
      id,
      isLoading: radioItemIsLoading,
      methodKey,
      subtitle,
      title
    } = radioItem

    return (
      <AccessMethodRadio
        key={id}
        id={id}
        isLoading={radioItemIsLoading}
        value={methodKey}
        title={title}
        subtitle={subtitle}
        description={description}
        details={details}
        onChange={onPropsChange}
        checked={selected === methodKey}
        disabled={disabled}
        errorMessage={errorMessage}
        externalLink={externalLink}
      />
    )
  }, [])

  const getAccessMethodTypes = (hasHarmony, radioList, collectionId) => {
    if (hasHarmony) {
      const id = `${collectionId}_access-method__harmony_type`

      return (
        <>
          <AccessMethodRadio
            externalLink={
              {
                link: 'https://harmony.earthdata.nasa.gov/',
                message: 'What is Harmony?'
              }
            }
            key={id}
            id={id}
            value="HarmonyMethodType"
            title="Customize Download"
            description="Select from the parameters below to customize your download"
            details="Select options like variables, transformations, and output formats by applying parameters. Data will be staged in the cloud for download and analysis."
            onChange={() => handleCustomizeDownload()}
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
    let externalLink = null
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
        // Update the error message if more than 10 granules are selected
        disabled = granuleList && granuleList.length > maxSwodlrGranuleCount
        errorMessage = granuleList && granuleList.length > maxSwodlrGranuleCount ? 'SWODLR customization is only available with a maximum of 10 granules. Reduce your granule selection to enable this option.' : ''
        externalLink = {
          link: swoldrMoreInfoPage,
          message: 'What is SWODLR?'
        }

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
          errorMessage,
          externalLink
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

  // Push isLoading state from zustand to radioItems to enable skeleton loading
  // Push id and other required props for key creation
  if (isLoading && radioList.length === 0) {
    const loadingRadioProps = {
      title: '',
      description: '',
      methodKey: ''
    }

    radioList.push({
      ...loadingRadioProps,
      id: '1',
      isLoading
    })

    radioList.push({
      ...loadingRadioProps,
      id: '2',
      isLoading
    })
  }

  const granuleListUndefined = granuleList[0] === undefined
  const isOpendap = (selectedAccessMethod && selectedAccessMethod === 'opendap')

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
    // The derived harmony state is the source of truth. Options are disabled if they are not part of the availableOutputFormats array
    supportedOutputFormatOptions = supportedOutputFormats.map((format) => {
      const isOptionDisabled = !availableOutputFormats.includes(format)

      // Map options to human readable formats but keep the mime-type for values
      return (
        <option key={format} value={format} disabled={isOptionDisabled}>
          {harmonyFormatMapping[format]}
        </option>
      )
    })

    // Build options for supportedOutputProjections
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

  const nonBoundingBoxSpatialType = ['polygon', 'point', 'line', 'circle'].find((spatialType) => spatial[spatialType] && spatial[spatialType].length > 0)

  const harmonyMbrWarning = useMemo(() => {
    let warning

    // If a service supports bbox but not shape, show this warning
    if (
      (isSpatialSubsettingSelected
      && supportsBoundingBoxSubsetting
      && !supportsShapefileSubsetting
      && nonBoundingBoxSpatialType)
      || (isSpatialSubsettingSelected && isShapeSubsettingDisabled && nonBoundingBoxSpatialType)
    ) {
      warning = `Only bounding boxes are supported. Your ${nonBoundingBoxSpatialType} has been automatically converted into the bounding box shown above and outlined on the map.`
    }

    return warning
  }, [
    isSpatialSubsettingSelected,
    nonBoundingBoxSpatialType,
    spatial,
    isShapeSubsettingDisabled
  ])

  // Get spatial and temporal display values
  const selectedTemporalDisplay = createTemporalDisplay(temporal)
  const selectedSpatialDisplay = createSpatialDisplay(spatial, !!harmonyMbrWarning)

  // Checking to see if the selectedMethod variables exists and has at least one variable
  const hasVariables = selectedMethod.variables
    ? Object.keys(selectedMethod.variables).length > 0
    : false

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
        heading="Customization Options"
        step={2}
        faded={!selectedAccessMethod && !isHarmony}
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
                        spatial={spatial}
                        temporal={temporal}
                        onUpdateAccessMethod={onUpdateAccessMethod}
                      />
                    </Suspense>
                  </ProjectPanelSection>
                )
              }
              {
                // Relay customization limitations
                <div className="access-method__harmony-method-info">
                  {
                    isCustomizationAvailable && (
                      <>
                        <p>
                          Below are the customization options available to you.
                        </p>
                        <EDSCAlert
                          bootstrapVariant="warning"
                          icon={AlertMediumPriority}
                        >
                          Please note that selecting some customization options may lead
                          to others becoming disabled.
                        </EDSCAlert>
                      </>
                    )
                  }
                </div>
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
                        checked={isConcatenateSelected}
                        disabled={isRecurring}
                        onChange={handleConcatenationSelection}
                      />
                    </Form.Group>
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
                    warning={harmonyMbrWarning}
                    faded={isSpatialSubsettingDisabled}
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
                                  <span className={`mb-1 d-block ${(!(isSpatialSubsettingSelected) && 'text-muted')}`}>
                                    Trim output granules to the selected spatial constraint
                                  </span>
                                )
                              }
                              checked={isSpatialSubsettingSelected}
                              onChange={handleToggleSpatialSubsetting}
                              disabled={isSpatialSubsettingDisabled}
                            />
                            {
                              isSpatialSubsettingSelected && (
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
                supportsTemporalSubsetting && (
                  <ProjectPanelSection
                    customHeadingTag="h4"
                    heading="Temporal Subsetting"
                    intro="When enabled, temporal subsetting will trim the data to the selected temporal range."
                    warning={isRecurring && 'To prevent unexpected results, temporal subsetting is not supported for recurring dates.'}
                    nested
                    disabled={isTemporalSubsettingDisabled}
                    faded={isTemporalSubsettingDisabled}
                  >
                    {
                      (startDate || endDate) && (
                        <Form.Group controlId="input__temporal-subsetting" className="mb-0">
                          <Form.Check
                            id="input__temporal-subsetting"
                            type="checkbox"
                            label={
                              (
                                <span className={`mb-1 d-block ${!isTemporalSubsettingSelected && 'text-muted'}`}>
                                  Trim output granules to the selected temporal constraint
                                </span>
                              )
                            }
                            checked={isTemporalSubsettingSelected}
                            disabled={isRecurring || isTemporalSubsettingDisabled}
                            onChange={handleToggleTemporalSubsetting}
                          />
                          {
                            isTemporalSubsettingSelected && (
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
                supportedOutputFormatOptions.length > 0 && (
                  <ProjectPanelSection
                    customHeadingTag="h4"
                    heading="Output Format"
                    intro="Choose from output format options like GeoTIFF, NETCDF, and other file types."
                    nested
                  >
                    <select
                      id="input__output-format"
                      className="form-select form-select-sm"
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
                                setActivePanel(`0.${index}.1`)
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
                supportedOutputProjectionOptions.length > 0 && (
                  <ProjectPanelSection
                    heading="Output Projection Selection"
                    intro="Choose a desired output projection from supported EPSG Codes."
                    nested
                  >
                    <select
                      id="input__output-projection"
                      className="form-select form-select-sm"
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
          (supportsSwodlr
            && granuleList.length <= maxSwodlrGranuleCount
            && !granuleListUndefined) && (
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
  onUpdateAccessMethod: PropTypes.func.isRequired,
  selectedAccessMethod: PropTypes.string,
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
  projectCollection: PropTypes.shape({
    granules: PropTypes.shape({})
  })
}

export default AccessMethod
