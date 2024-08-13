import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Accordion,
  Card,
  Form,
  Container,
  Row,
  Table,
  OverlayTrigger,
  Tooltip,
  Col
} from 'react-bootstrap'

import { FaQuestionCircle, FaChevronDown } from 'react-icons/fa'

import {
  swodlrToolTips,
  utmRasterOptions,
  geoRasterOptions
} from '../../constants/swodlrConstants'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import ProjectPanelSection from '../ProjectPanels/ProjectPanelSection'

import './SwodlrForm.scss'

/**
 * Renders Swodlr service Form.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.granuleList - The list of selected granules for the current collection.
 * @param {String} props.collectionId - The project collection id.
 * @param {Function} props.onUpdateAccessMethod - Function to update metadata for the currently selected access method.
 * @param {String} props.selectedAccessMethod - The currently selected access method.
 * @param {Function} props.setGranuleList - Function to update the granule list of the parent component.
*/
const SwodlrForm = ({
  granuleList,
  collectionId,
  onUpdateAccessMethod,
  selectedAccessMethod,
  setGranuleList
}) => {
  console.log('🚀 ~ file: SwodlrForm.jsx:45 ~ collectionId:', collectionId)
  console.log('🚀 ~ file: SwodlrForm.jsx:70 ~ granuleList.forEach ~ granuleList:', granuleList)

  if (!collectionId) {
    console.log('The value was null 🛑')
  }

  // TODO somehow react thinks that after the initial update here that this is not false
  const [granuleExtent, setGranuleExtent] = useState(false)
  const [sampleGrid, setSampleGrid] = useState('UTM')
  const [rasterResolution, setRasterResolution] = useState(90)

  // When any key Swodlr parameters are changed, update the accessMethod data
  const handleSwoldrOptions = () => {
    const customParams = {}

    granuleList.forEach((granule) => {
      const { id } = granule
      console.log('🚀 ~ file: SwodlrForm.jsx:62 ~ granuleList.forEach ~ id:', id)
      customParams[id] = {}
      if (sampleGrid === 'UTM') {
        console.log('🚀 ~ file: SwodlrForm.jsx:60 ~ granuleList.forEach ~ sampleGrid:', sampleGrid)
        customParams[id].utmZoneAdjust = granule.utmZoneAdjust ? granule.utmZoneAdjust : 0
        customParams[id].mgrsBandAdjust = granule.mgrsBandAdjust ? granule.mgrsBandAdjust : 0
      } else {
        customParams[id].utmZoneAdjust = null
        customParams[id].mgrsBandAdjust = null
      }
    })

    console.log('🚀 ~ file: SwodlrForm.jsx:83 ~ handleSwoldrOptions ~ granuleExtent:', granuleExtent)

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          swodlrData: {
            params: {
              rasterResolution,
              outputSamplingGridType: sampleGrid,
              outputGranuleExtentFlag: granuleExtent
            },
            custom_params: customParams
          }
        }
      }
    })
  }

  // Update the MGRSBand and UTMZone of the granule at the given index point
  const handleCollectionGranuleListUpdate = (indexVal, property, e) => {
    console.log('🚀 ~ file: SwodlrForm.jsx:104 ~ handleCollectionGranuleListUpdate ~ e:', e)

    const granuleListCopy = granuleList

    if (property === 'utm') {
      granuleListCopy[indexVal].utmZoneAdjust = Number(e.target.value)
    }

    if (property === 'mgrs') {
      granuleListCopy[indexVal].mgrsBandAdjust = Number(e.target.value)
    }

    setGranuleList(granuleList)
    // TODO Does this need to be called here
    handleSwoldrOptions()
  }

  // Update the Raster Resolution of the granule at the given index point
  const handleRasterResolutionUpdate = (event) => {
    setRasterResolution(Number(event.target.value))
    // HandleSwoldrOptions()
  }

  // Update when the value for Sample Grid type is changed
  const handleSampleGrid = (type) => {
    setSampleGrid(type)
    let defaultRasterValue
    if (type === 'GEO') {
      defaultRasterValue = 3
    } else {
      defaultRasterValue = 90
    }

    setRasterResolution(defaultRasterValue)
    // HandleSwoldrOptions()
  }

  const handleGranuleExtent = (updatedGranuleExtent) => {
    console.log('🚀 ~ file: SwodlrForm.jsx:120 ~ handleGranuleExtent ~ updatedGranuleExtent:', updatedGranuleExtent)
    setGranuleExtent(updatedGranuleExtent)
    // HandleSwoldrOptions()
  }

  // When any of the key values in relation to the Swodlr access method is changed, handle the values and update
  useEffect(() => {
    // TODO consider removing this function and instead just putting the login in the use-effect for clarity
    handleSwoldrOptions()
  }, [granuleExtent, sampleGrid, rasterResolution])
  // TODO so if the granuleList is in the dep arr then too many re-renderings
  // GranuleExtent, granuleList, rasterResolution, sampleGrid

  return (
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
                  <Tooltip className="swodlr-tooltip">
                    {swodlrToolTips.GranuleExtent}
                  </Tooltip>
                )
              }
            >
              <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details-span" />
            </OverlayTrigger>
          </Col>
          <Col>
            <Form.Group>
              <div className="mb-3">
                <Form.Check
                  inline
                  label="128 x 128 km"
                  name="granuleExtent"
                  type="radio"
                  id="granule-extent-128-by-128"
                  checked={!granuleExtent}
                  onChange={
                    () => {
                      handleGranuleExtent(false)
                    }

                  }
                />
                <Form.Check
                  inline
                  label="256 x 128 km"
                  name="granuleExtent"
                  type="radio"
                  id="granule-extent-256-by-128"
                  checked={granuleExtent}
                  onChange={
                    () => {
                      handleGranuleExtent(true)
                    }
                  }
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            Sampling Grid Type
            <OverlayTrigger
              placement="top"
              overlay={
                (
                  <Tooltip className="swodlr-tooltip">
                    {swodlrToolTips.SamplingGridResolution}
                  </Tooltip>
                )
              }
            >
              <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details-span" />
            </OverlayTrigger>
          </Col>
          <Col>
            <Form.Group>
              <div className="mb-3">
                <Form.Check
                  inline
                  label="UTM"
                  name="sample-grid"
                  type="radio"
                  id="sample-grid-utm"
                  checked={sampleGrid === 'UTM'}
                  onChange={
                    () => {
                      handleSampleGrid('UTM')
                    }
                  }
                />
                <Form.Check
                  inline
                  label="LAT/LON"
                  name="sample-grid"
                  type="radio"
                  id="sample-grid-lat-lon"
                  checked={sampleGrid === 'GEO'}
                  onChange={
                    () => {
                      handleSampleGrid('GEO')
                    }
                  }
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            Raster Resolution
            <OverlayTrigger
              placement="top"
              overlay={
                (
                  <Tooltip className="swodlr-tooltip">
                    {swodlrToolTips.RasterResolution}
                  </Tooltip>
                )
              }
            >
              <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details-span" />
            </OverlayTrigger>
          </Col>
          <Col>
            <Form.Group>
              <Form.Control
                as="select"
                onChange={handleRasterResolutionUpdate}
                aria-label="rasterResolutionSelection"
                value={rasterResolution}
              >
                {
                  // Raster Resolution Dropdown
                  sampleGrid === 'GEO'
                    ? geoRasterOptions.map((option) => (
                      <option value={option.value} key={option.value} aria-label={`geo-raster-selection-${option.value}`}>
                        {option.title}
                      </option>
                    ))
                    : utmRasterOptions.map((option) => (
                      <option value={option.value} key={option.value} aria-label={`utm-raster-selection-${option.value}`}>
                        {option.title}
                      </option>
                    ))
                }
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row hidden={sampleGrid !== 'UTM'}>
          <Col>
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  <div data-testid="advancedOptionsToggle" className="swodlr-advanced-options-container">
                    <div className="swodlr-advanced-options-item">
                      Advanced options
                    </div>
                    <EDSCIcon icon={FaChevronDown} className="swodlr-advanced-options-icon" />
                  </div>
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
                                  <Tooltip className="swodlr-tooltip">
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
                                  <Tooltip className="swodlr-tooltip">
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
                          // UTM Zone Adjust and MGRS Band Adjust Form
                          granuleList && granuleList.map((granule, i) => (
                            <tr key={granule.id}>
                              <td>{granule.id}</td>
                              <td className="nowrap">
                                <Form.Check
                                  inline
                                  label="+1"
                                  name={`${granule.id}-UTM-zone`}
                                  type="radio"
                                  aria-label={`${granule.id}-plus-1-UTM-zone`}
                                  value={1}
                                  onChange={
                                    (e) => {
                                      handleCollectionGranuleListUpdate(i, 'utm', e)
                                    }
                                  }
                                />
                                <Form.Check
                                  inline
                                  label="0"
                                  name={`${granule.id}-UTM-zone`}
                                  type="radio"
                                  aria-label={`${granule.id}-0-UTM-zone`}
                                  value={0}
                                  defaultChecked
                                  onChange={
                                    (e) => {
                                      handleCollectionGranuleListUpdate(i, 'utm', e)
                                    }
                                  }
                                />
                                <Form.Check
                                  inline
                                  label="-1"
                                  name={`${granule.id}-UTM-zone`}
                                  type="radio"
                                  aria-label={`${granule.id}-minus-1-UTM-zone`}
                                  value={-1}
                                  onChange={
                                    (e) => {
                                      handleCollectionGranuleListUpdate(i, 'utm', e)
                                    }
                                  }
                                />
                              </td>
                              <td className="nowrap">
                                <Form.Check
                                  inline
                                  label="+1"
                                  name={`${granule.id}-MGRS-band`}
                                  type="radio"
                                  aria-label={`${granule.id}-plus-1-MGRS-band`}
                                  value={1}
                                  onChange={
                                    (e) => {
                                      handleCollectionGranuleListUpdate(i, 'mgrs', e)
                                    }
                                  }
                                />
                                <Form.Check
                                  inline
                                  label="0"
                                  name={`${granule.id}-MGRS-band`}
                                  type="radio"
                                  aria-label={`${granule.id}-0-MGRS-band`}
                                  value={0}
                                  defaultChecked
                                  onChange={
                                    (e) => {
                                      handleCollectionGranuleListUpdate(i, 'mgrs', e)
                                    }
                                  }
                                />
                                <Form.Check
                                  inline
                                  label="-1"
                                  name={`${granule.id}-MGRS-band`}
                                  type="radio"
                                  aria-label={`${granule.id}-minus-1-MGRS-band`}
                                  value={-1}
                                  onChange={
                                    (e) => {
                                      handleCollectionGranuleListUpdate(i, 'mgrs', e)
                                    }
                                  }
                                />
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

SwodlrForm.propTypes = {
  onUpdateAccessMethod: PropTypes.func.isRequired,
  selectedAccessMethod: PropTypes.string.isRequired,
  setGranuleList: PropTypes.func.isRequired,
  collectionId: PropTypes.string,
  granuleList: PropTypes.arrayOf(PropTypes.shape({
    utmZoneAdjust: PropTypes.number,
    mgrsBandAdjust: PropTypes.number
  })).isRequired
}

// TODO AccessMethod does not have this field as required which we are getting sometimes it does not have it before rendering
// Therefore the Swodlr form cannot guarantee when it tries to render it will have the collectionId
SwodlrForm.defaultProps = {
  collectionId: {}
}

export default SwodlrForm
