<template>
  <div class="post-menu__container">
    <h2 class="left title">{{ $t('categories') }}</h2>
    <ul class="left">
      <BlogSideCategoriesCatItem v-for="category in categories" :category="category"/>
    </ul>
  </div>
</template>

<script setup>

const props = defineProps({
  categories: Object,
});

</script>

<!--<script>
export default {
  props: ['categories'],
}
</script>-->

<style scoped>

</style>