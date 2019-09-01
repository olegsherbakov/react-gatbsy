const fov = 35
const cos = x => Math.cos((x * Math.PI) / 180)
const sin = x => Math.sin((x * Math.PI) / 180)
const tan = x => Math.tan((x * Math.PI) / 180)
const rows = 36
const camPrecision = 2
const pixelSize = tan(fov / 2) / ((rows - 1) / 2)
const colorShift = 0
const gamma = 1
const ascii = `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^. `
const iterations = 15
const vector = ({ distance, alpha, beta }) => ({
  minRow: 3,
  maxRow: 40,
  minCol: 0,
  maxCol: 80 + 9,
  rows: 36 + 7,
  cols: 80 + 10,
  scaleX: 0.6,
  scaleY: 1.5,
  camX: +(distance * cos(alpha) * cos(beta)).toFixed(camPrecision),
  camY: +(distance * sin(beta)).toFixed(camPrecision),
  camZ: +(distance * sin(alpha) * cos(beta)).toFixed(camPrecision),
  ux: -pixelSize * sin(alpha),
  uz: +pixelSize * cos(alpha),
  vx: +pixelSize * cos(alpha) * sin(beta),
  vy: -pixelSize * cos(beta),
  vz: +pixelSize * sin(alpha) * sin(beta),
  x0: -cos(alpha) * cos(beta),
  y0: -sin(beta),
  z0: -sin(alpha) * cos(beta),
})
const sqrt1a = x => (1 + x) / 2
const sqrt1b = x => 0.14 + 1.78 * x
const fun = (x, y, z) =>
  Math.max(
    Math.abs(x) - 0.3,
    Math.abs(y) - 0.3,
    Math.abs(z) - 0.3,
    -sqrt1b(x * x + y * y + z * z) + 0.42
  )
const compute = (c, [nx, ny, nz]) => {
  const I = []
  let dist = 0

  for (let i = 0; i <= iterations; i++) {
    dist += fun(c.camX + nx * dist, c.camY + ny * dist, c.camZ + nz * dist)
    I[i] = dist
  }

  return I
}
const column = (c, row, col) => {
  const x =
    c.x0 +
    (col - c.cols / 2) * c.ux * c.scaleX +
    (row - c.rows / 2) * c.vx * c.scaleY
  const y = c.y0 + (row - c.rows / 2) * c.vy * c.scaleY
  const z =
    c.z0 +
    (col - c.cols / 2) * c.uz * c.scaleX +
    (row - c.rows / 2) * c.vz * c.scaleY
  const n = sqrt1a(x * x + y * y + z * z)
  const I = compute(c, [x / n, y / n, z / n])
  const R0 =
    (I[iterations] - I[iterations - 1]) /
    (I[iterations - 1] - I[iterations - 2])
  const r = Math.min(1, Math.max(0, R0 + colorShift)) ** gamma

  return `${ascii[Math.round(r * (ascii.length - 1))]}`[0]
}
const line = (c, row) => {
  const res = []

  for (let col = c.minCol; col < c.maxCol; col++) {
    res.push(column(c, row, col))
  }

  return res
}
const computeDistance = ({ distance: distancePrev, ...state }, delta) => ({
  ...state,
  distance: Math.max(
    Math.min(distancePrev + (delta > 0 ? 0.1 : -0.1), 2.5),
    0.5
  ),
})
const computePosition = (
  { alphaPrev, betaPrev, clientX, clientY, ...state },
  eventClientX,
  eventClientY
) => ({
  ...state,
  alphaPrev,
  betaPrev,
  clientX,
  clientY,
  alpha: alphaPrev + Math.floor((clientX - eventClientX) / 5),
  beta: betaPrev - Math.floor((clientY - eventClientY) / 5),
})

export const processor = state => {
  const c = vector(state)
  const res = []

  for (let row = c.minRow; row < c.maxRow; row++) {
    res.push(line(c, row).join(``))
  }

  return res
}

export const init = setState => {
  const events = {
    mousewheel: ({ deltaY }) => {
      setState(state => computeDistance(state, deltaY))
    },
    mousemove: ({ clientX, clientY }) => {
      setState(state =>
        state.isProgress ? computePosition(state, clientX, clientY) : state
      )
    },
    mousedown: ({ clientX, clientY }) => {
      setState(state => ({
        ...state,
        isProgress: true,
        alphaPrev: state.alpha,
        betaPrev: state.beta,
        clientX,
        clientY,
      }))
    },
    mouseup: () => {
      setState(state => ({
        ...state,
        isProgress: false,
      }))
    },
  }
  const blur = () => {
    setState(state => ({
      ...state,
      isProgress: false,
    }))
  }

  Object.keys(events).map(event =>
    document.addEventListener(event, events[event])
  )
  window.addEventListener(`blur`, blur)

  return () => {
    Object.keys(events).map(event =>
      document.removeEventListener(event, events[event])
    )
    window.removeEventListener(`blur`, blur)
  }
}
