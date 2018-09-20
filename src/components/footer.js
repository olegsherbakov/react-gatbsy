import React from 'react'

const Footer = () => (
  <div
    style={{
      backgroundColor: 'ghostwhite',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0.725rem 1.0875rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      Designed by -{' '}
      <a href="mailto:oleg.sherbakov.85@gmail.com">
        oleg.sherbakov.85@gmail.com
      </a>
      <br />
      Github -{' '}
      <a
        href="https://github.com/olegsherbakov"
        target="_blank"
        rel="noopener noreferrer"
      >
        github.com/olegsherbakov
      </a>
    </div>
  </div>
)

export default Footer
