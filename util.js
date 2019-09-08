/* global API_DOCS */

const slugifyText = require('slugify')

export function slugify (text) {
  return slugifyText(text.toLowerCase())
}

export const isInterface = value => typeof value === 'object' && (value.kind === 'interface' || value.kind === 'literal')

export const joinElements = delim => (accu, elem) => accu === null ? [elem] : [...accu, delim, elem]

export function getUrl (path) {
  const [type, member] = path.split('.')
  if (API_DOCS.types && API_DOCS.types[type]) {
    return API_DOCS.types[type]
  }

  for (const page of this.$site.pages) {
    if (page.frontmatter.docs) {
      if (page.frontmatter.docs.name === type) {
        if (member) {
          for (const key of ['types', 'functions', 'properties']) {
            if (page.frontmatter.docs[key]) {
              for (const t of page.frontmatter.docs[key]) {
                if (t.name === member) {
                  return page.regularPath + '#' + slugify(member)
                }
              }
            }
          }
        } else {
          return page.regularPath
        }
      }
    }
  }
}
