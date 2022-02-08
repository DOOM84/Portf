<template>
  <div>

    <div id="modals"></div>
    <AdminModalWrap @closeDlg="toggleModal(false)" :showDlg="showDlg">
      <vue-load-image>
        <template v-slot:image>
          <img :src="project.images.original" alt="">
        </template>
        <template v-slot:preloader>

          <img src="/image-loader.gif"/>

        </template>
        <template v-slot:error>Image load fails</template>
      </vue-load-image>
    </AdminModalWrap>

    <div class="item">
      <img @click="toggleModal(true)" class="prjImg pointer" :src="project.images.thumbnail">
      <a class="btn-light" :href="project.link" :target="project.link === '#' ? '' : '_blank'">
        <i class="fas fa-eye"></i> {{ project[$i18n.locale + '_name'] }}
      </a>
    </div>
  </div>
</template>

<script setup>
import VueLoadImage from 'vue-load-image';

import {ref} from "vue";

const props = defineProps({
  project: Object,
});

const showDlg = ref(false)

function toggleModal(mode) {
  showDlg.value = mode
}


</script>

<!--<script>
import VueLoadImage from 'vue-load-image'

export default {
  props: ['project'],
  components: {
    'vue-load-image': VueLoadImage
  },
  data() {
    return {
      showDlg: false
    }
  },
  methods: {
    closeModal() {
      this.showDlg = false
    }
  }

}
</script>-->

<style lang="scss">

.modal {
  padding: 0 !important;
}

</style>