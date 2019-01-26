import React from 'react'

import { getRows } from './engine'
import styles from './a.module.css'

export default function ASIIBox() {
  return (
    <div className={styles.Container}>
      {getRows().map(s => [s, <br key="br" />])}
    </div>
  )
}
