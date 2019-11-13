<template>
  <Layout>
    <template v-slot:page-bottom>
      <div class="right-side-nav">
        {{ $page.headers }}
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from "@vuepress/theme-default/layouts/Layout.vue";

export default {
  components: {
    Layout
  }
};
</script>
