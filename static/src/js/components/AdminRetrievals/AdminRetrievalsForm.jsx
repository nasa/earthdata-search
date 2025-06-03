import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import Button from '../Button/Button'

class AdminRetrievalsForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      retrievalId: ''
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onBlur(event) {
    event.preventDefault()
  }

  onChange({ target }) {
    const { value } = target
    this.setState({ retrievalId: value })
  }

  onFormSubmit(event) {
    event.preventDefault()

    const { retrievalId } = this.state
    const { onAdminViewRetrieval } = this.props

    onAdminViewRetrieval(retrievalId)
  }

  render() {
    const { retrievalId } = this.state

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
      </Form>
    )
  }
}

AdminRetrievalsForm.propTypes = {
  onAdminViewRetrieval: PropTypes.func.isRequired
}

export default AdminRetrievalsForm
