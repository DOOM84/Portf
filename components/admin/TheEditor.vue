<template>
  <div>
    <QuillEditor @textChange="upd" v-model:content.trim="content" contentType="html" theme="snow" toolbar="full"/>
  </div>

</template>

<script setup>
const props = defineProps({
  content: String,
});

const emit = defineEmits(['bodyUpd'])

function upd() {
  emit('bodyUpd', props.content);
}

</script>

<!--<script>

export default {
  props: ['content'],
  methods: {
    upd() {
      this.$emit('bodyUpd', this.content);
    }
  }
}
</script>-->

<style lang="scss">

.ql-formats > button {
  color: black;
}

.ql-html-popupTitle {
  color: black;
}

.ql-html-buttonGroup {

  button {

    cursor: pointer;
    font-size: 1rem;
    border-radius: 25px;
    border: 3px #585050 solid;
    padding: 0.2rem;
    margin-bottom: 0.5rem;

    background: none;
    color: #000;

    &:hover {
      background: goldenrod;
      transition: all 0.5s ease-out;
    }
  }
}
</style>