import React from 'react'
import classNames from 'classnames'

import Pulse from 'components/Pulse'
import styles from 'styles/main.module.css'

class MagicBox extends React.Component {
  constructor(props) {
    super(props)

    const { backgroundColor, highlightText } = this._generateRandColor()

    this.state = {
      containerStyle: {
        backgroundColor,
      },
      textStyle: {
        transform: '',
        left: 0,
        top: 0,
      },
      highlightText,
      pulses: {},
      counter: 0,
      clicked: false,
      pulled: false,
    }
  }

  render() {
    const {
      containerStyle,
      textStyle,
      highlightText,
      pulses,
      clicked,
      pulled,
    } = this.state

    const className = classNames({
      [styles.Container]: true,
      [styles.HighlightText]: highlightText,
    })

    const questMessage =
      pulled && clicked ? `what's next?` : clicked ? `pull me` : `click me`

    return (
      <div
        className={className}
        ref={this._setContainerRef}
        style={containerStyle}
        onMouseLeave={this._onMouseLeave}
        onMouseDown={this._onMouseDown}
        onMouseMove={this._onMouseMove}
        onMouseUp={this._onMouseUp}
        onClick={this._onClick}
      >
        <span className={styles.Text} style={textStyle}>
          {questMessage}
        </span>
        {Object.keys(pulses).map(key => {
          const { x, y } = pulses[key]

          return <Pulse key={key} x={x} y={y} />
        })}
      </div>
    )
  }

  componentWillUnmount() {
    const { pulses } = this.state

    Object.keys(pulses).forEach(key => {
      clearTimeout(pulses[key].disconnect)
    })
  }

  _container = null

  _pulling = {
    on: false,
    x: 0,
    y: 0,
  }

  _setContainerRef = element => {
    this._container = element
  }

  _onMouseDown = ({ pageX, pageY }) => {
    this._pulling.x = pageX
    this._pulling.y = pageY
  }

  _onMouseMove = ({ pageX, pageY, target }) => {
    if (!this._sizes) {
      return
    }

    // offset
    const { x, y } = this._getOffset({ pageX, pageY, target })
    const { width, height } = this._sizes
    const halfWidth = width / 2
    const halfHeight = height / 2
    const deltaX = x > halfWidth ? x - halfWidth : -(halfWidth - x)
    const deltaY = y > halfHeight ? y - halfHeight : -(halfHeight - y)
    const tensionX = deltaX / halfWidth
    const tensionY = deltaY / halfHeight
    const maxDeviationX = 120
    const maxDeviationY = 60
    // scale
    const pullingX = this._pulling.x ? Math.abs(pageX - this._pulling.x) : 0
    const pullingY = this._pulling.y ? Math.abs(pageY - this._pulling.y) : 0
    const scaleX = pullingX ? (pullingX + 64) / 100 : 0
    const scaleY = pullingY ? (pullingY + 64) / 100 : 0

    if (scaleX > 1 || scaleY > 1) {
      this._pulling.on = true
    }

    const transform =
      scaleX > 1 || scaleY > 1
        ? [
            `scale(${scaleX > 1 ? this._ff(scaleX) : 1}, ${
              scaleY > 1 ? this._ff(scaleY) : 1
            })`,
          ].join('')
        : ''

    this.setState({
      textStyle: {
        left: maxDeviationX * tensionX,
        top: maxDeviationY * tensionY,
        transform,
      },
    })
  }

  // fast format float => string ~1.23
  _ff = n =>
    n
      .toString()
      .split('.')
      .map((n, i) => (!i ? n : n.substring(0, 2)))
      .join('.')

  _onMouseUp = () => {
    this._pulling.x = 0
    this._pulling.y = 0
    this.setState({
      textStyle: {
        ...this.state.textStyle,
        transform: '',
      },
    })
  }

  _onClick = ({ pageX, pageY, target }) => {
    if (this._pulling.on) {
      this._pulling.x = 0
      this._pulling.y = 0
      this._pulling.on = false
      this.setState({ pulled: true })
      return
    }

    const offset = this._getOffset({ pageX, pageY, target })
    const { pulses, counter } = this.state

    this._setRandColor()
    this._createPulse({
      ...offset,
      pulses,
      counter,
    })
  }

  _onMouseLeave = event => {
    const { x, y } = this._getOffset(event)
    const { width, height } = this._container.getBoundingClientRect()

    this._pulling.x = 0
    this._pulling.y = 0
    this._pulling.on = false

    if (x < 0 || x > width || y < 0 || y > height) {
      this.setState({
        textStyle: {
          transform: '',
          left: 0,
          top: 0,
        },
      })
    }
  }

  _createPulse({ x, y, pulses, counter }) {
    const increment = counter + 1

    pulses[increment] = {
      disconnect: setTimeout(() => {
        delete pulses[increment]

        this.setState({
          pulses,
        })
      }, 5000),
      x,
      y,
    }

    this.setState({
      clicked: true,
      counter: increment,
      pulses,
    })
  }

  _setRandColor() {
    const { backgroundColor, highlightText } = this._generateRandColor()

    this.setState({
      containerStyle: { backgroundColor },
      highlightText,
    })
  }

  _generateRandColor() {
    const { r, g, b, a } = this._getRandRGBA()
    const opacity = Math.sqrt(a)
    const darkest = this._pow(r) + this._pow(g) + this._pow(b)

    return {
      backgroundColor: `rgba(${r},${g},${b},${opacity})`,
      highlightText: darkest > 123456 && opacity > 0.78,
    }
  }

  _getRandRGBA() {
    return {
      r: this._getRandInt(0, 256),
      g: this._getRandInt(0, 256),
      b: this._getRandInt(0, 256),
      a: this._getRandArbitrary(0, 1),
    }
  }

  _getRandArbitrary(min, max) {
    return Math.random() * (max - min) + min
  }

  _getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  _pow(v) {
    return Math.pow(256 - v, 2)
  }

  _getOffset({ pageX, pageY, target }) {
    return {
      x: pageX - target.offsetLeft,
      y: pageY - target.offsetTop,
    }
  }

  get _sizes() {
    if (!this._container) {
      return null
    }

    const { width, height } = this._container.getBoundingClientRect()

    return {
      width,
      height,
    }
  }
}

export default MagicBox
