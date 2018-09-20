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
        short_name: 'features',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#663399',
        orientation: 'portrait',
        display: 'standalone',
        icon: 'src/assets/favicon32.png',
      },
    },
    'gatsby-plugin-offline',
  ]
}
