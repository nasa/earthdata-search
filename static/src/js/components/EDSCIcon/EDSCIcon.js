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
  title
}) => {
  if (!icon) { return (<i />) }

  if (typeof icon === 'string') {
    return (
      <i
        className={className}
        title={title}
      />
    )
  }

  const Icon = icon

  return (
    <>
      {context ? (
        <IconContext.Provider
          key={icon}
          value={context}
        >
          <Icon className={className} style={{ verticalAlign: 'inherit' }} title={title} />
          {children}
        </IconContext.Provider>
      ) : (
        <>
          <Icon key={icon} className={className} style={{ verticalAlign: 'inherit' }} title={title} />
          {children}
        </>
      )}
    </>
  )
}

EDSCIcon.defaultProps = {
  icon: null,
  children: null,
  className: null,
  context: null,
  title: null
}

EDSCIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  context: PropTypes.object,
  title: PropTypes.string
}

export default EDSCIcon
