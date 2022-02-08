<template>
  <main id="contact" class="withFooter">
    <h2 class="lg-heading">
      {{ $t('contact') }}
    </h2>
    <h2 class="sm-heading text-secondary">
      {{ $t('contact_me') }}
    </h2>
    <iframe id="gmap_canvas" width="100%" height="300px"
            src="https://maps.google.com/maps?q=Kyiv&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
            data-v-263f21de=""></iframe>

    <div class="contact-form">
      <input @keyup.enter="send" v-model.trim="name" name="login" class="contact" type="text" :placeholder="$t('name')">
      <input @keyup.enter="send" v-model.trim="email" class="contact" type="email" name="email"
             :placeholder="$t('email')">
      <textarea v-model.trim="message" class="contact" name="" id="" cols="30" rows="10"
                :placeholder="$t('message')"></textarea>

      <button class="button" :disabled="showIcon" @click="send">
        <i v-if="showIcon" class="fas fa-sync fa-spin"></i>
        <span v-else>{{ $t('send') }}</span>
      </button>

    </div>
  </main>
</template>

<script setup>

import {ref} from 'vue';
const {$i18n, $showToast} = useNuxtApp();
const  {t} = $i18n().global

const name = ref('');
const email = ref('');
const message = ref('');
const err = ref(false);
const showIcon = ref(false);

useMeta({
  title: t('sphere') + ' — ' + t('contact')
})

function  validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

async function send() {
  err.value = false;

  if (!validateEmail(email.value)) {
    err.value = true;
    $showToast(t('error_email'), 'error');
  }
  let strippedName = name.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]\\\/]/gi, '')
  if (!strippedName || strippedName !== name.value || strippedName.length < 3) {
    err.value = true;
    $showToast(t('error_login'), 'error');
  }
  if (!message.value || message.value.indexOf('\n\n') > 0) {
    $showToast(t('error_text'), 'error');
    err.value = true;
  }
  if (message.value.length < 10 || message.value.length > 2000) {
    $showToast(t('error_msg'), 'error');
    err.value = true;
  }

  if (err.value) {
    return
  }

  const formData = new FormData();

  formData.append("email", email.value);
  formData.append("name", name.value);
  formData.append("message", message.value);

  try {
    showIcon.value = true
    const res = await $fetch('/api/email', {
      method: 'POST',
      body: formData,
    })
    $showToast(t('msg_sent'), 'success');
    name.value = '';
    email.value = '';
    message.value = '';
    showIcon.value = false;
  } catch (e) {
    err.value = true;
    showIcon.value = false;
    if (e.response.status !== 422) {

      $showToast(t('error_try_later'), 'error');

    } else {

      $showToast(t(e.response._data.msg), 'error');

    }
  }
}

</script>

<style lang="scss" scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}
</style>