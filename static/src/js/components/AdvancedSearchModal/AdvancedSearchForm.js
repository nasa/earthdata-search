import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form as FormikForm } from 'formik'
import { Col, Form, Row } from 'react-bootstrap'
import RegionSearch from './RegionSearch'

import './AdvancedSearchForm.scss'

/**
 * Renders AdvancedSearchForm.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.fields - The advanced search fields.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Object} props.regionSearchResults - The current region search results.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setModalOverlay - Sets the modal overlay content
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 * @param {Function} props.onChangeRegionQuery - Callback function to update the region search results.
 */
// eslint-disable-next-line react/prefer-stateless-function
export class AdvancedSearchForm extends Component {
  componentDidMount() {
    const {
      values,
      // eslint-disable-next-line react/prop-types
      validateForm
    } = this.props

    validateForm(values)
  }

  render() {
    const {
      fields,
      errors,
      handleBlur,
      handleChange,
      regionSearchResults,
      setFieldValue,
      setModalOverlay,
      touched,
      values,
      onChangeRegionQuery
    } = this.props

    return (
      <FormikForm className="advanced-search-form">
        {
          fields.map((field) => {
            const {
              description,
              name,
              placeholder,
              label,
              text,
              type
            } = field
            return (
              <div className="advanced-search-form" key={name}>
                <Row>
                  <Col>
                    <Form.Group controlId={name}>
                      <Form.Label className="advanced-search-form__label">
                        {label}
                      </Form.Label>
                      {
                        description && (
                          <p className="text-muted advanced-search-form__description">
                            {description}
                          </p>
                        )
                      }
                      {
                        type === 'input' && (
                          <>
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
                                <Form.Control.Feedback type="invalid">
                                  {errors[name]}
                                </Form.Control.Feedback>
                              )
                            }
                          </>
                        )
                      }
                      {
                        type === 'regionSearch' && (
                          <RegionSearch
                            errors={errors}
                            field={field}
                            values={values}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            regionSearchResults={regionSearchResults}
                            setFieldValue={setFieldValue}
                            setModalOverlay={setModalOverlay}
                            touched={touched}
                            onChangeRegionQuery={onChangeRegionQuery}
                          />
                        )
                      }
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )
          })
        }
      </FormikForm>
    )
  }
}

AdvancedSearchForm.defaultProps = {
  setModalOverlay: null
}

AdvancedSearchForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  errors: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  regionSearchResults: PropTypes.shape({}).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setModalOverlay: PropTypes.func,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  onChangeRegionQuery: PropTypes.func.isRequired
}

export default AdvancedSearchForm
