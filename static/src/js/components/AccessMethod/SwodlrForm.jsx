import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import Tooltip from 'react-bootstrap/Tooltip'

import { FaQuestionCircle } from 'react-icons/fa'

import {
  swodlrToolTips,
  utmRasterOptions,
  geoRasterOptions
} from '../../constants/swodlrConstants'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import CollapsePanel from '../CollapsePanel/CollapsePanel'
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
  const [granuleExtent, setGranuleExtent] = useState(false)
  const [sampleGrid, setSampleGrid] = useState('UTM')
  const [rasterResolution, setRasterResolution] = useState(90)
  const [rasterResolutionUnit, setRasterResolutionUnit] = useState('meters')

  // When any key Swodlr parameters are changed, update the accessMethod data
  const handleSwoldrOptions = () => {
    const customParams = {}

    // The first element is undefined
    granuleList.forEach((granule) => {
      const { id } = granule
      customParams[id] = {}
      if (sampleGrid === 'UTM') {
        customParams[id].utmZoneAdjust = granule.utmZoneAdjust ? granule.utmZoneAdjust : 0
        customParams[id].mgrsBandAdjust = granule.mgrsBandAdjust ? granule.mgrsBandAdjust : 0
      } else {
        customParams[id].utmZoneAdjust = null
        customParams[id].mgrsBandAdjust = null
      }
    })

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
    const granuleListCopy = granuleList

    if (property === 'utm') {
      granuleListCopy[indexVal].utmZoneAdjust = Number(e.target.value)
    }

    if (property === 'mgrs') {
      granuleListCopy[indexVal].mgrsBandAdjust = Number(e.target.value)
    }

    setGranuleList(granuleList)
    // This is needed if there are only changes to the granuleList we need to pick them up
    handleSwoldrOptions()
  }

  // Update the Raster Resolution of the granule at the given index point
  const handleRasterResolutionUpdate = (event) => {
    setRasterResolution(Number(event.target.value))
  }

  // Update when the value for Sample Grid type is changed
  const handleSampleGrid = (type) => {
    setSampleGrid(type)
    let defaultRasterValue
    if (type === 'GEO') {
      defaultRasterValue = 3
      // Update the units in accordance with the sample grid type
      setRasterResolutionUnit('arc-seconds')
    } else {
      setRasterResolutionUnit('meters')
      defaultRasterValue = 90
    }

    setRasterResolution(defaultRasterValue)
  }

  // Update when the value for Granule Extent is changed
  const handleGranuleExtent = (updatedGranuleExtent) => {
    setGranuleExtent(updatedGranuleExtent)
  }

  // When any of the key values in relation to the Swodlr access method is changed, handle the values and update
  useEffect(() => {
    handleSwoldrOptions()
  }, [granuleExtent, sampleGrid, rasterResolution])

  return (
    <ProjectPanelSection
      customHeadingTag="h4"
      nested
    >
      <Container className="p-0" fluid>
        <Row className="mb-2">
          <Form.Label className="d-flex align-items-center" column sm="5">
            Granule Extent
            <OverlayTrigger
              placement="top"
              overlay={
                (
                  <Tooltip className="tooltip--ta-left tooltip--wide">
                    {swodlrToolTips.GranuleExtent}
                  </Tooltip>
                )
              }
            >
              <EDSCIcon icon={FaQuestionCircle} size="12px" variant="more-info" />
            </OverlayTrigger>
          </Form.Label>
          <Col className="d-flex align-items-center" sm="7">
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
          </Col>
        </Row>
        <Row className="mb-2">
          <Form.Label className="d-flex align-items-center" column sm="5">
            Sampling Grid Type
            <OverlayTrigger
              placement="top"
              overlay={
                (
                  <Tooltip className="tooltip--ta-left tooltip--wide">
                    {swodlrToolTips.SamplingGridResolution}
                  </Tooltip>
                )
              }
            >
              <EDSCIcon icon={FaQuestionCircle} size="12px" variant="more-info" />
            </OverlayTrigger>
          </Form.Label>
          <Col className="d-flex align-items-center" sm="7">
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
          </Col>
        </Row>
        <Row className="mb-2">
          <Form.Label className="d-flex align-items-center" column sm="5">
            Raster Resolution
            <OverlayTrigger
              placement="top"
              overlay={
                (
                  <Tooltip className="tooltip--ta-left tooltip--wide">
                    {swodlrToolTips.RasterResolution}
                  </Tooltip>
                )
              }
            >
              <EDSCIcon icon={FaQuestionCircle} size="12px" variant="more-info" />
            </OverlayTrigger>
          </Form.Label>
          <Col className="d-flex align-items-center" sm="7">
            <Form.Select
              className="me-2"
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
            </Form.Select>
            {rasterResolutionUnit}
          </Col>
        </Row>
        <Row hidden={sampleGrid !== 'UTM'}>
          <Col>
            <Accordion>
              <Card>
                <CollapsePanel
                  header="Advanced Options"
                  className="swodlr-form__advanced-options-item"
                >
                  <Card.Body className="swodlr-form__card-body">
                    <Table className="table--small mt-3" striped bordered size="sm">
                      <thead>
                        <tr>
                          <th className="swodlr-form__table-th">
                            Granule
                          </th>
                          <th className="swodlr-form__table-th">
                            UTM Zone Adjust
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                (
                                  <Tooltip className="tooltip--ta-left tooltip--wide">
                                    {swodlrToolTips.UTM}
                                  </Tooltip>
                                )
                              }
                            >
                              <EDSCIcon icon={FaQuestionCircle} className="swodlr-form__info-icon" size="12px" variant="more-info" />
                            </OverlayTrigger>
                          </th>
                          <th className="swodlr-form__table-th">
                            MGRS Band Adjust
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                (
                                  <Tooltip className="tooltip--ta-left tooltip--wide">
                                    {swodlrToolTips.MGRS}
                                  </Tooltip>
                                )
                              }
                            >
                              <EDSCIcon icon={FaQuestionCircle} className="swodlr-form__info-icon" size="12px" variant="more-info" />
                            </OverlayTrigger>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          // UTM Zone Adjust and MGRS Band Adjust Form
                          granuleList && granuleList.map(({ id, title }, i) => (
                            <tr key={id}>
                              <td className="swodlr-form__table-td-granule-id">{title}</td>
                              <td className="swodlr-form__table-td">
                                <div>
                                  <Form.Check
                                    inline
                                    className="text-align-right"
                                    label="+1"
                                    name={`${id}-UTM-zone`}
                                    type="radio"
                                    aria-label={`${id}-plus-1-UTM-zone`}
                                    value={1}
                                    onChange={
                                      (e) => {
                                        handleCollectionGranuleListUpdate(i, 'utm', e)
                                      }
                                    }
                                  />
                                  <Form.Check
                                    inline
                                    className="text-align-right"
                                    label="0"
                                    name={`${id}-UTM-zone`}
                                    type="radio"
                                    aria-label={`${id}-0-UTM-zone`}
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
                                    className="text-align-right"
                                    label="-1"
                                    name={`${id}-UTM-zone`}
                                    type="radio"
                                    aria-label={`${id}-minus-1-UTM-zone`}
                                    value={-1}
                                    onChange={
                                      (e) => {
                                        handleCollectionGranuleListUpdate(i, 'utm', e)
                                      }
                                    }
                                  />
                                </div>
                              </td>
                              <td className="swodlr-form__table-td">
                                <Form.Check
                                  inline
                                  label="+1"
                                  name={`${id}-MGRS-band`}
                                  type="radio"
                                  aria-label={`${id}-plus-1-MGRS-band`}
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
                                  name={`${id}-MGRS-band`}
                                  type="radio"
                                  aria-label={`${id}-0-MGRS-band`}
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
                                  name={`${id}-MGRS-band`}
                                  type="radio"
                                  aria-label={`${id}-minus-1-MGRS-band`}
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
                </CollapsePanel>
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
  // Metadata default prop is {} in parent
  collectionId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({})
  ]),
  granuleList: PropTypes.arrayOf(PropTypes.shape({
    utmZoneAdjust: PropTypes.number,
    mgrsBandAdjust: PropTypes.number
  })).isRequired
}

SwodlrForm.defaultProps = {
  collectionId: {}
}

export default SwodlrForm
