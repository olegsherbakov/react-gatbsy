import React from 'react'
import Link from 'gatsby-link'

import Layout from 'components/layout'

const IndexPage = () => (
  <Layout>
    <div>
      <h1>Welcome to my personal home page!</h1>
      <p>Look on some simple examples below:</p>
      <ul>
        <li>
          <Link to="/simple/">Simple example</Link>
        </li>
        <li>
          <Link to="/medium/">More complex example</Link>
        </li>
      </ul>
      <p>See also:</p>
      <ul>
        <li>
          <a href="https://olegsherbakov.github.io/board/">DnD Agile Board (angular, typescript)</a>
        </li>
        <li>
          <a href="https://olegsherbakov.github.io/employees-list/">
            Build dynamic list entries (react, redux)
          </a>
        </li>
        <li>
          <a href="https://olegsherbakov.github.io/jstest/">Simple JS test (vue)</a>
        </li>
      </ul>
    </div>
  </Layout>
)

export default IndexPage
