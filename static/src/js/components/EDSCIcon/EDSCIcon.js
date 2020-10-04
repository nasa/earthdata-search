import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

/**
 * Renders an icon per requested library and icon name.
 * @param {String} [className]
 * @param {String} [library='fa'] The library to target
 * @param {String} icon The full icon name as it exists within the loaded library
 * @param {ReactNodeLike} [children]
 */
export const EDSCIcon = ({
  className,
  library,
  icon,
  children
}) => {
  let IconLoader

  switch (library) { // Lazy load the requested library
    case 'fa':
    default:
      IconLoader = React.lazy(() => import('./FaLoader'))
      break
  }

  return (
    <Suspense fallback={<i />}>
      <IconLoader icon={icon} className={className} />
      {children}
    </Suspense>
  )
}

EDSCIcon.defaultProps = {
  children: null,
  className: null,
  library: 'fa'
}

EDSCIcon.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  library: PropTypes.oneOf(['fa']),
  icon: PropTypes.string.isRequired
}

export default EDSCIcon
