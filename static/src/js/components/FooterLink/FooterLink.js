import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './FooterLink.scss'

/**
 * Render a footer link with the supplied href and title
 * @param {Object} props - The props passed into the component.
 * @param {String} props.href - The href attribute for the link
 * @param {String} props.title - The text displayed as the link
 * @param {Boolean} props.secondary - If true, secondary classes will be applied to the link
 */
export const FooterLink = ({
  href,
  title,
  secondary
}) => {
  const spanClassName = classNames([
    'footer-link__info-bit',
    {
      'footer-link__info-bit--clean footer-link__info-bit--emph': secondary
    }
  ])
  const linkClassName = classNames([
    'footer-link__info-link',
    {
      'footer-link__info-link--underline': secondary
    }
  ])

  return (
    <span className={spanClassName}>
      <a
        className={linkClassName}
        href={href}
      >
        {title}
      </a>
    </span>
  )
}

FooterLink.defaultProps = {
  secondary: false
}

FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  secondary: PropTypes.bool
}
