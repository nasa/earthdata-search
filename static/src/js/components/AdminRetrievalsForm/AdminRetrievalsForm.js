import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TextField from '../FormFields/TextField/TextField'
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

  onChange(field, value) {
    console.log('onChange', field, value)
    this.setState({ retrievalId: value })
  }

  onFormSubmit(e) {
    e.preventDefault()

    const { retrievalId } = this.state
    const { onAdminViewRetrieval } = this.props
    console.log('onFormSubmit', retrievalId)
    onAdminViewRetrieval(retrievalId)
  }

  render() {
    const { retrievalId } = this.state

    return (
      <>
        <form onSubmit={this.onFormSubmit}>
          <TextField
            name="retrievalId"
            placeholder="Obfuscated Retrieval ID"
            value={retrievalId}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <Button
            type="button"
            bootstrapVariant="primary"
            bootstrapSize="sm"
            label="Go"
            onClick={this.onFormSubmit}
          >
            Go
          </Button>
        </form>
      </>
    )
  }
}

AdminRetrievalsForm.propTypes = {
  onAdminViewRetrieval: PropTypes.func.isRequired
}
