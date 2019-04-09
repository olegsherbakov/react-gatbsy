const range = N => Array.apply(null, { length: N }).map(Number.call, Number)
const extract = (i, N) => [Math.floor(i / N), i % N]
const getChar = idx =>
  `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^. `[idx]

export const getRows = ({ N = 88 } = {}) => {
  const matrix = range(N * N).reduce((acc, i) => {
    const coords = extract(i, N)

    if (coords[0] > 6 && coords[0] < 45 && coords[1] > -1 && coords[1] < 89) {
      acc.push(coords)
    }

    return acc
  }, [])
  const rawRays = matrix.map(([row, col]) => ({
    row,
    col,
    x: -0.9105 + col * 0.0065 + row * 0.0057,
    y: -0.1315 + row * -0.0171,
    z: 0.6794 + col * 0.0045 + row * -0.0081,
  }))
  const normsSq = rawRays.map(({ row, col, x, y, z }) => ({
    row,
    col,
    x,
    y,
    z,
    n2: x * x + y * y + z * z,
  }))
  const norms = normsSq.map(({ row, col, x, y, z, n2 }) => ({
    row,
    col,
    x,
    y,
    z,
    n: (1 + n2) / 2.0,
  }))
  const rays = norms.map(({ row, col, x, y, z, n }) => ({
    row,
    col,
    x: x / n,
    y: y / n,
    z: z / n,
  }))
  const initState = rays.map(({ row, col, x, y, z }) => ({
    row,
    col,
    v: 0,
    x,
    y,
    z,
  }))
  const iters = range(14).reduce(
    (acc, i) => {
      const prevState = acc[i]

      const newState = prevState.map(({ row, col, v, x, y, z }) => ({
        row,
        col,
        x,
        y,
        z,
        v:
          v +
          Math.max(
            Math.abs(0.75 + v * x) - 0.3,
            Math.abs(0.75 + v * y) - 0.3,
            Math.abs(-1.06 + v * z) - 0.3,
            -(
              0.28 +
              ((0.75 + v * x) * (0.75 + v * x) +
                (0.75 + v * y) * (0.75 + v * y) +
                (-1.06 + v * z) * (-1.06 + v * z)) /
                0.28
            ) /
              2.0 +
              0.42
          ),
      }))

      acc.push(newState)

      return acc
    },
    [initState]
  )

  const result = iters[14].reduce((acc, cell14, i) => {
    const { col, row, v: v0 } = cell14
    const { v: v1 } = iters[13][i]
    const { v: v2 } = iters[12][i]
    const v = (v0 - v1) / (v1 - v2)
    const idx = Math.round(1 + Math.max(0, Math.min(66, v * 67)))
    const chr = getChar(idx) || ` `

    acc.push({ col, row, v, chr })

    return acc
  }, [])

  return Object.values(
    result.reduce((acc, { col, row, chr }) => {
      if (!acc[row]) {
        acc[row] = []
      } else if (col === 87) {
        acc[row] = acc[row].join(``)
      } else {
        acc[row].push(chr)
      }

      return acc
    }, {})
  )
}
