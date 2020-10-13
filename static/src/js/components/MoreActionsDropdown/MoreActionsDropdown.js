import React from 'react'
import ReactDOM from 'react-dom'
import { PropTypes } from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import classNames from 'classnames'
import MoreActionsToggle from '../CustomToggle/MoreActionsToggle'

export const MoreActionsDropdown = ({
  alignRight,
  children,
  className,
  handoffLinks
}) => {
  const moreActionClasses = classNames(
    className,
    'condensed',
    'more-actions-dropdown'
  )

  // Don't render the dropdown if there are no elements to render
  if (children == null && handoffLinks.length === 0) return null

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={moreActionClasses}
      onClick={e => e.stopPropagation()}
      onKeyPress={e => e.stopPropagation()}
    >
      <Dropdown className="more-actions-dropdown__dropdown">
        <Dropdown.Toggle
          className="more-actions-dropdown__toggle"
          as={MoreActionsToggle}
        />
        {
          ReactDOM.createPortal(
            <Dropdown.Menu
              className="more-actions-dropdown__menu dropdown-menu--carat-right dropdown-menu--condensed"
              alignRight={alignRight}
            >
              {children}
              {
                handoffLinks.length > 0 && (
                  <>
                    <Dropdown.Header>Open collection in:</Dropdown.Header>
                    {
                      handoffLinks.map(link => (
                        <Dropdown.Item
                          key={link.title}
                          className="link link--external more-actions-dropdown__item more-actions-dropdown__vis analytics__smart-handoff-link"
                          href={link.href}
                          target="_blank"
                        >
                          {link.title}
                        </Dropdown.Item>
                      ))
                    }
                  </>
                )
              }
            </Dropdown.Menu>,
            document.getElementById('root')
          )
        }
      </Dropdown>
    </div>
  )
}

MoreActionsDropdown.defaultProps = {
  // TODO: Should default this to false, but need to update styles with respect to the carrot
  alignRight: true,
  children: null,
  className: null,
  handoffLinks: []
}

MoreActionsDropdown.propTypes = {
  alignRight: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  handoffLinks: PropTypes.arrayOf(PropTypes.shape({}))
}

export default MoreActionsDropdown
