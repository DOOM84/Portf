<template>
  <MyModal
      v-model="showDlg"
      :close="closeModal"
  >
    <div class="modal">
      <div class="container">
        <slot></slot>
      </div>

      <button class="button btn-dark ml-1"
              @click="closeModal"
      >
        {{ $t('close') }}
      </button>
    </div>
  </MyModal>
</template>

<script setup>
const props = defineProps({
  showDlg: Boolean,
});

const emit = defineEmits(['closeDlg'])

function closeModal() {
  emit('closeDlg');
}

</script>

<!--<script>
export default {
  props: ['showDlg'],
  methods: {
    closeModal() {
      this.$emit('closeDlg');
    },
  }
}
</script>-->

<style lang="scss">

.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

.modal {
  color: black;
  max-width: 1400px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  /*font-size: 20px;*/
  text-align: left;
}

@media (min-width: 576px) {
  .container {
    width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    width: 1140px;
  }
}

.vue-universal-modal-leave-from,
.vue-universal-modal-enter-to {
  opacity: 1;
}

.vue-universal-modal-enter-from,
.vue-universal-modal-leave-to {
  opacity: 0;
}

.vue-universal-modal {
  -webkit-overflow-scrolling: touch;
  -ms-scroll-chaining: none;
  overscroll-behavior: contain;
  position: fixed;
  overflow-y: auto;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  text-align: left;
  z-index: 2000;
}

.vue-universal-modal:not(.vue-universal-modal-latest) {
  background: none;
}

.vue-universal-modal-content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%;
  min-height: 100%;
}

</style>