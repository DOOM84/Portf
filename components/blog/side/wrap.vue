<template>
  <div class="bmenu">
    <form @submit.prevent="search">
      <input class="input" type="text" v-model.trim="term" :placeholder="$t('search')+'...'">
    </form>
    <div class="auth">
      <NuxtLink v-if="isLoggedIn === false" class="side-link title center"
                :to="{ name: 'auth', params: { prevRoute: $route.path }}">
        {{ $t('login') }} / {{ $t('register') }}
      </NuxtLink>
      <span v-else-if="!user">
           <i class="fas fa-sync fa-spin"></i>
        </span>
      <template v-else>
        <h3> {{ user?.name }} </h3>
        <img class="avatar" @click="avaUpload = !avaUpload" :src="avatar" alt="">
        <BlogSideAvatarWrap :oldAva="user.avatar" @ava="setAva" v-if="avaUpload"/>
        <button class="btn btn-dark" @click="logOut">{{ $t('logOut') }}</button>
      </template>
    </div>

    <BlogSidePostsPostWrap :recentPosts="recentPosts"/>

    <BlogSideCategoriesCatWrap :categories="categories"/>

    <BlogSideTagsTagWrap :tags="tags"/>

  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
const {$logOut} = useNuxtApp();
const isLoggedIn = useState('isLoggedIn');
const user = useState('user');

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['searchRes'])

const props = defineProps({
  recentPosts: Object,
  tags: Object,
  categories: Object,
  oldTerm: Object,
});

const term = ref('');
const avaUpload = ref(false);

const avatar = computed(() => user.value.avatar ? '/img/avatars/' + user.value.avatar
    : '/img/avatars/no_avatar.png');

function setAva(path) {
  user.value.avatar = path.substring(path.lastIndexOf('/') + 1);
  avaUpload.value = false;
}

function logOut() {
  $logOut();
}

async function search() {

  let strippedTerm = term.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]\\\/]/gi, '');
  strippedTerm = strippedTerm.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");

  if (props.oldTerm && (props.oldTerm === strippedTerm) || strippedTerm.length < 3) {
    return
  }

  if (route.name !== 'search') {
    await router.push({name: 'search', params: {term: strippedTerm}})
  } else {
    const {posts, results} = await $fetch('/api/search',
        {params: {term: strippedTerm, sdb: 'no'}});
    emit('searchRes', posts, strippedTerm, results)
  }
}


</script>

<!--<script>
export default {
  props: ['recentPosts', 'tags', 'categories', 'oldTerm'],
  data() {
    return {
      term: '',
      user: null,
      avaUpload: false
    }
  },

  computed: {
    avatar() {
      return this.user.avatar ? '/img/avatars/' + this.user.avatar : '/img/avatars/no_avatar.png'
    }
  },

  methods: {

    setAva(path) {
      this.user.avatar = path.substring(path.lastIndexOf('/') + 1);
      this.avaUpload = false;
    },

    logOut() {
      this.$nuxt.$logOut();
    },

    async search() {

      let strippedTerm = this.term.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]\\\/]/gi, '');
      strippedTerm = strippedTerm.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");

      if (this.oldTerm && (this.oldTerm === strippedTerm) || strippedTerm.length < 3) {
        return
      }

      if (this.$route.name !== 'search') {
        await this.$router.push({name: 'search', params: {term: strippedTerm}})
      } else {
        const {posts, results} = await $fetch('/api/search',
            {params: {term: strippedTerm, sdb: 'no'}});
        this.$emit('searchRes', posts, strippedTerm, results)
      }
    }
  }

}
</script>-->

<style lang="scss" scoped>
.auth {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  align-items: center;
}

.avatar {
  border-radius: 50%;
  margin-bottom: 1rem;
  cursor: pointer
}
</style>