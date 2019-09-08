<template>
  <div class="api-item">
    <ApiDocsSince v-if="item.since" :since="item.since" />
    <ApiDocsInherited v-if="item.source !== this.source" :from="item.source" />
    <h3 :id="slug">
      <a :href="'#' + slug" class="header-anchor">#</a>
			<code>{{ item.name }}</code>
			<ApiDocsTags :tags="item.tags" />
		</h3>
    <ApiDocsType :type="item" nested :forceText="true" :kindProps="{
        prefix: `${this.prefix}.${item.name}: `,
      }" />
    <ApiDocsDesc :text="item.desc" />
  </div>
</template>

<script>
import apiMixin from '../../apiMixin'

export default {
	mixins: [apiMixin],
	data: () => ({
		kind: 'property'
	}),
  props: ['item', 'prefix', 'source'],
  components: {
    ApiDocsDesc: () => import('../ApiDocsDesc'),
    ApiDocsTags: () => import('../ApiDocsTags'),
    ApiDocsType: () => import('../ApiDocsType'),
    ApiDocsSince: () => import('../ApiDocsSince'),
    ApiDocsInherited: () => import('../ApiDocsInherited'),
  }
}
</script>