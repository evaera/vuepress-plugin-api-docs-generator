import { joinElements as join } from '../../util'
import ApiDocsType from '../ApiDocsType.vue'

export default function (h, item) {
  const newLines = item.types.length > 2
  const tag = newLines ? 'pre' : 'span'

  return (
    <tag style={tag === 'pre' && {
      marginLeft: '30px'
    }}>{item.parens && <span class='muted'>(</span>}{newLines ? '   ' : ''}{
        item.types.map(type => (
          <ApiDocsType
            type={type}
            forceText
            nested
          />
        )).reduce(join(
          item.kind === 'union'
            ? <span>{newLines ? <br /> : ' '} | </span>
            : <span>{newLines ? <br /> : ' '} &amp; </span>
        ), null)
      }{item.parens && <span class='muted'>)</span>}</tag>
  )
}
