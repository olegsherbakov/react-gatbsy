import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import favicon from '../assets/favicon.ico'
import Header from 'components/header'
import Footer from 'components/footer'

import 'components/index.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Helmet
          titleTemplate={`%s | ${data.site.siteMetadata.title}`}
          defaultTitle={data.site.siteMetadata.title}
          meta={[
            { name: 'Work hard play hard', content: 'Many cunning things' },
            {
              name: 'html css js react gatsby',
              content: 'something good i hope',
            },
          ]}
        >
          <link rel="icon" href={favicon} />
        </Helmet>
        <Header siteTitle={data.site.siteMetadata.title} />
        <div
          style={{
            flex: '1 0 auto',
          }}
        >
          <div
            style={{
              margin: '0 auto',
              maxWidth: 960,
              padding: '0px 1.0875rem',
              paddingTop: 0,
            }}
          >
            {children}
          </div>
        </div>
        <Footer />
      </div>
    )}
  />
)

export default Layout
