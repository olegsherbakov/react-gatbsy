const fov = 35
const size = 600
const fontSize = Math.round(size / 50)
const cos = x => Math.cos((x * Math.PI) / 180)
const sin = x => Math.sin((x * Math.PI) / 180)
const tan = x => Math.tan((x * Math.PI) / 180)
const rows = 36
const camPrecision = 2
const pixelSize = tan(fov / 2) / ((rows - 1) / 2)
const colorShift = 0
const gamma = 1
const ascii = `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^. `
const vector = ({ dist, alpha, beta }) => ({
  iters: 15,
  minRow: 3,
  maxRow: 40,
  minCol: 0,
  maxCol: 80 + 9,
  rows: 36 + 7,
  cols: 80 + 10,
  scaleX: 0.6,
  scaleY: 1.5,
  camX: +(dist * cos(alpha) * cos(beta)).toFixed(camPrecision),
  camY: +(dist * sin(beta)).toFixed(camPrecision),
  camZ: +(dist * sin(alpha) * cos(beta)).toFixed(camPrecision),
  ux: -pixelSize * sin(alpha),
  uz: +pixelSize * cos(alpha),
  vx: +pixelSize * cos(alpha) * sin(beta),
  vy: -pixelSize * cos(beta),
  vz: +pixelSize * sin(alpha) * sin(beta),
  x0: -cos(alpha) * cos(beta),
  y0: -sin(beta),
  z0: -sin(alpha) * cos(beta),
})

export const processor = state => {
  const c = vector(state)
  const sqrt1a = x => (1 + x) / 2
  const sqrt1b = x => 0.14 + 1.78 * x
  const fun = 1
    ? (x, y, z) =>
        Math.max(
          Math.abs(x) - 0.3,
          Math.abs(y) - 0.3,
          Math.abs(z) - 0.3,
          -sqrt1b(x * x + y * y + z * z) + 0.42
        )
    : (x, y, z) => Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) - 0.3
  const iterCount = c.iters
  const res = []

  for (let row = c.minRow; row < c.maxRow; row++) {
    const resIter = []

    for (let col = c.minCol; col < c.maxCol; col++) {
      let dist = 0
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
      const [nx, ny, nz] = [x / n, y / n, z / n]
      const I = []
      for (let i = 0; i <= iterCount; i++) {
        dist += fun(c.camX + nx * dist, c.camY + ny * dist, c.camZ + nz * dist)
        I[i] = dist
      }
      const R0 =
        (I[iterCount] - I[iterCount - 1]) /
        (I[iterCount - 1] - I[iterCount - 2])
      const r = Math.min(1, Math.max(0, R0 + colorShift)) ** gamma
      const ch = `${ascii[Math.round(r * (ascii.length - 1))]}`[0]

      resIter.push(ch)
    }

    res.push(resIter.join(``))
  }
  return res
}

export const drawSymbols = (context, symbols) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height)
  symbols.map((line, no) => context.fillText(line, 5, 5 + no * fontSize * 1.4))

  return context.canvas
}

export const prepareContext = canvas => {
  const context = canvas.getContext(`2d`)

  canvas.width = size
  canvas.height = size
  context.font = `${fontSize}px monospace`
  context.fillStyle = `black`

  return context
}
