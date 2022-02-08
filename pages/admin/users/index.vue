<template>
  <main class="withFooter">

    <AdminModalWrap @closeDlg="closeModal" :showDlg="showDlg">
      <div class="form-group">
        <img v-if="userToUpdate.photoURL" class="userImg"
             :src="'/img/avatars/'+userToUpdate.photoURL">
        <label for="image">Аватар</label>
        <input class="mr-1" ref="file" type="file" id="image" @change="onFileChange"/>
      </div>
      <div class="form-group">
        <label for="login">Имя</label>
        <input type="text" v-model="userToUpdate.displayName" class="form-control " id="login">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="userToUpdate.email" class="form-control " id="email">
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" v-model="userToUpdate.password" class="form-control " id="password">
      </div>
      <div class="form-group">
        <label for="password_confirmation">Пароль еще раз</label>
        <input type="password" v-model="userToUpdate.passwordConfirmation" class="form-control "
               id="password_confirmation">
      </div>
      <div v-if="userToUpdate.customClaims" class="right">
        <label for="role">Администратор</label>
        <input type="checkbox" v-model="userToUpdate.customClaims.admin" id="role">
      </div>
      <div class="right">
        <label for="status">Заблокирован</label>
        <input type="checkbox" v-model="userToUpdate.disabled" id="status">
      </div>

      <button
          type="button"
          class="btn btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
    </AdminModalWrap>

    <div>
      <h2 class="mt-1">Пользователи</h2>
    </div>

    <div class="right">
      <button
          type="button"
          @click.prevent="addItem">
        Добавить
      </button>
    </div>

    <AdminTheTable>
      <table>
        <thead>
        <tr>
          <th>Имя</th>
          <th>Изображение</th>
          <th>Email</th>
          <th>Администратор</th>
          <th>Заблокирован</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in data.users">
          <td>{{ user.displayName }}</td>
          <td><img width="80" :src="user.photoURL ? '/img/avatars/'+user.photoURL : '/img/avatars/no_avatar.png'"></td>
          <td>{{ user.email }}</td>
          <td>{{ user.customClaims['admin'] ? 'Да' : 'Нет' }}</td>
          <td>{{ user.disabled ? 'Да' : 'Нет' }}</td>
          <td>
            <button @click="updateItem(user)" class="btn-dark"><i class="far fa-edit"></i></button>
            <button @click="removeItem(user)" class="btn-dark"><i class="fas fa-trash-alt"></i></button>
          </td>
        </tr>
        </tbody>
      </table>
    </AdminTheTable>

  </main>
</template>

<script setup>
import {ref} from "vue";

const {$i18n, $showToast} = useNuxtApp();
const {t} = $i18n().global;
import {useRouter} from 'vue-router';

const router = useRouter();

const {data, error} = await useAsyncData('users', () => $fetch('/api/admin/users/index'));

const userToUpdate = ref({customClaims: {admin: false}, disabled: false});
const showDlg = ref(false);
const mode = ref(null);
const file = ref(null);
const selectedFile = ref(null);

definePageMeta({
  layout: 'admin'
})


function onFileChange(e) {
  selectedFile.value = file.value.files[0];
}

function closeModal() {
  showDlg.value = false;
  mode.value = null;
  userToUpdate.value = {customClaims: {admin: false}, disabled: false};
  selectedFile.value = null;
}

function updateItem(user) {
  mode.value = 'edit';
  userToUpdate.value = {...user}
  showDlg.value = true;
}

function addItem() {
  mode.value = 'add';
  showDlg.value = true;
}

async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(userToUpdate.value))
  if (selectedFile.value) {
    formData.append("image", selectedFile.value);
  }

  try {
    $showToast(t('loading'), 'info', 2000);
    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/users/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.users.findIndex(item => item.uid === result.uid);
      data.value.users[ind] = result;
    }

    if (mode.value === 'add') {
      const {result} = await $fetch('/api/admin/users/add', {
        method: 'POST',
        body: formData,
      })
      data.value.users.unshift(result);
    }

    closeModal();

    $showToast('Информация успешно изменена', 'success', 2000);

  } catch (e) {

    if (e.response.status === 422) {

      $showToast(e.response._data.msg, 'error');

    } else if (e.response.status === 403) {

      $showToast('Доступ запрещен', 'error');

      await router.replace('/404')

    } else {

     $showToast(t('error_email_exists'), 'error', 2000);

    }

  }
}

async function removeItem(user) {

  if (confirm('Are you sure?')) {

    try {
      const formData = new FormData();

      formData.append('data', JSON.stringify({id: user.uid, /*image:user.photoURL*/}))

      $showToast(t('loading'), 'info', 2000);

      const {id} = await $fetch('/api/admin/users/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.users.splice(data.value.users.findIndex(item => item.uid === id), 1);

      $showToast('Информация успешно удалена', 'success', 2000);

    } catch (e) {

      if (e.response.status === 403) {

        $showToast('Доступ запрещен', 'error');

        await router.replace('/404')

      }
    }

  }
}


/*import getCookie from "@/helpers/getCookie";
const { ssrContext } = useNuxtApp();

let token;

if(ssrContext){
  token = getCookie(ssrContext.req.headers.cookie, 'token');
}

const {data, error} = await useAsyncData('users', () => $fetch('/api/admin/users/index',
    {params: {token: token}}))

import {useRouter} from "vue-router";*/

/*let token = null;

const { ssrContext } = useNuxtApp();
const router = useRouter();

if(ssrContext){
  token = getCookie(ssrContext.req.headers.cookie, 'token');
}

const {data, error} = await useAsyncData('users', () => $fetch('/api/admin/users/index',
    {params: {token: token}}))

if (ssrContext) {
  const { res, url } = ssrContext;
  if (error.value) {
    res.writeHead(302, {
      Location: '/404'
    });
    res.end();
  }
}else{
  if (error.value) {
    useNuxtApp().$showToast('Вы не авторизованы', 'error', 2000)
   //router.replace('/404')
  }
}*/
</script>


<style scoped lang="scss">

.userImg {
  margin: 1rem;
  width: 80px
}

@media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {
  td {
    &:nth-of-type(1) {
      &:before {
        content: "Изображение";
      }
    }

    &:nth-of-type(2) {
      &:before {
        content: "Имя";
      }
    }

    &:nth-of-type(3) {
      &:before {
        content: "Email";
      }
    }

    &:nth-of-type(4) {
      &:before {
        content: "Администратор";
      }
    }

    &:nth-of-type(5) {
      &:before {
        content: "Активен";
      }
    }

    &:nth-of-type(6) {
      &:before {
        content: "Действия";
      }
    }
  }
}

</style>