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
      :prefix="this.item.name ? this.item.name + ': ' : ''"
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
  props: ['item', 'prefix', 'source'],
  components: {
    ApiDocsDesc: () => import('../ApiDocsDesc'),
    ApiDocsSince: () => import('../ApiDocsSince'),
    ApiDocsTags: () => import('../ApiDocsTags'),
    ApiDocsType: () => import('../ApiDocsType'),
    ApiDocsInherited: () => import('../ApiDocsInherited'),
  }
}
</script>