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
    const { form, rawModel } = this.props

    // Initialize the timeline plugin
    this.$el = $(this.el)

    this.initializeEchoForm(form, rawModel)

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

      this.initializeEchoForm(nextForm, nextRawModel)
    }
  }

  componentWillUnmount() {
    this.$el.echoforms('destroy')
  }

  initializeEchoForm(form, rawModel) {
    const echoForm = this.insertModelIntoForm(rawModel, form)

    if (echoForm) this.$el.echoforms({ form: echoForm })

    this.syncModel()
  }

  insertModelIntoForm(rawModel, form) {
    // populate form using rawModel
    if (rawModel) {
      return form.replace(/(?:<instance>)(?:.|\n)*(?:<\/instance>)/, `<instance>\n${rawModel}\n</instance>`)
    }

    return form
  }

  syncModel() {
    const { collectionId, methodKey, onUpdateAccessMethod } = this.props
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
