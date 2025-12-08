import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'

import AdvancedSearchForm from './AdvancedSearchForm'
import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import RegionSearchResults from './RegionSearchResults'

import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'

import { DISPLAY_NOTIFICATION_TYPE } from '../../constants/displayNotificationType'

import REGIONS from '../../operations/queries/regions'

import useEdscStore from '../../zustand/useEdscStore'
import { isModalOpen, setOpenModalFunction } from '../../zustand/selectors/ui'

import { MODAL_NAMES } from '../../constants/modalNames'

import './AdvancedSearchModal.scss'

const keyboardShortcuts = {
  toggleAdvancedSearchInput: 'a'
}

/**
 * Renders AdvancedSearchModal.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Object} props.fields - The advanced search fields.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.handleSubmit - Callback function provided by Formik.
 * @param {Boolean} props.isValid - Flag provided from Formik
 * @param {Function} props.resetForm - Callback function provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Function} props.validateForm - Callback function provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 */
const AdvancedSearchModal = ({
  errors,
  fields,
  handleBlur,
  handleChange,
  handleSubmit,
  isValid,
  resetForm,
  setFieldTouched,
  setFieldValue,
  touched,
  validateForm,
  values
}) => {
  const handleError = useEdscStore((state) => state.errors.handleError)
  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.ADVANCED_SEARCH))
  const setOpenModal = useEdscStore(setOpenModalFunction)

  const [regionsQuery, { data, loading, error }] = useLazyQuery(REGIONS)

  const { regions: regionsData = {} } = data || {}
  const {
    count,
    keyword,
    regions
  } = regionsData

  // If there is an error fetching results
  useEffect(() => {
    if (error) {
      handleError({
        error,
        action: 'getRegions',
        resource: 'regions',
        notificationType: DISPLAY_NOTIFICATION_TYPE.NONE
      })
    }
  }, [error])

  const handleSearch = (searchValues) => {
    const {
      endpoint,
      exact = false,
      keyword: searchKeyword
    } = searchValues

    regionsQuery({
      variables: {
        endpoint,
        exact,
        keyword: searchKeyword
      }
    })
  }

  const resetAndClose = () => {
    resetForm()
    setOpenModal(null)
  }

  const onApplyClick = (event) => {
    handleSubmit(event)
    setOpenModal(null)
  }

  const onCancelClick = () => {
    resetAndClose()
  }

  const onModalClose = () => {
    resetAndClose()
  }

  const onWindowKeyUp = (event) => {
    const toggleModal = () => setOpenModal(isOpen ? null : MODAL_NAMES.ADVANCED_SEARCH)

    triggerKeyboardShortcut({
      event,
      shortcutKey: keyboardShortcuts.toggleAdvancedSearchInput,
      shortcutCallback: toggleModal
    })
  }

  useEffect(() => {
    window.addEventListener('keyup', onWindowKeyUp)

    return () => {
      window.removeEventListener('keyup', onWindowKeyUp)
    }
  }, [onWindowKeyUp])

  const regionResults = useMemo(() => ({
    count,
    error: error?.message,
    keyword,
    loading,
    regions
  }), [count, error, keyword, loading, regions])

  if (!isOpen) return null

  const regionSearchResultsOverlay = (
    <RegionSearchResults
      regionResults={regionResults}
      setFieldValue={setFieldValue}
    />
  )

  const modalOverlays = {
    regionSearchResults: regionSearchResultsOverlay
  }

  const body = (
    <AdvancedSearchForm
      errors={errors}
      fields={fields}
      handleBlur={handleBlur}
      handleChange={handleChange}
      handleSearch={handleSearch}
      isValid={isValid}
      setFieldTouched={setFieldTouched}
      setFieldValue={setFieldValue}
      touched={touched}
      validateForm={validateForm}
      values={values}
    />
  )

  return (
    <EDSCModalContainer
      className="advanced-search-modal"
      title="Advanced Search"
      isOpen={isOpen}
      id="advanced-search"
      size="lg"
      onClose={onModalClose}
      body={body}
      modalOverlays={modalOverlays}
      primaryAction="Apply"
      primaryActionDisabled={!isValid}
      onPrimaryAction={onApplyClick}
      secondaryAction="Cancel"
      onSecondaryAction={onCancelClick}
    />
  )
}

AdvancedSearchModal.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  errors: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  validateForm: PropTypes.func.isRequired
}

export default AdvancedSearchModal
