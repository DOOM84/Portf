<template>
  <div class="projects">
    <ProjectsPrItem v-for="project in projects" :project="project"/>
  </div>
</template>

<script setup>

const props = defineProps({
  projects: Object,
});


</script>

<!--<script>
export default {
  props: ['projects'],
}
</script>-->

<style scoped>

</style>