<template>
  <main v-if="data" id="blog" class="withFooter">
    <h1 class="lg-heading">
      {{ $t('my') }}
      <span class="text-secondary">{{ $t('blog') }}</span>
    </h1>
    <h2 class="sm-heading">
      {{ $t('tag') }}: {{ tagName }}
    </h2>
    <div class="my-blog">

      <BlogPostsPWrap @nextP="nextPage" :showIcon="showIcon" false :disBut="disBut" :posts="data.posts"/>

      <BlogSideWrap :recentPosts="data.recentPosts" :tags="data.tags" :categories="data.categories"/>
    </div>

  </main>
</template>

<script setup>

import {useRoute, useRouter} from 'vue-router'

const route = useRoute();

const router = useRouter();

import {computed, ref} from 'vue';
import {useNextPage} from "../../../../composables/useNextPage";

const {ssrContext, $i18n} = useNuxtApp();

const  {t} = $i18n().global

const {data, error} = await useAsyncData('tag', () => $fetch('/api/tag',
    {params: {slug: route.params.id}}))

if (ssrContext) {
  const {res, url} = ssrContext;

  if (error.value) {
    res.writeHead(302, {
      Location: '/404'
    });
    res.end();
  }
} else {
  if (error.value) {
    router.replace('/404')
  }
}

const disBut = ref(false);
const showIcon = ref(false);


const tagName = computed(() => {

  const tag = data.value.tags.find((tag) => tag.slug === route.params.id);
  return tag ? tag.name : '';

})

useMeta({
  title: t('sphere') + ' — ' + t('tag') + ' — ' + tagName.value
})

async function nextPage() {
  useNextPage(data.value.posts, disBut, showIcon, route.params.id, '/api/tag');
  /*if (disBut.value) {
    return
  }

  showIcon.value = true;
  disBut.value = true;

  let lastItemIndex = data.value.posts[data.value.posts.length - 1].createdAt;
  const {posts} = await $fetch('/api/tag',
      {params: {lastTimeStamp: lastItemIndex, slug: route.params.id}})

  if (!posts.length) {
    disBut.value = true;
    showIcon.value = false;
    return
  }

  data.value.posts.push(...posts);
  showIcon.value = false;
  disBut.value = false;*/
}

</script>

<style scoped>

</style>