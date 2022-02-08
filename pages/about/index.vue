<template>
  <main id="about" class="withFooter">
    <h1 class="lg-heading">
      {{ $t('about_me.about') }}
      <span class="text-secondary">{{ $t('about_me.me') }}</span>
    </h1>
    <h2 class="sm-heading">
      {{ $t('my_info') }}
    </h2>
    <div class="about-info">
      <img :src="'/img/portrait.png'" alt="hero" class="bio-image">
      <div class="bio">
        <h3 class="text-secondary">BIO</h3>
        <p>
          {{ $t('about_work') }} {{ $t('city_country') }}: {{ $t('city_country_name') }}. {{ $t('age') }}:
          {{ $showAge() }}.
          {{ $t('languages') }}: {{ $t('langs') }}.
        </p>
      </div>

      <AboutAbItem v-if="data" v-for="(fact, i) in data.facts" :fact="fact" :cls="cls(i)"/>
      <TheSkeleton v-else v-for="i in 4"></TheSkeleton>

    </div>
  </main>
</template>

<script setup>
//import {getDatabase, ref, get, query} from "firebase/database";
//const db = getDatabase();
const {data, error} = await useAsyncData('about', () => $fetch('/api/about'), {lazy: true});

const {$i18n} = useNuxtApp();
const {t} = $i18n().global;

useMeta({
  title: t('sphere') + ' — ' + t('about')
})

function cls(i) {
  return i + 1 !== data.value.facts.length ? 'job-' + (+i + 1) : '';
}



/*const {data} =  await useAsyncData('about', async () => {
  try {
    const aboutSnap = await get(query(ref(db, `trainings`)));
    const aboutArray = [];
    aboutSnap.forEach((arr)=>{
      aboutArray.push(arr.val());
    })
    return new Promise(resolve => {
   setTimeout(() => {
     resolve(aboutArray);
   }, 3000);
 })
    return aboutArray;
  }catch (e) {
    //await router.push('/404')
    console.log(e.message);
    //console.log(e);

  }
},{defer:true})*/



</script>


<style scoped>

</style>