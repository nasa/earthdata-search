import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AdvancedSearchForm from './AdvancedSearchForm'
import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import RegionSearchResults from './RegionSearchResults'

import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'

import './AdvancedSearchModal.scss'

/**
 * Renders AdvancedSearchModal.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.advancedSearch - The collections.
 * @param {Boolean} props.isOpen - The modal state.
 * @param {Object} props.fields - The advanced search fields.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.handleSubmit - Callback function provided by Formik.
 * @param {Boolean} props.isValid - Flag provided from Formik
 * @param {Function} props.onToggleAdvancedSearchModal - Callback function close the modal.
 * @param {Function} props.onChangeRegionQuery - Callback function to update the region search results.
 * @param {Object} props.regionSearchResults - The current region search results.
 * @param {Function} props.resetForm - Callback function provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 */
export class AdvancedSearchModal extends Component {
  constructor(props) {
    super(props)

    this.keyboardShortcuts = {
      toggleAdvancedSearchInput: 'a'
    }

    this.onApplyClick = this.onApplyClick.bind(this)
    this.onCancelClick = this.onCancelClick.bind(this)
    this.onModalClose = this.onModalClose.bind(this)
    this.onWindowKeyUp = this.onWindowKeyUp.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onWindowKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onWindowKeyUp)
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
    this.resetAndClose()
  }

  onModalClose() {
    this.resetAndClose()
  }

  onWindowKeyUp(e) {
    const { keyboardShortcuts } = this

    const {
      onToggleAdvancedSearchModal,
      isOpen
    } = this.props

    const toggleModal = () => onToggleAdvancedSearchModal(!isOpen)

    triggerKeyboardShortcut({
      event: e,
      shortcutKey: keyboardShortcuts.toggleAdvancedSearchInput,
      shortcutCallback: toggleModal
    })
  }

  resetAndClose() {
    const {
      onToggleAdvancedSearchModal,
      resetForm
    } = this.props

    resetForm()
    onToggleAdvancedSearchModal(false)
  }

  render() {
    const {
      advancedSearch,
      fields,
      isOpen,
      errors,
      handleBlur,
      handleChange,
      isValid,
      regionSearchResults,
      setFieldValue,
      setFieldTouched,
      touched,
      values,
      validateForm,
      onChangeRegionQuery
    } = this.props

    const regionSearchResultsOverlay = (
      <RegionSearchResults
        regionSearchResults={regionSearchResults}
        setFieldValue={setFieldValue}
      />
    )

    const modalOverlays = {
      regionSearchResults: regionSearchResultsOverlay
    }

    const body = (
      <AdvancedSearchForm
        advancedSearch={advancedSearch}
        fields={fields}
        errors={errors}
        handleBlur={handleBlur}
        handleChange={handleChange}
        isValid={isValid}
        regionSearchResults={regionSearchResults}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        touched={touched}
        values={values}
        validateForm={validateForm}
        onChangeRegionQuery={onChangeRegionQuery}
      />
    )

    return (
      <EDSCModalContainer
        className="advanced-search-modal"
        title="Advanced Search"
        isOpen={isOpen}
        id="advanced-search"
        size="lg"
        fixedHeight="sm"
        onClose={this.onModalClose}
        body={body}
        modalOverlays={modalOverlays}
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
  advancedSearch: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  errors: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  regionSearchResults: PropTypes.shape({}).isRequired,
  resetForm: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  validateForm: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired,
  onChangeRegionQuery: PropTypes.func.isRequired
}

export default AdvancedSearchModal
