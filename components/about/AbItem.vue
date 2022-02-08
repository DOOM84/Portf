<template>

    <div class="job" :class="cls">
      <h3>{{fact.year}}</h3>
      <h6>{{fact[$i18n.locale+'_name']}}</h6>
      <p>
        {{fact[$i18n.locale+'_description']}}
      </p>
    </div>
</template>

<script setup>
const props = defineProps({
  fact: Object,
  cls: String,
});
</script>

<!--<script>
export default {
  props: ['fact', 'cls']

}
</script>-->

<style scoped>

</style>