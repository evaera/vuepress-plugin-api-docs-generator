import { joinElements as join, isInterface } from '../../util'
import ApiDocsType from '../ApiDocsType.vue'
import ApiDocsDesc from '../ApiDocsDesc.vue'

export default function (h, item) {
  return (
    <div class='nested' style={{
      display: 'block',
      margin: 0,
      verticalAlign: 'text-top',
      marginLeft: '30px'
    }}>{
        Object.entries(item.type).map(([key, value]) => (
          <div>{key}:{ isInterface(value) && ' {'} {
            <ApiDocsType
              type={item.kind === 'literal' && typeof value === 'object' ? {
                kind: 'literal',
                type: value
              } : value || ''}
              forceText
              kindProps={{
                tag: isInterface(value) ? 'pre' : 'span'
              }}
              nested
            />}{value.desc &&
              <ApiDocsDesc
                style={{
                  marginLeft: '30px',
                  marginTop: '-10px',
                  marginBottom: '-10px',
                  // color: '#777',
                  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI'
                }}
                text={value.desc.trim()}
              />
          }{ isInterface(value) && '}'}
          </div>
        )).reduce(join('\n'), null)}
      }</div>
  )
}
