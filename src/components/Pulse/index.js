import React from 'react'
import styles from 'styles/main.module.css'

class Pulse extends React.Component {
  render() {
    const { x, y } = this.props
    const style = {
      left: x,
      top: y,
    }

    return <div className={styles.Item} style={style} />
  }
}

export default Pulse
