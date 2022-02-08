<template>
  <div>
    <NuxtLink class="side-link" :to="'/blog/post/'+recentPost.slug">
      <div class="post-menu">
        <img class="post-menu__pic" :src="recentPost.images.thumbnail" alt="">
        <span>{{ recentPost[$i18n.locale + '_title'] }}</span>
      </div>
    </NuxtLink>
  </div>

</template>

<script setup>

const props = defineProps({
  recentPost: Object,
});

</script>

<!--<script>
export default {
  props: ['recentPost'],
}
</script>-->

<style scoped>

</style>