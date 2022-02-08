<template>
  <main v-if="data" id="blog" class="withFooter">
    <h1 class="lg-heading">
      {{ $t('my') }}
      <span class="text-secondary">{{ $t('blog') }}</span>
    </h1>
    <h2 class="sm-heading">
      {{ $t('blog_info') }}
    </h2>
    <div class="my-blog">
      <div class="blog">
        <div class="post-container">
          <div class="blog-img">
            <div class="img-container">
              <img :src="data.post.images.original" alt="blog image" class="blog-image">
              <div class="post-date">{{ $postDate(data.post.createdAt) }}</div>
            </div>
          </div>
          <div class="info-container">
            <span>{{ data.post.author }}</span>
            <div class="post-info">
              <div v-if="data.post.likes">{{ data.post.likes }}</div>
              <div><i @click="rate" class="pointer" :class="likes"></i>
              </div>
            </div>
            <div class="post-info">
              <div v-if="comCount">{{ comCount }}</div>
              <div><i class="fas fa-comment"></i>
              </div>
            </div>
          </div>
          <div class="tags-container">
            <div v-for="tag in data.postTags" class="tags">
              <NuxtLink class="btn-dark tags" :to="'/blog/tag/'+tag.slug">
                {{ tag.name }}
              </NuxtLink>

            </div>
          </div>
          <h2 class="center">{{ data.post[$i18n.locale + '_title'] }}</h2>
          <div class="post-text" v-html="data.post.body"></div>

        </div>
        <BlogSingleCommentsCWrap @comDeleted="comDeleted" @comAdded="comAdded"
                                 :slug="data.post.slug"
                                 :commentsCount="comCount"
                                 :comments="postComments"
        />

      </div>

      <BlogSideWrap :recentPosts="data.recentPosts" :tags="data.tags" :categories="data.categories"/>
    </div>
  </main>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router';

import getCookie from "@/helpers/getCookie";

import {onMounted, computed, ref} from 'vue';

const {$i18n, $showToast, $logOut, ssrContext} = useNuxtApp();

const  {t} = $i18n().global

const user = useState('user');

const route = useRoute();

const router = useRouter();

let token = null;

if (process.server) {
  token = getCookie(ssrContext.req.headers.cookie, 'token')
}
const {data, error} = await useAsyncData('post', () => $fetch('/api/post',
    {params: {slug: route.params.id, token: token}}))

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

const postName = computed(() => data.value.post[$i18n().global.locale + '_title']);

useMeta({
  title: t('sphere') + ' — ' + t('blog') + ' — ' + postName.value
})

const postComments = ref([]);

onMounted(async () => {
  if (data.value) {
    const {comments} = await $fetch('/api/comments',
        {params: {slug: data.value.post.slug}})
    postComments.value = comments;
  }
})

const likes = computed(() => !data.value.post.isLiked ? 'fas fa-thumbs-up isLiked' :
    'fas fa-thumbs-down isNotLiked')

const comCount = computed(() => postComments.value.length)

function comAdded(comment) {
  postComments.value.unshift(comment);
  $showToast(t('comment_added'), 'success');
}

function comDeleted(toDel) {
  postComments.value.splice(postComments.value.findIndex(item => item.id === toDel), 1);
  $showToast(t('comment_removed'), 'success');
}

async function rate() {

  const formData = new FormData();
  formData.append('slug', data.value.post.slug);
  try {
    $showToast(t('loading'), 'info', 2000);
    const {likes, isLiked} = await $fetch('/api/auth/rate', {
      method: 'POST',
      body: formData,
    })
    data.value.post.likes = likes;
    data.value.post.isLiked = isLiked;
    $showToast(t('voted'), 'success');
  } catch (e) {
    if (e.response.status === 401) {
      $showToast(t('error_auth'), 'error');
      $logOut();
    }

  }
}

</script>

<style lang="scss" scoped>
.isLiked {
  color: #49e849;
}

.isNotLiked {
  color: #f31039;
}

.post-info {
  display: flex;
  gap: 5px
}


</style>