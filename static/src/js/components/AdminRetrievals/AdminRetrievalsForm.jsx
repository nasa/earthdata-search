import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import Button from '../Button/Button'

export class AdminRetrievalsForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      retrievalId: '',
      userId: ''
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  onBlur(event) {
    event.preventDefault()
  }

  onInputChange({ target }) {
    const { name, value } = target
    this.setState({ [name]: value })
  }

  onFormSubmit(event) {
    event.preventDefault()

    const { userId, retrievalId } = this.state
    const { onAdminViewRetrieval, onFetchAdminRetrievals } = this.props

    if (userId) {
      onFetchAdminRetrievals(userId)
    } else {
      onAdminViewRetrieval(retrievalId)
    }
  }

  render() {
    const { retrievalId, userId } = this.state

    return (
      <Form onSubmit={this.onFormSubmit}>
        <InputGroup className="mb-3">
          <Form.Label
            column
            sm="auto"
            className="me-3"
          >
            Find Retrieval
          </Form.Label>
          <Form.Control
            name="retrievalId"
            placeholder="Obfuscated Retrieval ID"
            value={retrievalId}
            onChange={this.onInputChange}
            onBlur={this.onBlur}
          />

          <Button
            type="button"
            bootstrapVariant="primary"
            label="Go"
            onClick={this.onFormSubmit}
          >
            Go
          </Button>
        </InputGroup>
        <InputGroup>
          <Form.Label
            column
            sm="auto"
            className="me-3"
          >
            Find By User Id
          </Form.Label>
          <Form.Control
            name="userId"
            placeholder="Enter User ID"
            value={userId}
            onChange={this.onInputChange}
            onBlur={this.onBlur}
          />

          <Button
            type="button"
            bootstrapVariant="primary"
            label="Go"
            onClick={this.onFormSubmit}
          >
            Go
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
