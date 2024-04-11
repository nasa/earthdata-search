import React from 'react'
import PropTypes from 'prop-types'
import { IconContext } from 'react-icons'

import './EDSCIcon.scss'

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
  variant,
  ...props
}) => {
  if (!icon) return null

  let iconClassNames = 'edsc-icon'

  if (variant) iconClassNames = `${iconClassNames} edsc-icon--${variant}`
  if (className) iconClassNames = `${iconClassNames} ${className}`

  if (typeof icon === 'string') {
    iconClassNames = `${iconClassNames} edsc-icon--simple`

    return (
      <i
        className={iconClassNames}
        title={title}
        data-testid="edsc-icon-simple"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    )
  }

  const Icon = icon

  if (context) {
    return (
      <IconContext.Provider
        value={context}
      >
        <Icon
          className={iconClassNames}
          title={title}
          size={size}
          data-testid="edsc-icon"
          {...props}
        />
        {children}
      </IconContext.Provider>
    )
  }

  if (variant === 'details') {
    return (
      <div className="access-method-radio__icons-rightside">
        <Icon
          className={iconClassNames}
          title={title}
          size={size}
          data-testid="edsc-icon-details"
          {...props}
        />
        {children}
      </div>
    )
  }

  return (
    <>
      <Icon
        className={iconClassNames}
        title={title}
        size={size}
        data-testid="edsc-icon"
        {...props}
      />
      {children}
    </>
  )
}

EDSCIcon.defaultProps = {
  icon: null,
  children: '',
  className: null,
  context: null,
  size: '1rem',
  title: null,
  variant: null
}

EDSCIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
  context: PropTypes.shape({}),
  size: PropTypes.string,
  title: PropTypes.string,
  variant: PropTypes.string
}

export default EDSCIcon
