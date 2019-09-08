<template>
  <ApiDocsLink v-if="path" :to="path" ><slot>{{ to }}</slot></ApiDocsLink>
  <span v-else style="color: red; font-weight: bold"><slot>{{ to }}</slot> [broken link]</span>
</template>

<script>
import { getUrl } from '../util'

export default {
  props: ['to'],

  computed: {
    path () {
      return getUrl.call(this, this.to)
    }
  },

  components: {
    ApiDocsLink: () => import('../components/ApiDocsLink')
  }
}
</script>