import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import ContactInfo from '../../components/ContactInfo/ContactInfo'

export const mapStateToProps = (state) => ({
  contactInfo: state.contactInfo
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchContactInfo:
    () => dispatch(actions.fetchContactInfo()),
  onUpdateNotificationLevel:
    (level) => dispatch(actions.updateNotificationLevel(level))
})

export class ContactInfoContainer extends Component {
  componentDidMount() {
    const {
      onFetchContactInfo
    } = this.props

    onFetchContactInfo()
  }

  render() {
    const {
      contactInfo,
      onUpdateNotificationLevel
    } = this.props

    return (
      <ContactInfo
        contactInfo={contactInfo}
        onUpdateNotificationLevel={onUpdateNotificationLevel}
      />
    )
  }
}

ContactInfoContainer.propTypes = {
  contactInfo: PropTypes.shape({}).isRequired,
  onFetchContactInfo: PropTypes.func.isRequired,
  onUpdateNotificationLevel: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactInfoContainer)
