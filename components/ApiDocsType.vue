<script>
import ApiKindMethod from './kinds/ApiKindMethod'
import ApiDocsTypeText from './ApiDocsTypeText'
import ApiKindProperty from './kinds/ApiKindProperty'
import ApiKindType from './kinds/ApiKindType'
import apiMixin from '../apiMixin'
import { isInterface } from '../util'

const KINDS = {
  function: ApiKindMethod,
  property: ApiKindProperty,
  text: ApiDocsTypeText,
  type: ApiKindType,
  interface: ApiKindType,
  enum: ApiKindType,
  literal: ApiKindType,
  union: ApiKindType,
  intersection: ApiKindType
}

export default {
  name: 'ApiDocsType',
  mixins: [apiMixin],
  props: {
    'type': [String, Object],
    'kindProps': Object,
    'forceText': Boolean,
    'kind': String,
    'prefix': String,
    'postfix': String,
    'source': String,
    'nested': Boolean
  },

  computed: {
    effectiveKind () {
      return this.forceText ? 'text' : this.item.kind
    },
    item () {
      if (typeof this.type !== 'object') {
        return {
          type: this.type || API_DOCS.emptyType,
          desc: '',
          kind: 'text'
        }
      } 

      const type = {
        kind: this.kind || 'type',
        ...this.type
      }

      if (type.deprecated) {
        type.tags = (type.tags || []).concat('deprecated')
        type.desc = `<div class="warning custom-block"><p class="custom-block-title">DEPRECATED${type.deprecated.since ? ` SINCE ${type.deprecated.since}` : ''}</p><p>
        Do not use for new work.${type.deprecated.use ? ` Use [[${type.deprecated.use}]] instead.` : ''}
        </p></div>` + type.desc
      }

      if (type.kind === 'type' && typeof type.type === 'object') {
        type.kind = 'interface'
      }

      if (type.kind === 'function') {
        type.returns = this.getReturns(type.returns)
        type.params = type.params || []
        type.tags = type.tags || []

        if (type.static && (!type.tags.includes('static'))) {
          type.tags.push('static')
        }

        if (typeof type.params === 'string') {
          type.params = type.params.split(',').map(p => {
            const h = p.split(':')
            return {
              name: h[0].trim(),
              type: h[1].trim()
            }
          })
        }

        type.overloads = type.overloads || []

        type.overloads.unshift({
          params: type.params,
          returns: type.returns,
        })

        type.overloads.forEach(overload => {
          overload.kind = 'function'
          overload.name = type.name
          overload.returns = this.getReturns(overload.returns)
        })
      }

      if (type.kind === 'enum' || type.kind === 'interface' || type.kind === 'literal') {
        if (typeof type.type === 'string') {
          type.type = {
            type: type.type
          }
        }
      }

      return type
    }
  },

  methods: {
    getPrefix () {
      if (this.effectiveKind === 'text' && isInterface(this.item)) {
        return (this.prefix || '') + '{' 
      }

      return this.prefix
    },
    getPostfix () {
      if (this.effectiveKind === 'text' && isInterface(this.item)) {
        return '}' + (this.postfix || '')
      }

      return this.postfix
    },
    getReturns (returns) {
      if (returns == null) {
        returns = this.getDefaults('returns', [])
      }

      if (!Array.isArray(returns)){
        returns = [returns]
      }

      return returns.map(ret => {
        if (typeof ret === 'string') {
          return {
            type: ret,
            desc: ''
          }
        }

        return ret
      })
    }
  },

  render (h) {
    return h(KINDS[this.effectiveKind], {
      props: {
        item: this.item,
        prefix: this.getPrefix(),
        postfix: this.getPostfix(),
        source: this.source,
        nested: this.nested,
        ...{
          ...this.kindProps,

          attrs: {
            ...this.kindProps && this.kindProps.attrs,

            attrs: this.nested ? {
              class: 'nested'
            } : undefined
          }
        }
      }
    })
  }
}
</script>