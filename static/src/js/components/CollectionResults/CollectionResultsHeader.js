import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'

import './CollectionResultsHeader.scss'

const CollectionResultsHeader = () => (
  <div className="collection-results-header">
    <Row>
      <Form.Group
        className="collection-results-header__form-group"
        as={Row}
        sm="auto"
      >
        <Form.Label
          className="collection-results-header__label-dropdown"
          htmlFor="input__sort-relevance"
          column
          sm="auto"
        >
          Sort by:
        </Form.Label>
        <Col
          className="collection-results-header__form-column"
          sm="auto"
        >
          <Form.Control
            as="select"
            size="sm"
          >
            <option value="relevance">Relevance</option>
            <option value="usage">Usage</option>
            <option value="end_data">End Date</option>
          </Form.Control>
        </Col>
        <Col
          className="collection-results-header__form-column"
          sm="auto"
        >
          <Form.Check
            defaultChecked
            id="input__only-granules"
            label="Only include collections with granules"
          />
        </Col>
        <Col
          className="collection-results-header__form-column"
          sm="auto"
        >
          <Form.Check
            defaultChecked
            id="input__non-eosdis"
            label="Include non-EOSDIS collections"
          />
        </Col>
      </Form.Group>
    </Row>
    <div className="row">
      <div className="col">
        <span className="collection-results-header__tip">
          <strong className="collection-results-header__tip-label">Tip:</strong>
           Add
          <i className="collection-results-header__tip-icon fa fa-plus" />
           collections to your project to compare and download their data.
        </span>
      </div>
    </div>
  </div>
)

export default CollectionResultsHeader
