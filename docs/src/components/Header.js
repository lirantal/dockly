import React from 'react'

import dockly_animated from '../assets/images/dockly-animation.gif'

const Header = props => (
  <header id="header" className="alt">
    <span>
      $ npm install -g <a href="https://github.com/lirantal/dockly">dockly</a>
    </span>

    <span className="logo">
      <img src={dockly_animated} alt="immersive terminal interface for managing docker containers and services" />
    </span>

    <p className="small">
      immersive terminal interface for managing docker containers and services
    </p>

    <ul className="icons">
      <li>
        <a href="https://twitter.com/liran_tal" className="icon fa-twitter alt">
          <span className="label">Twitter</span>
        </a>
      </li>
      <li>
        <a
          href="https://github.com/lirantal/dockly"
          className="icon fa-github alt"
        >
          <span className="label">GitHub</span>
        </a>
      </li>
    </ul>
  </header>
)

export default Header
