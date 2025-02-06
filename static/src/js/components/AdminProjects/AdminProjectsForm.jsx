import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import Button from '../Button/Button'

export class AdminProjectsForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      projectId: ''
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onBlur(event) {
    event.preventDefault()
  }

  onChange({ target }) {
    const { value } = target
    this.setState({ projectId: value })
  }

  onFormSubmit(event) {
    event.preventDefault()

    const { projectId } = this.state
    const { onAdminViewProject } = this.props

    onAdminViewProject(projectId)
  }

  render() {
    const { projectId } = this.state

    return (
      <Form onSubmit={this.onFormSubmit}>
        <InputGroup>
          <Form.Label
            column
            sm="auto"
            className="me-3"
          >
            Find Project
          </Form.Label>
          <Form.Control
            name="projectId"
            placeholder="Obfuscated Project ID"
            value={projectId}
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

AdminProjectsForm.propTypes = {
  onAdminViewProject: PropTypes.func.isRequired
}
