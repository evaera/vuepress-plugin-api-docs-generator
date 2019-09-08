<template>
  <router-link v-if="to.startsWith('/')" :to="to"><slot /></router-link>
  <a v-else-if="to.startsWith('#')" :href="to"><slot /></a>
  <a v-else target="_blank" :href="to"><slot /><OutboundLink /></a>
</template>

<script>
export default {
  props: ['to']
}
</script>