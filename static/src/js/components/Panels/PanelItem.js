import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import $ from 'jquery'
import { FaChevronLeft } from 'react-icons/fa'

import SimpleBar from 'simplebar-react'

import PanelGroupFooter from './PanelGroupFooter'
import Button from '../Button/Button'

import './PanelItem.scss'

/**
 * Renders PanelItem.
 * @param {Object} props - The props passed into the component.
 * @param {Node} props.children - The panel item children.
 * @param {Node} props.header - Replaces the header contents.
 * @param {Node} props.secondaryHeader - Replaces the secondaryHeader contents.
 * @param {Node} props.meta - The header meta children components.
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

    this.panelItemRef = null
    this.scrollableNodeRef = React.createRef()

    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    const { panelItemRef } = this
    const panelInner = panelItemRef.querySelector('.simplebar-content-wrapper')
    if (panelInner) panelInner.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    const { panelItemRef } = this
    const panelInner = panelItemRef.querySelector('.simplebar-content-wrapper')
    if (panelInner) panelInner.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    const { panelItemRef } = this
    const panelInner = panelItemRef.querySelector('.simplebar-content-wrapper')
    this.setState({
      hasScrolled: $(panelInner).scrollTop() > 20
    })
  }

  render() {
    const {
      backButtonOptions,
      children,
      footer,
      header,
      hideFooter,
      isActive,
      onChangePanel,
      scrollable
    } = this.props

    const {
      hasScrolled
    } = this.state

    let backButton = null

    if (!isEmpty(backButtonOptions)) {
      let backButtonText = 'Back'

      const {
        callback,
        location,
        text
      } = backButtonOptions

      if (text) {
        backButtonText = `Back to ${text}`
      }

      backButton = (
        <Button
          className="panel-item__back-button"
          icon={FaChevronLeft}
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
        'panel-item--has-back-button': backButton,
        'panel-item--has-header': header || backButton,
        'panel-item--has-scrolled': hasScrolled,
        'panel-item--is-active': isActive
      }
    ])

    const renderChildren = () => {
      const contents = (
        <>
          {
            typeof children === 'string' && children
          }
          {
            typeof children !== 'string' && (
              React.cloneElement(children, {
                isActive,
                panelScrollableNodeRef: this.scrollableNodeRef
              })
            )
          }
        </>
      )

      if (scrollable) {
        return (
          <SimpleBar
            className="panel-item__content"
            scrollableNodeProps={{
              className: 'panel-item__simplebar-content',
              ref: this.scrollableNodeRef
            }}
          >
            {contents}
          </SimpleBar>
        )
      }

      return (
        <div className="panel-item__content">
          {contents}
        </div>
      )
    }

    return (
      <div
        className={className}
        ref={(panelItem) => {
          this.panelItemRef = panelItem
        }}
      >
        {
          (header || backButton) && (
            <header className="panel-item__header">
              {header && <div className="panel-item__header-body">{header}</div>}
              {backButton && (
                <div className="panel-item__header-nav">{backButton}</div>
              )}
            </header>
          )
        }
        { renderChildren() }
        {footer && !hideFooter && <PanelGroupFooter footer={footer} />}
      </div>
    )
  }
}

PanelItem.defaultProps = {
  backButtonOptions: null,
  footer: null,
  header: null,
  hideFooter: false,
  isActive: false,
  onChangePanel: null,
  scrollable: true
}

PanelItem.propTypes = {
  backButtonOptions: PropTypes.shape({
    callback: PropTypes.func,
    location: PropTypes.string.isRequired,
    text: PropTypes.string
  }),
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  header: PropTypes.node,
  hideFooter: PropTypes.bool,
  isActive: PropTypes.bool,
  onChangePanel: PropTypes.func,
  scrollable: PropTypes.bool
}

export default PanelItem
