<template>

  <NuxtLink :to="'/blog/post/'+post.slug" class="nav-link">
    <div class="post-container">
      <div class="blog-img">
        <div class="img-container">

          <img :src="post.images.original" alt="blog image" class="blog-image">
          <div class="post-date">{{ date }}</div>
        </div>
      </div>
      <div class="info-container">
        <span>{{ post.author }}</span>
        <span>{{ post.likes }} <i class="fas fa-thumbs-up"></i></span>
        <span>{{ post.comments }} <i class="fas fa-comment"></i></span>
      </div>
      <h2 class="center">{{ post[$i18n.locale + '_title'] }}</h2>
      <p class="center">
        {{ post[$i18n.locale + '_subtitle'] }}
      </p>
    </div>
  </NuxtLink>

</template>

<script setup>

import {computed} from "vue";

const {$postDate} = useNuxtApp();

const props = defineProps({
  post: Object,
});

const date = computed(() => $postDate(props.post.createdAt));

</script>

<!--<script>
export default {
  props: ['post'],

  computed: {
    date() {
      return this.$nuxt.$postDate(this.post.createdAt)
    }
  }

}
</script>-->

<style scoped>

</style>