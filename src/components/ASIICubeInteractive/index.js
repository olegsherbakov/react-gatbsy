import React, { useEffect, useRef, useState } from 'react'

import { processor, drawSymbols, prepareContext } from './utils'
import styles from 'styles/main.module.css'

const initState = {
  dist: 1.3,
  alpha: 15,
  beta: 30,
  isProgress: false,
  shiftX: undefined,
  shiftY: undefined,
}

let context = undefined

function ASIICubeInteractive() {
  const [state, setState] = useState(initState)
  const refCanvas = useRef()

  useEffect(() => {
    const wheelEvent = event => {
      setState(state => {
        const { dist: distPrev } = state
        const dist = Math.max(
          Math.min(event.deltaY > 0 ? distPrev + 0.1 : distPrev - 0.1, 2.5),
          0.5
        )

        return {
          ...state,
          dist,
        }
      })
    }
    const moveEvent = event => {
      setState(state => {
        if (!state.isProgress) {
          return state
        }

        const deltaX = Math.ceil((state.shiftX - event.clientX) / 5)
        const deltaY = Math.ceil((state.shiftY - event.clientY) / 5)
        const alpha = deltaX === 0 ? state.alpha : state.startAlpha + deltaX
        const beta = deltaY === 0 ? state.beta : state.startBeta - deltaY

        return {
          ...state,
          alpha,
          beta,
        }
      })
    }
    const startEvent = ({ clientX, clientY }) => {
      setState(state => ({
        ...state,
        isProgress: true,
        startAlpha: state.alpha,
        startBeta: state.beta,
        shiftX: clientX,
        shiftY: clientY,
      }))
    }

    const endEvent = () => {
      setState(state => ({
        ...state,
        isProgress: false,
      }))
    }

    document.addEventListener(`mousewheel`, wheelEvent)
    document.addEventListener(`mousemove`, moveEvent)
    document.addEventListener(`mousedown`, startEvent)
    document.addEventListener(`mouseup`, endEvent)

    context = prepareContext(refCanvas.current)

    return () => {
      document.removeEventListener(`mousewheel`, wheelEvent)
      document.removeEventListener(`mousemove`, moveEvent)
      document.removeEventListener(`mousedown`, startEvent)
      document.removeEventListener(`mouseup`, endEvent)

      context = undefined
    }
  }, [])

  useEffect(() => {
    drawSymbols(context, processor(state))
  }, [state])

  return <canvas ref={refCanvas} className={styles.Canvas} />
}

export default ASIICubeInteractive
