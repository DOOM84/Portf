<template>
  <div class="post-menu__container">
    <h2 class="left title">{{ $t('tags') }}</h2>
    <div class="tags-container">
      <BlogSideTagsTagItem v-for="tag in tags" :tag="tag"/>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  tags: Object,
});

</script>

<!--<script>
export default {
  props: ['tags'],
}
</script>-->

<style scoped>

</style>