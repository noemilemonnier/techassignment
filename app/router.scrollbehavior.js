// Vue-router configuration
export default async (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
    // Checks for element 50 times in case nuxt is still pre-rendering part of page.
    const findEl = async (hash, x) => {
      return (
        document.querySelector(hash) ||
        new Promise((resolve, reject) => {
          if (x > 50) {
            return resolve()
          }
          setTimeout(() => {
            resolve(findEl(hash, ++x || 1))
          }, 100)
        })
      )
    }
    if (to.hash) {
      const el = await findEl(to.hash)
      if ('scrollBehavior' in document.documentElement.style) {
        return window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
      } else {
        return window.scrollTo(0, el.offsetTop)
      }
    }
    return { x: 0, y: 0 }
  }