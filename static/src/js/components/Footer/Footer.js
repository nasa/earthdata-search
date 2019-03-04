import React, { Component } from 'react'

import './Footer.scss'

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <footer className="footer">
        <span className="footer__info footer__info--left">
          <span className="footer__ver-pill">v Research</span>
          <span className="footer__info-bit footer__info-bit--emph">Search Time: 1ms</span>
          <span className="footer__info-bit footer__info-bit--emph">NASA Official: Stephen Barrick</span>
          <span className="footer__info-bit">
            <a className="footer__info-link" href="http://www.nasa.gov/FOIA/index.html">FOIA</a>
          </span>
          <span className="footer__info-bit">
            <a className="footer__info-link" href="http://www.nasa.gov/about/highlights/HP_Privacy.html">NASA Privacy Policy</a>
          </span>
          <span className="footer__info-bit">
            <a className="footer__info-link" href="http://www.usa.gov">USA.gov</a>
          </span>
        </span>
        <span className="footer__info footer__info--right">
          <span className="footer__info-bit footer__info-bit--clean footer__info-bit--emph">
            <a className="footer__info-link footer__info-link--underline" href="https://access.earthdata.nasa.gov/">
              Earthdata Access: A Section 508 accessible alternative
            </a>
          </span>
        </span>
      </footer>
    )
  }
}

export default Footer
