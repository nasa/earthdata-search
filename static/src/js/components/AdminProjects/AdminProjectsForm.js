import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Form, InputGroup } from 'react-bootstrap'
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

  onBlur(e) {
    e.preventDefault()
  }

  onChange({ target }) {
    const { value } = target
    this.setState({ projectId: value })
  }

  onFormSubmit(e) {
    e.preventDefault()

    const { projectId } = this.state
    const { onAdminViewProject } = this.props

    onAdminViewProject(projectId)
  }

  render() {
    const { projectId } = this.state

    return (
      <Form onSubmit={this.onFormSubmit}>
        <InputGroup>
          <Form.Label column sm="auto">
            Find Project
          </Form.Label>
          <InputGroup.Prepend>
            <Form.Control
              name="projectId"
              placeholder="Obfuscated Project ID"
              value={projectId}
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

AdminProjectsForm.propTypes = {
  onAdminViewProject: PropTypes.func.isRequired
}
