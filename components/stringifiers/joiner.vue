<script>
import { joinElements as join } from '../../util'
import ApiDocsType from '../ApiDocsType.vue'

export default {
  props: ['item'],

  render () {
    const newLines = this.item.types.length > 2
    const tag = newLines ? 'pre' : 'span'

    return (
      <tag style={tag === 'pre' && {
        marginLeft: '30px'
      }}>{this.item.parens && <span class='muted'>(</span>}{newLines ? '   ' : ''}{
          this.item.types.map(type => (
            <ApiDocsType
              type={type}
              forceText
              nested
            />
          )).reduce(join(
            this.item.kind === 'union'
              ? <span>{newLines ? <br /> : ' '} | </span>
              : <span>{newLines ? <br /> : ' '} &amp; </span>
          ), null)
        }{this.item.parens && <span class='muted'>)</span>}</tag>
    )
  }
}
</script>
