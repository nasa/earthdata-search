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
    this.onChange = this.onChange.bind(this)
    this.onUserIdChange = this.onUserIdChange.bind(this)
  }

  onBlur(event) {
    event.preventDefault()
  }

  onChange({ target }) {
    const { value } = target
    this.setState({ retrievalId: value })
    console.log('value', value)
  }

  // TODO consolidate these into one function if possible
  onUserIdChange({ target }) {
    const { value } = target
    console.log('value', value)
    this.setState({ userId: value })
  }

  onFormSubmit(event) {
    event.preventDefault()

    const { userId, retrievalId } = this.state
    const { onAdminViewRetrieval, onFetchAdminRetrievals } = this.props
    console.log(onFetchAdminRetrievals)
    console.log(userId)
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
        <InputGroup>
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
            onChange={this.onChange}
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
            onChange={this.onUserIdChange}
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
