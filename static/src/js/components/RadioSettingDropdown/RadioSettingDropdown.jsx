import React, {
  useCallback,
  useEffect,
  useState,
  useRef
} from 'react'
import ReactDOM from 'react-dom'
import { PropTypes } from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
import classNames from 'classnames'

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
  className = null,
  id,
  label,
  settings = []
}) => {
  if (!settings.length) return null

  const toggleRef = useRef(null)
  const menuRef = useRef(null)
  const wrapperRef = useRef(null)

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

  const onWindowMouseMove = useCallback((event) => {
    const elements = [
      wrapperRef.current,
      menuRef.current,
      toggleRef.current
    ]

    // If the toggle is active or focused, check the cursor position to determine
    // if the dropdown should remain open.
    if (dropdownActive) {
      const xPos = event.clientX
      const yPos = event.clientY

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

      return element === event.target || element.contains(event.target)
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

  return (
    <div
      ref={wrapperRef}
      className={radioSettingClasses}
    >
      {/*
        Center the menu under the toggle with Popper's `bottom` placement. Don't give this
        Dropdown a `key` that changes with the label: remounting it while open re-creates the
        portaled menu, which paints at the top left of the page (over the Temporal button)
        before Popper positions it.
      */}
      <Dropdown
        className="radio-setting-dropdown__dropdown"
        drop="down-centered"
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
            >
              {
                settings.length > 0 && settings.map((setting, index) => {
                  const {
                    label: settingLabel,
                    icon,
                    isActive = false,
                    inProgress,
                    onClick
                  } = setting

                  const key = `${settingLabel}_${index}`

                  return (
                    <RadioSettingDropdownItem
                      key={key}
                      title={`${settingLabel}`}
                      onClick={onClick}
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

RadioSettingDropdown.propTypes = {
  activeIcon: PropTypes.func.isRequired,
  className: PropTypes.string,
  settings: PropTypes.arrayOf(PropTypes.shape({})),
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

export default RadioSettingDropdown
