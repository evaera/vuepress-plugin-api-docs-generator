import { joinElements as join } from '../../util'
import ApiDocsType from '../ApiDocsType.vue'

export default function (h, item) {
  const newLines = item.params.length > 1
  const tag = newLines ? 'div' : 'span'
  return (
    <span><span class='accent-fn'>{
      item.name || 'function'
    }</span>(<tag style={newLines ? {
      marginLeft: '15px'
    } : {
      whiteSpace: 'nowrap'
    }}>{
        item.params.map(p => (
          <span>{p.name}: <ApiDocsType nested type={p.type} kindProps={{
            tag: 'span',
            attrs: item => ({
              class: typeof item.type === 'string' && 'accent-type'
            })
          }} forceText /></span>
        )).reduce(join(newLines ? <span>,<br /></span> : ', '), null)
      }</tag>) → {
      item.returns.map(p => (
        <ApiDocsType forceText type={p.type} nested kindProps={{
          tag: 'span'
        }} />
      )).reduce(join(', '), null)
    }</span>
  )
}
