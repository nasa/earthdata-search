import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AdvancedSearchForm from './AdvancedSearchForm'
import EDSCModal from '../EDSCModal/EDSCModal'

import './AdvancedSearchModal.scss'

export class AdvancedSearchModal extends Component {
  constructor(props) {
    super(props)

    this.onApplyClick = this.onApplyClick.bind(this)
    this.onCancelClick = this.onCancelClick.bind(this)
    this.onModalClose = this.onModalClose.bind(this)
  }

  onApplyClick(e) {
    const {
      handleSubmit,
      onToggleAdvancedSearchModal
    } = this.props

    handleSubmit(e)
    onToggleAdvancedSearchModal(false)
  }

  onCancelClick() {
    const { onToggleAdvancedSearchModal } = this.props
    onToggleAdvancedSearchModal(false)
  }

  onModalClose() {
    const { onToggleAdvancedSearchModal } = this.props
    onToggleAdvancedSearchModal(false)
  }

  render() {
    const {
      fields,
      isOpen,
      errors,
      handleBlur,
      handleChange,
      isValid,
      setFieldValue,
      setFieldTouched,
      touched,
      values
    } = this.props

    const body = (
      <AdvancedSearchForm
        fields={fields}
        errors={errors}
        handleBlur={handleBlur}
        handleChange={handleChange}
        isValid={isValid}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        touched={touched}
        values={values}
      />
    )

    return (
      <EDSCModal
        className="advanced-search-modal"
        title="Advanced Search"
        isOpen={isOpen}
        id="advanced-search"
        size="lg"
        onClose={this.onModalClose}
        body={body}
        primaryAction="Apply"
        primaryActionDisabled={!isValid}
        onPrimaryAction={this.onApplyClick}
        secondaryAction="Cancel"
        onSecondaryAction={this.onCancelClick}
      />
    )
  }
}

AdvancedSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  errors: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default AdvancedSearchModal
