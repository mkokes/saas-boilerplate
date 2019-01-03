/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

exports.onRouteUpdate = ({ location }) => {
  if (location.hash) {
    setTimeout(() => {
      const name = location.hash.replace(/^#/, '')
      const target = document.querySelector(`[name="${name}"`)
      if (target) {
        target.scrollIntoView()
      }
    }, 0)
  }
}

exports.shouldUpdateScroll = () => !window.location.hash
