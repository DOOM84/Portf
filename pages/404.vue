<template>
  <main class="withFooter">
    <h2>{{ $t('notFound') }}</h2>
    <h3>{{ $t('notFoundMsg') }}</h3>

  </main>
</template>

<script setup>
const {$i18n} = useNuxtApp();
const {t} = $i18n().global;

definePageMeta({
  layout: 'error'
})

useMeta({
  title: t('sphere') + ' — ' + t('notFound')
})

</script>


<style scoped>

</style>