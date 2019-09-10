<script>
import ApiDocsType from '../ApiDocsType.vue'

export default {
  props: ['item'],

  render () {
    return (
      <ApiDocsType
        type={this.item.type}
        forceText
        nested
      />
    )
  }
}
</script>