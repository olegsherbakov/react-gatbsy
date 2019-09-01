import React, { useEffect, useRef, useState } from 'react'

import { processor, init } from './utils'
import styles from 'styles/main.module.css'

const size = 600
const fontSize = Math.round(size / 50)
const initState = {
  distance: 1.3,
  alpha: 15,
  beta: 30,
  alphaPrev: 15,
  betaPrev: 30,
  clientX: undefined,
  clientY: undefined,
  isProgress: false,
}

let context

function ASIICubeInteractive() {
  const [state, setState] = useState(initState)
  const refCanvas = useRef()

  useEffect(() => {
    const { current: canvas } = refCanvas

    context = canvas.getContext(`2d`)

    canvas.width = size
    canvas.height = size
    context.font = `${fontSize}px monospace`
    context.fillStyle = `black`

    return init(setState)
  }, [])

  useEffect(() => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    processor(state).map((line, no) =>
      context.fillText(line, 5, 5 + no * fontSize * 1.4)
    )
  }, [state])

  return <canvas ref={refCanvas} className={styles.Canvas} />
}

export default ASIICubeInteractive
