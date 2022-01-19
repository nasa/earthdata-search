/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import { IconContext } from 'react-icons'

/**
 * Renders an icon wrapped with EDSCIcon.
 * @param {String|Function} icon - The `react-icon` or 'edsc-*' icon name to render
 * @param {Node} children - React children to display with the icon.
 * @param {String} className - An optional classname.
 * @param {Object} context - Optional object to pass to `react-icons/IconContext.Provider`
 * @param {String} title - Optional string used as the `title` attribute
 */
export const EDSCIcon = ({
  icon,
  className,
  children,
  context,
  size,
  title,
  ...props
}) => {
  if (!icon) return null

  let iconClassNames = `edsc-icon ${className}`

  if (typeof icon === 'string') {
    iconClassNames = `${iconClassNames} edsc-icon--simple`
    return (
      <i
        className={iconClassNames}
        title={title}
        {...props}
      />
    )
  }

  const Icon = icon

  return (
    <>
      {context ? (
        <IconContext.Provider
          value={context}
        >
          <Icon
            className={iconClassNames}
            title={title}
            size={size}
            {...props}
          />
          {children}
        </IconContext.Provider>
      ) : (
        <>
          <Icon
            className={iconClassNames}
            title={title}
            size={size}
            {...props}
          />
          {children}
        </>
      )}
    </>
  )
}

EDSCIcon.defaultProps = {
  icon: null,
  children: '',
  className: null,
  context: null,
  size: '1rem',
  title: null
}

EDSCIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
  context: PropTypes.shape({}),
  size: PropTypes.string,
  title: PropTypes.string
}

export default EDSCIcon
