import React, {
  memo,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import ButtonToggle from '../CustomToggle/ButtonToggle'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './ButtonDropdown.scss'

/**
 * A button that toggles a custom react-bootstrap dropdown
 */
export const ButtonDropdown = memo(({
  buttonLabel,
  buttonContent,
  children,
  className,
  disabled,
  open
}) => {
  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    setIsOpen(isOpen)
  }, [isOpen])

  /**
   * Called when a user clicks on the dropdown element
   */
  const onDropdownToggle = (() => {
    setIsOpen(!isOpen)
  })

  const classnames = classNames([
    'button-dropdown',
    className
  ])

  return (
    <Dropdown show={isOpen} className={classnames} onToggle={onDropdownToggle}>
      <Dropdown.Toggle
        className="button-dropdown__toggle"
        id="download-selection-dropdown"
        as={ButtonToggle}
        onClick={onDropdownToggle}
        label={buttonLabel}
        disabled={disabled}
      >
        {buttonContent}
        &nbsp;
        {
          isOpen
            ? <EDSCIcon icon={FaChevronUp} data-testid="dropdown-open" />
            : <EDSCIcon icon={FaChevronDown} data-testid="dropdown-closed" />
        }
      </Dropdown.Toggle>
      <Dropdown.Menu className="button-dropdown__menu">
        {children}
      </Dropdown.Menu>
    </Dropdown>
  )
})

ButtonDropdown.displayName = 'ButtonDropdown'

ButtonDropdown.defaultProps = {
  children: null,
  className: null,
  disabled: false,
  open: false
}

ButtonDropdown.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  buttonContent: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  open: PropTypes.bool
}

export default ButtonDropdown
