import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Form, InputGroup } from 'react-bootstrap'
import Button from '../Button/Button'

export class AdminRetrievalsForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      retrievalId: ''
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onBlur(e) {
    e.preventDefault()
  }

  onChange({ target }) {
    const { value } = target
    this.setState({ retrievalId: value })
  }

  onFormSubmit(e) {
    e.preventDefault()

    const { retrievalId } = this.state
    const { onAdminViewRetrieval } = this.props

    onAdminViewRetrieval(retrievalId)
  }

  render() {
    const { retrievalId } = this.state

    return (
      <Form onSubmit={this.onFormSubmit}>
        <InputGroup>
          <Form.Label column sm="auto">
            Find Retrieval
          </Form.Label>
          <InputGroup.Prepend>
            <Form.Control
              name="retrievalId"
              placeholder="Obfuscated Retrieval ID"
              value={retrievalId}
              onChange={this.onChange}
              onBlur={this.onBlur}
            />
          </InputGroup.Prepend>
          <InputGroup.Append>
            <Button
              type="button"
              bootstrapVariant="primary"
              label="Go"
              onClick={this.onFormSubmit}
            >
              Go
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    )
  }
}

AdminRetrievalsForm.propTypes = {
  onAdminViewRetrieval: PropTypes.func.isRequired
}
