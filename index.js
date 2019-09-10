const path = require('path')
const slugifyText = require('slugify')

function slugify (text) {
  return slugifyText(text.toLowerCase())
}

const collectHeaders = (section, array) => (
  array && array.length > 0
    ? [{
      title: section,
      slug: slugify(section),
      level: 2
    }].concat(array.map(i => ({
      title: i.name,
      slug: slugify(i.name),
      level: 3
    })))
    : []
)

module.exports = (options = {}, context) => {
  const parseMarkdown = obj => {
    if (!obj) return

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && key === 'desc') {
        obj.desc_md = value
        obj[key] = context.markdown.render(value).html
      } else if (typeof value === 'object') {
        parseMarkdown(value)
      }
    }

    return obj
  }

  return {
    name: 'api-docs',

    chainWebpack: (config) => {
      config.resolveLoader
        .modules
        .add(path.join(__dirname, 'node_modules'))
    },

    extendPageData (page) {
      if (page.frontmatter.docs) {
        page.frontmatter.docs.name = page.frontmatter.docs.name || page.title
        parseMarkdown(page.frontmatter.docs)
        page.frontmatter.pageClass = 'api-page'

        const brand = (...sections) => {
          sections.forEach(s => {
            if (s) s.forEach(v => (v.source = page.frontmatter.docs.name))
          })
        }

        const { types, functions, properties } = page.frontmatter.docs

        brand(types, functions, properties)

        page.headers = [].concat(
          ...[
            ['Properties', properties],
            ['Static Functions', functions && functions.filter(f => f.static)],
            ['Instance Methods', functions && functions.filter(f => !f.static)],
            ['Types', types]
          ].map(([section, array]) => collectHeaders(section, array))
        ).concat(page.headers)
      }
    },

    additionalPages () {
      if (options.api) {
        return options.api.map(member => ({
          path: `/api/${member.urlPath || slugifyText(member.name)}.html`,
          content: `---\n${JSON.stringify({ docs: member, title: member.name })}\n---\n<ApiDocs />`
        }))
      }

      return []
    },

    define: {
      API_DOCS: {
        emptyType: 'any',
        ...options,
        api: {}
      }
    },

    plugins: [
      [
        '@vuepress/register-components',
        {
          componentsDir: path.join(__dirname, 'global-components')
        }
      ]
    ]
  }
}
