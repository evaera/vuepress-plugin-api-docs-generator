<template>
  <span class="available-since">{{ since }}+</span>
</template>

<script>
export default {
  props: ["since"]
};
</script>

<style lang="stylus" scoped>
.available-since
  text-align right
  float right
  color gray
</style>
