import React from 'react'

const Footer = (props) => (
    <footer id="footer">
        <section className="special">
            <p className="copyright_nomargin">&copy; <a href="https://twitter.com/liran_tal">Liran Tal</a>. Design: <a href="https://html5up.net">HTML5 UP</a>.</p>
        </section>
        <section>
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
        </section>
    </footer>
)

export default Footer
