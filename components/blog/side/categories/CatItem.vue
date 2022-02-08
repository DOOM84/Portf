<template>
  <li>
    <NuxtLink class="side-link" :to="'/blog/category/'+category.slug">
      {{ category[$i18n.locale + '_name'] }}
    </NuxtLink>
  </li>
</template>

<script setup>

const props = defineProps({
  category: Object,
});

</script>

<!--<script>
export default {
  props: ['category'],
}
</script>-->

<style scoped>

</style>