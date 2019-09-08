<template>
  <span>
    <span class="badge" v-for="tag in allTags" :key="tag" :style="getColor(tag)">{{ tag }}</span>
  </span>
</template>

<style scoped lang="stylus">
.badge {
  display: inline-block;
  font-size: 14px;
  height: 18px;
  line-height: 18px;
  border-radius: 3px;
  padding: 2px 10px;
  color: #fff;
  background: $accentColor;
  margin-left: 10px;
  // text-transform: uppercase;
}
</style>

<script>
import apiMixin from '../apiMixin'

export default {
  mixins: [apiMixin],
  props: {
    tags: {
      default: () => []
    }
  },

  computed: {
    allTags () {
      const defaultTags = this.getDefaults('tags', [])
        .map(tag => {
          if (typeof tag !== 'object') {
            return tag
          }

          if (tag.unless) {
            if (typeof tag.unless === 'string') {
              tag.unless = [ tag.unless ]
            }

            for (const unlessTag of tag.unless) {
              if (this.tags.includes(unlessTag)) {
                return
              }
            }
          }

          return tag.name
        })
        .filter(t => t)

      return Array.from(new Set(defaultTags.concat(this.tags)))
    }
  },

  methods: {
    getColor (tag) {
      return API_DOCS.tagColors && { backgroundColor: API_DOCS.tagColors[tag] }
    }
  }
}
</script>