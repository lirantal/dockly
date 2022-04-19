import React from 'react'
import Helmet from 'react-helmet'
import Waypoint from 'react-waypoint'

import Layout from '../components/layout'
import Header from '../components/Header'
import featured_image from '../assets/images/dockly-featured-image.png'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stickyNav: false,
    }
  }

  _handleWaypointEnter = () => {
    this.setState(() => ({ stickyNav: false }))
  }

  _handleWaypointLeave = () => {
    this.setState(() => ({ stickyNav: true }))
  }

  render() {
    return (
      <Layout>
        <Helmet>
          <title>
            dockly - immersive terminal interface for managing docker containers
            and services
          </title>
          <meta property="og:title" content="dockly" />
          <meta property="og:description" content="immersive terminal interface for managing docker containers and services" />
          <meta property="og:image" content={featured_image} />
          <meta property="og:url" content="https://lirantal.github.io/dockly" />
          <meta property="og:type" content="article" />
          <meta property="og:locale" content="en_US" />
          <meta name="twitter:title" content="dockly" />
          <meta name="twitter:description" content="immersive terminal interface for managing docker containers and services" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={featured_image} />
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charset="utf-8"
          ></script>
          <script async src="https://cdn.splitbee.io/sb.js"></script>
        </Helmet>

        <Header />

        <Waypoint
          onEnter={this._handleWaypointEnter}
          onLeave={this._handleWaypointLeave}
        ></Waypoint>
        {/* <Nav sticky={this.state.stickyNav} /> */}

        <div id="main">
          <section id="intro" className="main special">
            <header className="major">
              <h2>A Node.js CLI application made with <span role="img" aria-label="heart">💚</span></h2>
              <p></p>
            </header>
            <ul className="statistics">
              <li className="style1">
                <span className="icon fa-code-fork"></span>
                <strong>+2200</strong> GitHub stars
              </li>
              <li className="style2">
                <span className="icon fa-folder-open-o"></span>
                <strong>+90</strong> GitHub forks
              </li>
              <li className="style3">
                <span className="icon fa-signal"></span>
                <strong>+17,000</strong> npm downloads
              </li>
              <li className="style4">
                <span className="icon fa-laptop"></span>
                <strong>100,000+</strong> Docker image pulls
              </li>
            </ul>

            <p>
              with dockly you don't need to leave the cli, <br /> or remember
              all
              <code>docker</code> commands and option flags.
            </p>

            <ul className="actions">
              <li>
                <a href="https://github.com/lirantal/dockly" className="button">
                  $ npm install -g dockly
                </a>
              </li>
            </ul>
          </section>

          <section id="first" className="main special">
            <header className="major">
              <h2>Features</h2>
            </header>
            <ul className="features">
              <li>
                <span className="icon major style1 fa-code"></span>
                <h3>Logs</h3>
                <p>
                  Stream log output of all running docker containers straight in
                  the log box, scroll up and down as necessary
                </p>
              </li>
              <li>
                <span className="icon major style3 fa-copy"></span>
                <h3>Swarm? no worries!</h3>
                <p>
                  Toggle the view between your local running containers and
                  docker swarm mode
                </p>
              </li>
              <li>
                <span className="icon major style5 fa-diamond"></span>
                <h3>You bash much?</h3>
                <p>
                  Do you need to open a bash session into a running container?
                  No need to remember the container id and execute a docker
                  command. Simply press <code>l</code> on one of the containers
                  in the list and dockly will create a new bash session for you
                  <span role="img" aria-label="ok">👌</span>
                </p>
              </li>
            </ul>
          </section>
          <section id="cta" className="main special">
            <header className="major">
              <h2>From twitter</h2>
            </header>
            <span className="tweets">
              <blockquote className="twitter-tweet">
                <p lang="en" dir="ltr">
                  If you&#39;re working with
                  <a href="https://twitter.com/hashtag/Docker?src=hash&amp;ref_src=twsrc%5Etfw">
                    #Docker
                  </a>
                  , do yourself a favour and checkout
                  <a href="https://twitter.com/liran_tal?ref_src=twsrc%5Etfw">
                    @liran_tal
                  </a>
                  dockly
                  <a href="https://t.co/bARXLJIyDI">https://t.co/bARXLJIyDI</a>
                  <a href="https://t.co/dbeS9ibFaI">
                    pic.twitter.com/dbeS9ibFaI
                  </a>
                </p>
                &mdash; Kim Carter (@binarymist)
                <a href="https://twitter.com/binarymist/status/993219107347664897?ref_src=twsrc%5Etfw">
                  May 6, 2018
                </a>
              </blockquote>
            </span>

            <span className="tweets">
              <blockquote className="twitter-tweet">
                <p lang="en" dir="ltr">
                  dockly - Docker console UI and Dashboard for quick managing
                  and inspecting of Containers and Images{' '}
                  <a href="https://t.co/srYANGYFMw">https://t.co/srYANGYFMw</a>{' '}
                  <a href="https://t.co/cMROa7INNP">
                    pic.twitter.com/cMROa7INNP
                  </a>
                </p>
                &mdash; Alexander Reelsen (@spinscale){' '}
                <a href="https://twitter.com/spinscale/status/960829429562912768?ref_src=twsrc%5Etfw">
                  February 6, 2018
                </a>
              </blockquote>
            </span>

            <span className="tweets">
              <blockquote className="twitter-tweet">
                <a href="https://twitter.com/elijahmanor/status/1124380634653310976?ref_src=twsrc%5Etfw">
                  May 3, 2019
                </a>
              </blockquote>
            </span>

            <span className="tweets">
              <blockquote className="twitter-tweet">
                <a href="https://twitter.com/liran_tal/status/1039876482754113538?ref_src=twsrc%5Etfw">
                  September 12, 2018
                </a>
              </blockquote>
            </span>

            <span className="tweets">
              <blockquote className="twitter-tweet">
                <a href="https://twitter.com/francoisz/status/1034079869020319746?ref_src=twsrc%5Etfw">
                  August 27, 2018
                </a>
              </blockquote>
            </span>

            <span className="tweets">
              <blockquote className="twitter-tweet">
                <a href="https://twitter.com/utos/status/1025033727129346049?ref_src=twsrc%5Etfw">
                  August 2, 2018
                </a>
              </blockquote>
            </span>

            <span className="tweets">
              <blockquote className="twitter-tweet">
                <a href="https://twitter.com/linuxtoday/status/1131894875153084416?ref_src=twsrc%5Etfw">
                  May 24, 2019
                </a>
              </blockquote>
            </span>

            <span className="tweets">
              <blockquote className="twitter-tweet">
                <a href="https://twitter.com/waxzce/status/1123886351924043777?ref_src=twsrc%5Etfw">
                  May 2, 2019
                </a>
              </blockquote>
            </span>

            <span className="tweets">
              <blockquote className="twitter-tweet">
                <a href="https://twitter.com/hasdid/status/1124399986303746048?ref_src=twsrc%5Etfw">
                  May 3, 2019
                </a>
              </blockquote>
            </span>

            <span className="tweets">
              <blockquote className="twitter-tweet">
                <a href="https://twitter.com/opexxx/status/1122942042643021825?ref_src=twsrc%5Etfw">
                  April 29, 2019
                </a>
              </blockquote>
            </span>
          </section>
        </div>
      </Layout>
    )
  }
}

export default Index
