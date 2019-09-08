import { slugify } from './util'

export default {
  inject: ['apiDocsDefaults', 'apiDocsKind'],
  computed: {
    defaults () {
      return this.item ? this.item.defaults : {}
    },
    slug () {
      return slugify(this.item.name || '')
    }
  },
  provide () {
    return {
      apiDocsDefaults: {
        ...(this.apiDocsDefaults || {}),
        ...(this.defaults || {})
      },
      apiDocsKind: this.getKind()
    }
  },
  methods: {
    getKind () {
      return this.kind || this.apiDocsKind
    },
    withDefaults (value, key, empty = {}) {
      const kind = this.getKind()
      const kindKey = `${kind}_${key}`

      if (Array.isArray(empty)) {
        return [].concat(
          value || [],
          this.apiDocsDefaults[key] || [],
          this.apiDocsDefaults[kindKey] || []
        )
      } else {
        return {
          ...this.apiDocsDefaults[key],
          ...this.apiDocsDefaults[kindKey],
          ...value
        }
      }
    },

    getDefaults (key, empty = {}) {
      return this.withDefaults(empty, key, empty)
    }
  }
}
