import React, { Component } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { getValueForTag } from '../../../../../sharedUtils/tags'

import GranuleFiltersList from './GranuleFiltersList'
import GranuleFiltersItem from './GranuleFiltersItem'
import TemporalSelection from '../TemporalSelection/TemporalSelection'

export class GranuleFiltersBody extends Component {
  constructor(props) {
    super(props)
    this.onChangeEndDate = this.onChangeEndDate.bind(this)
    this.onChangeStartDate = this.onChangeStartDate.bind(this)
    this.onChangeFilter = this.onChangeFilter.bind(this)
    this.onChangeCloudCoverMin = this.onChangeCloudCoverMin.bind(this)
    this.onChangeCloudCoverMax = this.onChangeCloudCoverMax.bind(this)
  }

  /**
   * Set a filter prop
   * @param {Object} e - An event object
   */
  onChangeFilter(e, type) {
    const { target } = e
    const { type: elementType } = target
    let { value } = target
    const { onUpdateGranuleFilters } = this.props

    if (elementType === 'checkbox') {
      const { checked } = target
      value = checked ? true : undefined
    }

    onUpdateGranuleFilters({
      [type]: value
    })
  }

  /**
   * Set the startDate prop
   * @param {moment} startDate - The moment object representing the startDate
   */
  onChangeStartDate(startDate) {
    const {
      granuleFilters,
      onUpdateGranuleFilters
    } = this.props

    const { temporal } = granuleFilters

    onUpdateGranuleFilters({
      temporal: {
        ...temporal,
        // eslint-disable-next-line no-underscore-dangle
        startDate: startDate.isValid() ? startDate.toISOString() : startDate._i
      }
    })
  }

  /**
   * Set the endDate prop
   * @param {moment} endDate - The moment object representing the endDate
   */
  onChangeEndDate(endDate) {
    const {
      granuleFilters,
      onUpdateGranuleFilters
    } = this.props

    const { temporal } = granuleFilters

    onUpdateGranuleFilters({
      temporal: {
        ...temporal,
        // eslint-disable-next-line no-underscore-dangle
        endDate: endDate.isValid() ? endDate.toISOString() : endDate._i
      }
    })
  }

  /**
   * Set the dayNightFlag prop
   * @param {Object} event - The change event object
   */
  onChangeDayNightFlag(e) {
    const { value } = e.target
    const { onUpdateGranuleFilters } = this.props

    onUpdateGranuleFilters({
      dayNightFlag: value
    })
  }

  /**
   * Set the cloudCover.min prop
   * @param {Object} e - The event object
   */
  onChangeCloudCoverMin(e) {
    const { value } = e.target
    const {
      granuleFilters,
      onUpdateGranuleFilters
    } = this.props

    const { cloudCover } = granuleFilters

    onUpdateGranuleFilters({
      cloudCover: {
        ...cloudCover,
        min: value
      }
    })
  }

  /**
   * Set the cloudCover.max prop
   * @param {Object} e - The event object
   */
  onChangeCloudCoverMax(e) {
    const { value } = e.target
    const {
      granuleFilters,
      onUpdateGranuleFilters
    } = this.props

    const { cloudCover } = granuleFilters

    onUpdateGranuleFilters({
      cloudCover: {
        ...cloudCover,
        max: value
      }
    })
  }

  render() {
    const {
      granuleFilters,
      metadata
    } = this.props

    const {
      temporal = {},
      dayNightFlag = '',
      browseOnly = false,
      onlineOnly = false,
      cloudCover = {}
    } = granuleFilters

    const {
      min: cloudCoverMin = '',
      max: cloudCoverMax = ''
    } = cloudCover

    const {
      is_cwic: isCwic,
      tags
    } = metadata

    const capabilities = getValueForTag('collection_capabilities', tags)
    // const attributeSearch = getValueForTag('attribute_search', tags, 'edsc.features')
    const attributeSearch = false
    const labs = () => false

    let dayNightCapable
    let cloudCoverCapable

    if (capabilities) {
      dayNightCapable = capabilities.day_night_flag
      cloudCoverCapable = capabilities.cloud_cover
    }

    return (
      <div className="granule-filters-body">
        <Row>
          <Col sm={9}>
            <GranuleFiltersList>
              <GranuleFiltersItem
                heading="Temporal"
              >
                <TemporalSelection
                  controlId="granule-filters__temporal-selection"
                  temporal={temporal}
                  onSubmitStart={value => this.onChangeStartDate(value)}
                  onSubmitEnd={value => this.onChangeEndDate(value)}
                  onValid={this.onValid}
                  onInvalid={this.onInvalid}
                />
              </GranuleFiltersItem>
              {
                !isCwic && (
                  <>
                    {
                      dayNightCapable && (
                        <GranuleFiltersItem
                          heading="Day/Night"
                          description="Find granules captured during the day, night or anytime."
                        >
                          <Row>
                            <Col sm="auto">
                              <Form.Group controlId="granule-filters__day-night-flag">
                                <Form.Control
                                  as="select"
                                  value={dayNightFlag}
                                  onChange={e => this.onChangeFilter(e, 'dayNightFlag')}
                                >
                                  <option value="">Anytime</option>
                                  <option value="DAY">Day</option>
                                  <option value="NIGHT">Night</option>
                                  <option value="BOTH">Both</option>
                                </Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>
                        </GranuleFiltersItem>
                      )
                    }
                    <GranuleFiltersItem
                      heading="Data Access"
                    >
                      <Form.Group controlId="granule-filters__data-access">
                        <Form.Check
                          id="input__browse-only"
                          label="Find only granules that have browse images"
                          checked={browseOnly}
                          onChange={e => this.onChangeFilter(e, 'browseOnly')}
                        />
                        <Form.Check
                          id="input__online-only"
                          label="Find only granules that are available online"
                          checked={onlineOnly}
                          onChange={e => this.onChangeFilter(e, 'onlineOnly')}
                        />
                      </Form.Group>
                    </GranuleFiltersItem>
                    {
                      cloudCoverCapable && (
                        <GranuleFiltersItem
                          heading="Cloud Cover"
                          description="Find granules by cloud cover percentage."
                        >
                          <Form.Group as={Row} controlId="granule-filters__cloud-cover-min">
                            <Form.Label column sm={3}>
                              Minimum
                            </Form.Label>
                            <Col sm={9}>
                              <Form.Control
                                type="text"
                                placeholder="Example: 10"
                                value={cloudCoverMin}
                                onChange={e => this.onChangeCloudCoverMin(e)}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group as={Row} controlId="granule-filters__cloud-cover-max">
                            <Form.Label column sm={3}>
                              Maximum
                            </Form.Label>
                            <Col sm={9}>
                              <Form.Control
                                type="text"
                                placeholder="Example: 50"
                                value={cloudCoverMax}
                                onChange={e => this.onChangeCloudCoverMax(e)}
                              />
                            </Col>
                          </Form.Group>
                          {/* TODO: Vailidation min/max */}
                        </GranuleFiltersItem>
                      )
                    }
                    {
                      (attributeSearch || labs()) && (
                        <GranuleFiltersItem
                          heading="Collection-Specific Attributes"
                        >
                          <GranuleFiltersList>
                            <GranuleFiltersItem
                              heading="ASTERMapProjection"
                              description="The map projection of the granule"
                            >
                              <Row>
                                <Col>
                                  <Form.Group controlId="granule-filters__ASTERMapProjection">
                                    <Form.Control type="text" placeholder="String value" />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </GranuleFiltersItem>
                            <GranuleFiltersItem
                              heading="FlyingDirection"
                              description="The satellite flight direction when observation was performed"
                            >
                              <Row>
                                <Col>
                                  <Form.Group controlId="granule-filters__FlyingDirection">
                                    <Form.Control type="text" placeholder="String value" />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </GranuleFiltersItem>
                          </GranuleFiltersList>
                        </GranuleFiltersItem>
                      )
                    }
                  </>
                )
              }
            </GranuleFiltersList>
          </Col>
        </Row>
      </div>
    )
  }
}

GranuleFiltersBody.propTypes = {
  metadata: PropTypes.shape({}).isRequired,
  granuleFilters: PropTypes.shape({}).isRequired,
  onUpdateGranuleFilters: PropTypes.func.isRequired
}

export default GranuleFiltersBody
