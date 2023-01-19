import React, {
  useCallback,
  useEffect,
  useState,
  useRef
} from 'react'
import ReactDOM from 'react-dom'
import { PropTypes } from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import classNames from 'classnames'
import { snakeCase } from 'lodash'

import RadioSettingDropdownItem from './RadioSettingDropdownItem'
import RadioSettingToggle from '../CustomToggle/RadioSettingToggle'

import './RadioSettingDropdown.scss'

/**
 * Renders RadioSettingDropdown.
 * @param {Object} props - The props passed into the component
 * @param {String} props.className - String to use as the classname
 * @param {Node} props.id - A unique id
 * @param {String} props.label - String to use as the classname
 * @param {Array} props.settings - An array of objects to configure the settings.
 */
export const RadioSettingDropdown = ({
  activeIcon,
  className,
  id,
  label,
  settings
}) => {
  if (!settings.length) return null

  const toggleRef = useRef(null)
  const menuRef = useRef(null)
  const wrapperRef = useRef(null)

  const [menuOffsetX, setMenuOffsetX] = useState(0)
  const [dropdownActive, setDropdownActive] = useState(false)

  const radioSettingClasses = classNames(
    className,
    'condensed',
    'radio-setting-dropdown'
  )

  const menuClasses = classNames(
    'radio-setting-dropdown__menu',
    'dropdown-menu--auto-width',
    'dropdown-menu--carat',
    'dropdown-menu--condensed'
  )

  const onWindowMouseMove = useCallback((e) => {
    const elements = [
      wrapperRef.current,
      menuRef.current,
      toggleRef.current
    ]

    // If the toggle is active or focused, check the cursor position to determine
    // if the dropdown should remain open.
    if (dropdownActive) {
      const xPos = e.clientX
      const yPos = e.clientY

      const {
        top: toggleTop,
        bottom: toggleBottom,
        left: toggleLeft,
        right: toggleRight
      } = toggleRef.current.getBoundingClientRect()

      // Check if the cursor is currently within the bounds of the toggle, including
      // a 10px buffer on the bottom edge to account for the gap below the toggle.
      if (
        (xPos >= toggleLeft && xPos <= toggleRight)
        && (yPos >= toggleTop && yPos <= (toggleBottom + 10))
      ) {
        return
      }
    }

    const shouldShowDropdown = elements.some((element) => {
      if (!element) return false

      return element === e.target || element.contains(e.target)
    })

    if (shouldShowDropdown) {
      setDropdownActive(true)
    } else {
      setDropdownActive(false)
    }
  }, [dropdownActive])

  useEffect(() => {
    window.addEventListener('mousemove', onWindowMouseMove)

    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove)
    }
  }, [onWindowMouseMove])

  useEffect(() => {
    // If the dropdown is visible and the refs are defined, calculate and set the offset.
    if (dropdownActive && toggleRef.current && menuRef.current) {
      const toggleWidth = toggleRef.current.clientWidth
      const menuWidth = menuRef.current.clientWidth

      // Calculate the offset as the difference between the widths of the menu and toggle.
      const newOffset = ((menuWidth - toggleWidth) / 2) * -1

      setMenuOffsetX(newOffset)
    }
  }, [dropdownActive, toggleRef.current, menuRef.current, settings])

  return (
    <div
      ref={wrapperRef}
      className={radioSettingClasses}
    >
      <Dropdown
        key={`${menuOffsetX}_${snakeCase(label)}`}
        className="radio-setting-dropdown__dropdown"
        show={dropdownActive}
      >
        <Dropdown.Toggle
          ref={toggleRef}
          id={id}
          data-testid={id}
          className="radio-setting-dropdown__toggle"
          activeIcon={activeIcon}
          as={RadioSettingToggle}
          label={label}
        />
        {
          ReactDOM.createPortal(
            <Dropdown.Menu
              data-testid={`${id}__menu`}
              ref={menuRef}
              className={menuClasses}
              popperConfig={{
                modifiers: [{
                  name: 'offset',
                  options: {
                    offset: [menuOffsetX, 0]
                  }
                }]
              }}
            >
              {
                settings.length > 0 && settings.map((setting, i) => {
                  const {
                    label,
                    icon,
                    isActive = false,
                    inProgress,
                    onClick
                  } = setting

                  const key = `${label}_${i}`
                  return (
                    <RadioSettingDropdownItem
                      key={key}
                      title={`${label}`}
                      onClick={(e) => {
                        onClick()
                        e.stopPropagation()
                      }}
                      icon={icon}
                      isActive={isActive}
                      inProgress={inProgress}
                    />
                  )
                })
              }
            </Dropdown.Menu>,
            document.getElementById('root')
          )
        }
      </Dropdown>
    </div>
  )
}

RadioSettingDropdown.defaultProps = {
  className: null,
  settings: []
}

RadioSettingDropdown.propTypes = {
  activeIcon: PropTypes.func.isRequired,
  className: PropTypes.string,
  settings: PropTypes.arrayOf(PropTypes.shape({})),
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

export default RadioSettingDropdown
