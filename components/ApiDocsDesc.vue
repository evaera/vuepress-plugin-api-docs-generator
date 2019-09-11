<template>
  <div v-html="parsedText"></div>
</template>

<script>
import { getUrl } from '../util'

export default {
  computed: {
    parsedText () {
      return (this.text || '').replace(/\[\[(.+?)\]\]/g, (_, match) => {
        const url = getUrl.call(this, match, true)

        if (url) {
          return `<a href="${url}">${match}</a>`
        } else {
          return match
        }
      })
    }
  },
  props: ['text']
}
</script>

<style lang="stylus" scoped>
.inset
  border-left 4px solid lighten($accentColor, 50%)
  padding-left 10px

  p
    margin 5px
</style>