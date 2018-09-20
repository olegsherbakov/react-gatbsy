module.exports = {
  siteMetadata: {
    title: 'Testing a new front features.',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Testing a new front features.',
        short_name: 'Test feature',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/assets/favicon32.png',
      },
    },
    'gatsby-plugin-offline',
  ]
}
