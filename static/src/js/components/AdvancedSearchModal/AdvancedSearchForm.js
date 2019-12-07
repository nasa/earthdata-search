import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form as FormikForm } from 'formik'
import { Col, Form, Row } from 'react-bootstrap'

// eslint-disable-next-line react/prefer-stateless-function
export class AdvancedSearchForm extends Component {
  render() {
    const {
      fields,
      errors,
      handleBlur,
      handleChange,
      // setFieldValue,
      // setFieldTouched,
      // touched,
      values
    } = this.props
    return (
      <FormikForm className="advanced-search-form">
        {
          fields.map(({
            description,
            name,
            placeholder,
            label,
            text,
            type
          }) => (
            <Row key={name}>
              <Col sm={9}>
                <Form.Group controlId={name}>
                  <Form.Label>
                    {label}
                  </Form.Label>
                  {
                    description && (
                      <p className="text-muted">
                        {description}
                      </p>
                    )
                  }
                  <Form.Control
                    name={name}
                    as={type}
                    value={values[name]}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors[name]}
                  />
                  {
                    text && (
                      <Form.Text className="text-muted">
                        {text}
                      </Form.Text>
                    )
                  }
                  {
                    errors[name] && (
                      <>
                        <Form.Control.Feedback type="invalid">
                          {errors[name]}
                        </Form.Control.Feedback>
                      </>
                    )
                  }
                </Form.Group>
              </Col>
            </Row>
          ))
        }
      </FormikForm>
    )
  }
}

AdvancedSearchForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  errors: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  // setFieldValue: PropTypes.func.isRequired,
  // setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired
}

export default AdvancedSearchForm
