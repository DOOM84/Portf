<template>

  <div class="tags">
    <NuxtLink class="btn-dark tags" :to="'/blog/tag/'+tag.slug">
      {{ tag.name }}
    </NuxtLink>
  </div>

</template>

<script setup>

const props = defineProps({
  tag: Object,
});

</script>

<!--<script>
export default {
  props: ['tag'],
}
</script>-->

<style scoped>

</style>