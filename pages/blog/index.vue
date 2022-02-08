<template>
  <main id="blog" class="withFooter">
    <h1 class="lg-heading">
      {{ $t('my') }}
      <span class="text-secondary">{{ $t('blog') }}</span>
    </h1>
    <h2 class="sm-heading">
      {{ $t('blog_info') }}
    </h2>
    <div class="my-blog">

      <BlogPostsPWrap @nextP="nextPage" :showIcon="showIcon" :disBut="disBut" :posts="data.posts"/>

      <BlogSideWrap :recentPosts="data.recentPosts" :tags="data.tags" :categories="data.categories"/>

    </div>

  </main>
</template>

<script setup>

import {ref} from 'vue';

const {$i18n} = useNuxtApp();

const  {t} = $i18n().global

const {data, error} = await useAsyncData('blog', () => $fetch('/api/blog'))

const disBut = ref(false);
const showIcon = ref(false);

useMeta({
  title: t('sphere') + ' — ' + t('blog')
})

async function nextPage() {

  if (disBut.value) {
    return
  }

  let itemsLength = data.value.posts.length;
  let lastItemIndex = data.value.posts[itemsLength - 1].createdAt;


  disBut.value = true;
  showIcon.value = true;

  const {posts} = await $fetch('/api/blog', {
    params: {
      lastTimeStamp: lastItemIndex,
      itemsLength: itemsLength
    }
  });

  data.value.posts = posts;
  if (data.value.posts.length === itemsLength) {
    disBut.value = true;
    showIcon.value = false;
  } else {
    disBut.value = false;
    showIcon.value = false;
  }
}


</script>


<!--<script>
export default {
  data() {
    return {
      disBut: false,
      showIcon: false
    }
  },

  methods: {
    async nextPage() {

      if (this.disBut) {
        return
      }

      let itemsLength = this.data.posts.length;
      let lastItemIndex = this.data.posts[itemsLength - 1].createdAt;


      this.disBut = true;
      this.showIcon = true;

      const {posts} = await $fetch('/api/blog', {
        params: {
          lastTimeStamp: lastItemIndex,
          itemsLength: itemsLength
        }
      });
      this.data.posts = posts;
      if (this.data.posts.length === itemsLength) {
        this.disBut = true;
        this.showIcon = false;
      } else {
        this.disBut = false;
        this.showIcon = false;
      }

    }
  }
}
</script>-->

<style scoped>

</style>