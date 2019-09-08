<template>
  <div v-html="parsedText"></div>
</template>

<script>
import { getUrl } from '../util'

export default {
  computed: {
    parsedText () {
      return (this.text || '').replace(/\[\[(.+)\]\]/g, (_, match) => {
        const url = getUrl.call(this, match)

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