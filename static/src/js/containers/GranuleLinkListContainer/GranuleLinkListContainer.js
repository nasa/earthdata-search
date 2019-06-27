import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import GranuleLinkList from '../../components/GranuleLinkList/GranuleLinkList'

const mapStateToProps = state => ({
  granuleDownload: state.granuleDownload
})

export const GranuleLinkListContainer = ({ granuleDownload = {} }) => (
  <GranuleLinkList
    granuleDownload={granuleDownload}
  />
)

GranuleLinkListContainer.propTypes = {
  granuleDownload: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, null)(GranuleLinkListContainer)
