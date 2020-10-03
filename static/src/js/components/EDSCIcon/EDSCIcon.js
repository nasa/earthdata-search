import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

export const EDSCIcon = ({
  className,
  library,
  icon,
  children
}) => {
  let IconLoader

  switch (library) {
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
