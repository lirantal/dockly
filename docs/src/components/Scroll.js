import smoothscroll from 'smoothscroll-polyfill';
import React from 'react';
import PropTypes from 'prop-types';

const Element = (props) => { return ( props.children ); };

class Scroll extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        element: PropTypes.string,
        offset: PropTypes.number,
        timeout: PropTypes.number,
        children: PropTypes.node.isRequired
    }
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        smoothscroll.polyfill();
    }
    handleClick(e) {
        e.preventDefault();
        let elem = 0;
        let scroll = true;
        const { type, element, offset, timeout } = this.props;
        if (type && element) {
            switch (type) {
                case 'class':
                    elem = document.getElementsByClassName(element)[0];
                    scroll = elem ? true : false;
                    break;
                case 'id':
                    elem = document.getElementById(element);
                    scroll = elem ? true : false;
                    break;
                default:
            }
        }
        scroll ? ( this.scrollTo(elem, offset, timeout) ) : console.log(`Element not found: ${element}`); // eslint-disable-line
    }
    scrollTo(element, offSet = 0, timeout = null) {
        const elemPos = element ? element.getBoundingClientRect().top + window.pageYOffset : 0;
        if (timeout) {
            setTimeout(() => { window.scroll({ top: elemPos + offSet, left: 0, behavior: 'smooth' }); }, timeout);
        } else {
            window.scroll({ top: elemPos + offSet, left: 0, behavior: 'smooth' });
        }
    }
    render() {
        return (
            <Element>
                {typeof(this.props.children) === 'object' ? (
                    React.cloneElement(this.props.children, { onClick: this.handleClick })
                ) : (
                    <span onClick={this.handleClick}>{this.props.children}</span>
                )}
            </Element>
        );
    }
}

export default Scroll;