const proxy = require("http-proxy-middleware");

module.exports = {
  siteMetadata: {
    title: "Dependabot",
    siteUrl: `https://dependabot.com`
  },
  developMiddleware: app => {
    app.use(
      "/api/",
      proxy({
        target: "https://api.dependabot.com",
        changeOrigin: true,
        pathRewrite: {
          "^/api/": "/"
        }
      })
    );
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: `${__dirname}/src/blog`
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  url:
                    site.siteMetadata.siteUrl + "/blog" + edge.node.fields.slug,
                  guid:
                    site.siteMetadata.siteUrl + "/blog" + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }]
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/blog/rss.xml"
          }
        ]
      }
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              // defaults to [`png`, `jpg`, `jpeg`, `bmp`, `tiff`]
              ignoreFileExtensions: []
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: ["source sans pro:200,300,400,600,700"]
      }
    },
    {
      resolve: "svgr",
      options: {}
    }
  ]
};
