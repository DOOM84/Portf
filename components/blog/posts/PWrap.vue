<template>
  <div class="blog">
    <BlogPostsPItem v-for="post in posts" :post="post"/>
    <button v-if="posts && posts.length >= 10" :disabled="disBut" class="button w100" @click="nextP">
      <i v-if="showIcon" class="fas fa-sync fa-spin"></i>
      <span v-else>{{ $t('load_more') }}</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  posts: Object,
  disBut: Boolean,
  showIcon: Boolean,
});

const emit = defineEmits(['nextP'])

function nextP(){
  emit('nextP')
}

</script>

<!--<script>
export default {
  props: ['posts', 'disBut', 'showIcon'],
  methods: {
    nextP() {
      this.$emit('nextP')
    }
  }
}
</script>-->

<style scoped>

</style>