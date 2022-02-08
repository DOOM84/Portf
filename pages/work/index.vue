<template>
  <main id="work" class="withFooter">
    <h1 class="lg-heading">
      {{ $t('my_projects.my') }}
      <span class="text-secondary">{{ $t('my_projects.projects') }}</span>
    </h1>
    <h2 class="sm-heading">
      {{ $t('projects_det') }}...
    </h2>
    <ProjectsPrWrap v-if="data" :projects="data.projects"/>
    <div v-else class="projects">
      <TheSkeleton v-for="i in 7"></TheSkeleton>
    </div>
  </main>
</template>

<script setup>
const {data} = await useAsyncData('projects', () => $fetch('/api/projects'), {lazy: true})

const {$i18n} = useNuxtApp();
const {t} = $i18n().global;

useMeta({
  title: t('sphere') + ' — ' + t('projects')
})

</script>
