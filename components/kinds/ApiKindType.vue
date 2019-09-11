<template>
  <div class="api-item">
    <ApiDocsSince v-if="item.since" :since="item.since" />
    <ApiDocsInherited v-if="item.source !== this.source" :from="item.source" />
    <h3 :id="slug">
      <a :href="'#' + slug" class="header-anchor">#</a>
			<code>{{ item.name }}</code>
			<ApiDocsTags :tags="item.tags" />
		</h3>
    <ApiDocsType 
      :type="item" 
      :forceText="true" 
      :prefix="this.item.name ? this.item.name + (this.readableKind === 'type' ? ':' : '') + ' ' : ''"
      :kindProps="{
        kindPrefix: !this.disableKindPrefix ? this.readableKind : ''
      }"
      nested
    />
    <ApiDocsDesc :text="item.desc" />
  </div>
</template>

<script>
import apiMixin from '../../apiMixin'

export default {
	mixins: [apiMixin],
	data: () => ({
		kind: 'type'
  }),
  computed: {
    readableKind () {
      if (this.item.kind === 'literal') {
        return 'interface'
      }

      return this.item.kind
    }
  },
  props: ['item', 'prefix', 'source', 'disableKindPrefix'],
  components: {
    ApiDocsDesc: () => import('../ApiDocsDesc'),
    ApiDocsSince: () => import('../ApiDocsSince'),
    ApiDocsTags: () => import('../ApiDocsTags'),
    ApiDocsType: () => import('../ApiDocsType'),
    ApiDocsInherited: () => import('../ApiDocsInherited'),
  }
}
</script>