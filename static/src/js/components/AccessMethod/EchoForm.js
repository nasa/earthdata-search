import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'

import '../../../../../node_modules/edsc-echoforms/dist/jquery.echoforms-full.min'
import './EchoForm.scss'

class EchoForm extends Component {
  constructor(props) {
    super(props)

    this.syncModel = this.syncModel.bind(this)
  }

  componentDidMount() {
    const { form, rawModel, methodKey } = this.props

    // Initialize the timeline plugin
    this.$el = $(this.el)

    this.initializeEchoForm(form, rawModel, methodKey)

    this.$el.on('echoforms:modelchange', this.syncModel)
  }

  componentWillReceiveProps(nextProps) {
    const {
      form,
      methodKey
    } = this.props
    const {
      form: nextForm,
      methodKey: nextMethodKey,
      rawModel: nextRawModel
    } = nextProps

    if (form !== nextForm && methodKey !== nextMethodKey) {
      this.$el.echoforms('destroy')

      this.initializeEchoForm(nextForm, nextRawModel, nextMethodKey)
    }
  }

  componentWillUnmount() {
    this.$el.echoforms('destroy')
  }

  /**
   * Updates the EchoForm with the saved rawModel data, initializes the EchoForm plugin
   * and syncs the new EchoForm model to the redux store
   * @param {String} form EchoForm XML data
   * @param {String} rawModel Non-pruned serialized EchoForm data
   * @param {String} methodKey Redux store access method key, to be passed to syncModel to ensure the correct access method is updated in the store
   */
  initializeEchoForm(form, rawModel, methodKey) {
    const echoForm = this.insertModelIntoForm(rawModel, form)

    if (echoForm) this.$el.echoforms({ form: echoForm })

    this.syncModel(methodKey)
  }

  /**
   * Updates the EchoForm XML with the saved rawModel data
   * @param {String} rawModel Non-Pruned serialized EchoForm data
   * @param {String} form EchoForm XML data
   */
  insertModelIntoForm(rawModel, form) {
    if (rawModel) {
      return form.replace(/(?:<instance>)(?:.|\n)*(?:<\/instance>)/, `<instance>\n${rawModel}\n</instance>`)
    }

    return form
  }

  /**
   * Update the redux store access method with current values from the EchoForm plugin
   * @param {String} key (optional) Redux store access method key. If not provided it will be pulled from current props. This needs to be passed in from componentWillReceiveProps in order to update the new access method
   */
  syncModel(key) {
    let methodKey = key
    const { collectionId, onUpdateAccessMethod } = this.props

    if (typeof methodKey !== 'string') ({ methodKey } = this.props)

    const isValid = this.$el.echoforms('isValid')
    const model = this.$el.echoforms('serialize')
    const rawModel = this.$el.echoforms('serialize', { prune: false })

    onUpdateAccessMethod({
      collectionId,
      method: {
        [methodKey]: {
          isValid,
          model,
          rawModel
        }
      }
    })
  }

  render() {
    return (
      <section className="echoform">
        <div ref={(el) => { this.el = el }} />
      </section>
    )
  }
}

EchoForm.defaultProps = {
  rawModel: null
}

EchoForm.propTypes = {
  collectionId: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  methodKey: PropTypes.string.isRequired,
  rawModel: PropTypes.string,
  onUpdateAccessMethod: PropTypes.func.isRequired
}

export default EchoForm
