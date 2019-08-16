import React from 'react'
import { PropTypes } from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import classNames from 'classnames'
import ToggleMoreActions from '../CustomToggle/MoreActionsToggle'

export const MoreActionsDropdown = ({
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
    <div className={moreActionClasses}>
      <Dropdown className="dropdown--carat-right dropdown--condensed more-actions-dropdown__dropdown">
        <Dropdown.Toggle
          className="more-actions-dropdown__toggle"
          as={ToggleMoreActions}
        />
        <Dropdown.Menu
          className="more-actions-dropdown__menu"
          alignRight
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
                      className="link link--external more-actions-dropdown__item more-actions-dropdown__vis"
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
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

MoreActionsDropdown.defaultProps = {
  children: null,
  className: null,
  handoffLinks: []
}

MoreActionsDropdown.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  handoffLinks: PropTypes.shape({})
}

export default MoreActionsDropdown
