<template>
  <main v-if="data" id="blog" class="withFooter">
    <h1 class="lg-heading">
      {{ $t('my') }}
      <span class="text-secondary">{{ $t('blog') }}</span>
    </h1>
    <h2 class="sm-heading">
      {{ $t('category') }}: {{ catName }}
    </h2>
    <div class="my-blog">

      <BlogPostsPWrap @nextP="nextPage" :showIcon="showIcon" :disBut="disBut" :posts="data.posts"/>

      <BlogSideWrap :recentPosts="data.recentPosts" :tags="data.tags" :categories="data.categories"/>
    </div>
  </main>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router';

import {computed, ref} from 'vue';
import {useNextPage} from "../../../../composables/useNextPage";

const route = useRoute();

const router = useRouter();

const {ssrContext, $i18n} = useNuxtApp();

const  {t} = $i18n().global

/*const { data, error } = await useFetch('https://httpstat.us/404');
if (error.value) {
  console.log('fetchERR', error.value)

}*/

const {data, error} = await useAsyncData('category', () => $fetch('/api/category',
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

const catName = computed(() => {

  const cat = data.value.categories.find((category) => category.slug === route.params.id);
  return cat ? cat[$i18n().global.locale + '_name'] : '';
})

useMeta({
  title: t('sphere') + ' — ' + t('category') + ' — ' + catName.value
})

async function nextPage() {
  useNextPage(data.value.posts, disBut, showIcon, route.params.id, '/api/category');
  /*if (disBut.value) {
    return
  }

  showIcon.value = true;
  disBut.value = true;

  let lastItemIndex = data.value.posts[data.value.posts.length - 1].createdAt;
  const {posts} = await $fetch('/api/category',
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