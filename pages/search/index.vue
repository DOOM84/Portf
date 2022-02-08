<template>
  <main id="blog" class="withFooter">
    <h1 class="lg-heading">
      {{ $t('my') }}
      <span class="text-secondary">{{ $t('blog') }}</span>
    </h1>
    <h2 class="sm-heading">
      <template v-if="term">

        {{ $t('found') }}: {{ data.results }}, {{ $t('on_query') }}: {{ term }}
      </template>
      <template v-else>
        {{ $t('error_query') }}
      </template>

    </h2>
    <div class="my-blog">

      <BlogPostsPWrap @nextP="nextPage" :showIcon="showIcon" :disBut="disBut" :posts="data.posts"/>

      <BlogSideWrap @searchRes="showRes" :oldTerm="term" :recentPosts="data.recentPosts" :tags="data.tags"
                    :categories="data.categories"/>
    </div>

  </main>
</template>


<script setup>
import {useRoute} from 'vue-router';
import {computed, ref, watch} from 'vue';

const route = useRoute();

const {data, error} = await useAsyncData('search', () => $fetch('/api/search',
    {params: {term: route.params.term}}))

const q = ref(route.params.term);
const clear = ref(true);
const disBut = ref(false);
const showIcon = ref(false);

const {$i18n} = useNuxtApp();
const {t} = $i18n().global;

useMeta({
  title: t('sphere') + ' — ' + t('search')
})

function showRes(posts, term, results) {
  disBut.value = false;
  q.value = term
  data.value.posts = posts;
  data.value.results = results
}

const term = computed(() => q);

watch(q, () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
})

async function nextPage() {
  if (disBut.value) {
    return
  }

  let strippedTerm = term.value.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]\\\/]/gi, '');
  strippedTerm = strippedTerm.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");

  if (strippedTerm.length < 3) {
    return
  }
  showIcon.value = true;
  disBut.value = true;

  let lastItemIndex = data.value.posts[data.value.posts.length - 1].createdAt;
  const {posts} = await $fetch('/api/search',
      {params: {lastTimeStamp: lastItemIndex, term: strippedTerm, sdb: 'no'}})

  if (!posts.length) {
    disBut.value = true;
    showIcon.value = false;
    return
  }

  data.value.posts.push(...posts);

  showIcon.value = false;
  disBut.value = false;
}

</script>

<style scoped>

</style>