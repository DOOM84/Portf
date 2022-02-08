<template>
  <main id="contact" class="withFooter">
    <h1 class="lg-heading">
      {{ $t('login') }}
    </h1>
    <h2 class="sm-heading">
      {{ showMode }}
    </h2>

    <div class="auth-container">
      <template v-if="mode==='signup' || mode==='login'">
        <input @keyup.enter="authorize" v-if="mode==='signup'" class="contact" v-model.trim="login" type="text"
               name="login" :placeholder="$t('name')">
        <input @keyup.enter="authorize" class="contact" v-model.trim="email" type="email"
               name="email" :placeholder="$t('email')">
        <input @keyup.enter="authorize" class="contact" v-model.trim="password" type="password"
               name="password" :placeholder="$t('password')">
        <template v-if="mode==='signup'">
          <input @keyup.enter="authorize" class="contact" v-model.trim="passwordConfirmation" type="password"
                 name="passwordConfirmation"
                 :placeholder="$t('password_more')">
        </template>

        <div>
          <button class="button" :disabled="showIcon" @click="authorize">
            <i v-if="showIcon" class="fas fa-sync fa-spin"></i>
            <span v-else>{{ showMode }}</span>
          </button>
          <button class="btn-blog ml-1" @click="toggleMode(null)">{{ showBtnMode }}</button>
          <button class="btn-blog ml-1" @click="toggleMode('reset')">{{ $t('forgot') }}</button>
        </div>
      </template>

      <template v-else>
        <input @keyup.enter="authorize" class="contact" v-model.trim="email" type="email"
               name="email" :placeholder="$t('email')">
        <div>
          <button class="button" :disabled="showIcon" @click="authorize">
            <i v-if="showIcon" class="fas fa-sync fa-spin"></i>
            <span v-else>{{ $t('send') }}</span>
          </button>
          <button class="btn-blog ml-1" @click="toggleMode('login')">{{ $t('login') }}</button>
        </div>
      </template>

    </div>
  </main>
</template>
<script setup>
import {useRoute, useRouter} from 'vue-router';
import {computed, ref} from 'vue';

const authToken = useState('token');
const isLoggedIn = useState('isLoggedIn');
const user = useState('user');
const {$i18n, $showToast, $logOut} = useNuxtApp();
const {t} = $i18n().global;
const router = useRouter();
const route = useRoute();
const login = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const mode = ref('login');
const err = ref(false);
const showIcon = ref(false);

useMeta({
  title: t('sphere') + ' — ' + t('login')
})

const showMode = computed(() =>
    mode.value === 'signup' ? t('register') : mode.value === 'login' ? t('login') : t('resetPas'));

const showBtnMode = computed(() => mode.value === 'signup' ? t('login') : t('register'));

function setCookies(name, data) {
  let now = new Date();
  now.setTime(now.getTime() + 1 * 3600 * 1000);
  let expires = "expires=" + now.toUTCString();
  document.cookie = name + "=" + data + ";" + expires + ";path=/; SameSite=Lax;";
}

function toggleMode(reset = null) {
  if (reset) {
    mode.value = reset
  } else {
    mode.value = mode.value === 'login' ? 'signup' : 'login'
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

async function authorize() {

  if (isLoggedIn.value) {
    return
  }
  err.value = false;

  if (!validateEmail(email.value)) {
    err.value = true;
    $showToast(t('error_email'), 'error');
  }

  if (mode.value !== 'reset') {
    if (password.value.length < 6) {
      err.value = true;
      $showToast(t('error_pass_length'), 'error');
    }
  }

  if (mode.value === 'signup') {
    let strippedLogin = login.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]\\\/]/gi, '')

    if (!strippedLogin || strippedLogin !== login.value || strippedLogin.length < 3) {
      err.value = true;
      $showToast(t('error_login'), 'error');
    }

    if (password.value !== passwordConfirmation.value) {
      err.value = true;
      $showToast(t('error_pass_match'), 'error');
    }
  }

  if (err.value) {
    return
  }

  const formData = new FormData();

  formData.append("email", email.value);

  if (mode.value !== 'reset') {
    formData.append("password", password.value);
  }

  if (mode.value === 'signup') {
    formData.append("login", login.value);
    formData.append("passwordConfirmation", passwordConfirmation.value);
  }

  try {
    showIcon.value = true
    const data = mode.value === 'signup' ? await $fetch('/api/auth/signup', {
      method: 'POST',
      body: formData,
    }) : mode.value === 'login' ?
        await $fetch('/api/auth/login', {
          method: 'POST',
          body: formData,
        }) : await $fetch('/api/auth/reset', {
          method: 'POST',
          body: formData,
        })

    if (mode.value !== 'reset') {
      setCookies('token', data.token);
      authToken.value = data.token;
      isLoggedIn.value = !!data.token;
      user.value = {
        name: data.login, /*email: data.email,*/
        avatar: data.avatar ? data.avatar.substring(data.avatar.lastIndexOf('/') + 1) : null
      }
      await router.push(route.params.prevRoute ? route.params.prevRoute : '/blog');
    } else {
      showIcon.value = false;
      $showToast(t('email_sent'), 'success');
      mode.value = 'login';
    }
  } catch (error) {
    showIcon.value = false;
    err.value = true;
    $logOut();

    if (mode.value === 'signup') {

      if (error.response.status !== 422) {

        $showToast(t('error_email_exists'), 'error');

      } else {

        $showToast(t(error.response._data.msg), 'error');
      }
    } else {

      if (error.response.status !== 422) {

        $showToast(t('error_no_user'), 'error');

      } else {

        $showToast(t(error.response._data.msg), 'error');
      }

    }
  }

}

</script>

<style lang="scss" scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

</style>