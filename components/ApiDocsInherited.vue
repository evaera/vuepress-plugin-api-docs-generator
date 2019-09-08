<template>
  <span class="inherited">↪ Inherited from <ApiLink :to="from" /></span>
</template>

<script>
export default {
  props: ['from']
}
</script>

<style lang="stylus" scoped>
.inherited
  text-align right
  float right
  color gray
</style>