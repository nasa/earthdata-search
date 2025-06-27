import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import Button from '../Button/Button'

export class AdminRetrievalsForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchType: 'retrievalId',
      searchValue: ''
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onSearchTypeChange = this.onSearchTypeChange.bind(this)
    this.onSearchValueChange = this.onSearchValueChange.bind(this)
  }

  onBlur(event) {
    event.preventDefault()
  }

  onSearchTypeChange({ target }) {
    const { value } = target
    this.setState({
      searchType: value,
      searchValue: ''
    })
  }

  onSearchValueChange({ target }) {
    const { value } = target
    this.setState({ searchValue: value })
  }

  onFormSubmit(event) {
    event.preventDefault()

    const { searchType, searchValue } = this.state
    const { onAdminViewRetrieval, onFetchAdminRetrievals } = this.props

    if (!searchValue.trim()) return

    if (searchType === 'retrievalId') {
      onAdminViewRetrieval(searchValue)
    } else if (searchType === 'userId') {
      onFetchAdminRetrievals(searchValue, undefined)
    } else if (searchType === 'retrievalCollectionId') {
      onFetchAdminRetrievals(undefined, searchValue)
    }
  }

  render() {
    const { searchType, searchValue } = this.state

    return (
      <Form onSubmit={this.onFormSubmit}>
        <InputGroup className="mb-3">
          <Form.Label
            column
            sm="auto"
            className="me-3"
          >
            Search By
          </Form.Label>
          <Form.Select
            value={searchType}
            onChange={this.onSearchTypeChange}
            className="me-3"
            style={
              {
              }
            }
          >
            <option value="retrievalId">Retrieval ID</option>
            <option value="userId">User ID</option>
            <option value="retrievalCollectionId">Retrieval Collection ID</option>
          </Form.Select>
          <Form.Control
            placeholder="Enter value"
            value={searchValue}
            onChange={this.onSearchValueChange}
            onBlur={this.onBlur}
          />
          <Button
            type="submit"
            bootstrapVariant="primary"
            label="Search"
          >
            Search
          </Button>
        </InputGroup>
      </Form>
    )
  }
}

AdminRetrievalsForm.propTypes = {
  onAdminViewRetrieval: PropTypes.func.isRequired,
  onFetchAdminRetrievals: PropTypes.func.isRequired
}
