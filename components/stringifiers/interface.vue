<script>
import { joinElements as join, isInterface } from '../../util'
import ApiDocsType from '../ApiDocsType.vue'
import ApiDocsDesc from '../ApiDocsDesc.vue'

export default {
  props: ['item'],

  render () {
    return (
      <div class='nested' style={{
        display: 'block',
        margin: 0,
        verticalAlign: 'text-top',
        marginLeft: '30px'
      }}>{
          Object.entries(this.item.type).map(([key, value]) => (
            <div>{key}{ value.type && <span>{this.item.kind === 'enum' ? '(' : ': '}{ value.type &&
              <ApiDocsType
                type={this.item.kind === 'literal' ? {
                  kind: 'literal',
                  type: value
                } : value || ''}
                forceText
                kindProps={{
                  tag: isInterface(value) ? 'pre' : 'span'
                }}
                nested
              />}{value.type && this.item.kind === 'enum' && ')'}</span>}{value && value.desc &&
                <ApiDocsDesc
                  class='inset'
                  style={{
                    marginLeft: '30px',
                    // marginTop: '-10px',
                    // marginBottom: '-10px',
                    // color: '#777',
                    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI'
                  }}
                  text={value.desc.trim()}
                />
            }
            </div>
          )).reduce(join('\n'), null)}
      </div>
    )
  }
}
</script>
