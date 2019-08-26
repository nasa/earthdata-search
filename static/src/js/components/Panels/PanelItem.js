import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import $ from 'jquery'

import PanelGroupFooter from './PanelGroupFooter'
import Button from '../Button/Button'

import './PanelItem.scss'

/**
 * Renders PanelItem.
 * @param {Object} props - The props passed into the component.
 * @param {Node} props.children - The panel item children.
 * @param {Node} props.footer - The element to be used as the footer.
 * @param {Boolean} props.hideFooter - Hides the PanelGroup footer if one is defined.
 * @param {Boolean} props.isActive -  A flag to desingate the PanelItem as active.
 * @param {Function} props.onChangePanel -  A callback to change the active panel.
 * @param {Object} props.backButtonOptions - The config for the back button. Location is the panel id to switch to. Also accepts custom text for the button.
 */
export class PanelItem extends Component {
  constructor() {
    super()

    this.state = {
      hasScrolled: false
    }

    this.panelItemInnerRef = null

    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    const { panelItemInnerRef } = this
    panelItemInnerRef.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    const { panelItemInnerRef } = this
    panelItemInnerRef.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    const { panelItemInnerRef } = this
    this.setState({
      hasScrolled: $(panelItemInnerRef).scrollTop() > 20
    })
  }

  render() {
    const {
      backButtonOptions,
      children,
      footer,
      hideFooter,
      isActive,
      onChangePanel
    } = this.props

    const {
      hasScrolled
    } = this.state

    let backButton = null

    if (!isEmpty(backButtonOptions)) {
      let backButtonText = 'Back'

      const {
        text,
        location,
        callback
      } = backButtonOptions

      if (text) {
        backButtonText = `Back to ${text}`
      }

      backButton = (
        <Button
          className="panel-item__back-button"
          icon="chevron-left"
          label={backButtonText}
          onClick={() => {
            onChangePanel(location)
            if (callback && typeof callback === 'function') callback()
          }}
        >
          {backButtonText}
        </Button>
      )
    }

    const className = classNames([
      'panel-item',
      {
        'panel-item--is-active': isActive,
        'panel-item--has-back-button': backButton,
        'panel-item--has-scrolled': hasScrolled
      }
    ])

    return (
      <div
        className={className}
      >
        <header className="panel-item__header">
          {backButton}
        </header>
        <div
          className="panel-item__content"
          ref={(panelItemInner) => { this.panelItemInnerRef = panelItemInner }}
        >
          {
            typeof children === 'string' && (
              children
            )
          }
          {
            typeof children !== 'string' && (
              React.cloneElement(children, { isActive })
            )
          }
        </div>
        {
          (footer && !hideFooter) && (
            <PanelGroupFooter
              footer={footer}
            />
          )
        }
      </div>
    )
  }
}

PanelItem.defaultProps = {
  backButtonOptions: null,
  footer: null,
  hideFooter: false,
  isActive: false,
  onChangePanel: null
}

PanelItem.propTypes = {
  backButtonOptions: PropTypes.shape({
    callback: PropTypes.func,
    location: PropTypes.string.isRequired,
    text: PropTypes.string
  }),
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  hideFooter: PropTypes.bool,
  isActive: PropTypes.bool,
  onChangePanel: PropTypes.func
}

export default PanelItem
