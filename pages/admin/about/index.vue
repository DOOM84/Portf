<template>
  <main class="withFooter">

    <AdminModalWrap @closeDlg="closeModal" :showDlg="showDlg">
      <div class="form-group">
        <label for="ru_name">Должность (рус)</label>
        <input type="text" v-model.trim="trainingToUpdate.ru_name" class="form-control " id="ru_name">
      </div>
      <div class="form-group">
        <label for="ua_name">Должность (укр)</label>
        <input type="text" v-model.trim="trainingToUpdate.ua_name" class="form-control " id="ua_name">
      </div>
      <div class="form-group">
        <label for="en_name">Должность (англ)</label>
        <input type="text" v-model.trim="trainingToUpdate.en_name" class="form-control " id="en_name">
      </div>
      <div class="form-group">
        <label for="ru_description">Описание (рус)</label>
        <input type="text" v-model.trim="trainingToUpdate.ru_description" class="form-control " id="ru_description">
      </div>
      <div class="form-group">
        <label for="ua_description">Описание (укр)</label>
        <input type="text" v-model.trim="trainingToUpdate.ua_description" class="form-control " id="ua_description">
      </div>
      <div class="form-group">
        <label for="en_description">Описание (англ)</label>
        <input type="text" v-model.trim="trainingToUpdate.en_description" class="form-control " id="en_description">
      </div>
      <div class="form-group">
        <label for="year">Годы</label>
        <input type="text" v-model.trim="trainingToUpdate.year" class="form-control " id="year">
      </div>
      <div class="form-group">
        <label for="begin">Год начала</label>
        <input type="text" v-model.trim="trainingToUpdate.begin" class="form-control " id="begin">
      </div>
      <div class="right">
        <label for="status">Опубликовано</label>
        <input type="checkbox" v-model="trainingToUpdate.status" id="status">
      </div>

      <button
          type="button"
          class="btn btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
    </AdminModalWrap>

    <div>
      <h2 class="mt-1">Информация</h2>
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
          <th>Должность (рус)</th>
          <th>Должность (укр)</th>
          <th>Должность (англ)</th>
          <th>Описание (рус)</th>
          <th>Описание (укр)</th>
          <th>Описание (англ)</th>
          <th>Год</th>
          <th>Опубликовано</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="fact in data.facts">
          <td>{{ fact.ru_name }}</td>
          <td>{{ fact.ua_name }}</td>
          <td>{{ fact.en_name }}</td>
          <td>{{ fact.ru_description }}</td>
          <td>{{ fact.ua_description }}</td>
          <td>{{ fact.en_description }}</td>
          <td>{{ fact.year }}</td>
          <td>{{ fact.status ? 'Да' : 'Нет' }}</td>
          <td>
            <button @click="updateItem(fact)" class="btn-dark"><i class="far fa-edit"></i></button>
            <button @click="removeItem(fact.id)" class="btn-dark"><i class="fas fa-trash-alt"></i></button>
          </td>
        </tr>
        </tbody>
      </table>
    </AdminTheTable>

  </main>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
const {$i18n, $showToast} = useNuxtApp();
const  {t} = $i18n().global;
const router = useRouter();

const {data, error} = await useAsyncData('about', () => $fetch('/api/admin/about'));

const trainingToUpdate = ref({status: false});
const showDlg = ref(false);
const mode = ref(null);

definePageMeta({
  layout: 'admin'
})

function closeModal() {
  showDlg.value = false;
  mode.value = null;
  trainingToUpdate.value = {status: false}
}

function updateItem(fact) {
  mode.value = 'edit';
  trainingToUpdate.value = {...fact}
  showDlg.value = true;
}

function addItem() {
  mode.value = 'add';
  showDlg.value = true;
}

async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(trainingToUpdate.value))
  try {
    $showToast(t('loading'), 'info', 2000);
    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/about/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.facts.findIndex(item => item.id === result.id);
      data.value.facts[ind] = result;
    }

    if (mode.value === 'add') {
      const {result} = await $fetch('/api/admin/about/add', {
        method: 'POST',
        body: formData,
      })
      data.value.facts.unshift(result);
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

      $showToast('Вы не авторизованы', 'error', 2000);

    }
  }
}

async function removeItem(factId) {
  if (confirm('Are you sure?')) {
    try {

      const formData = new FormData();
      formData.append('id', factId);

      $showToast(t('loading'), 'info', 2000);

      const {id} = await $fetch('/api/admin/about/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.facts.splice(data.value.facts.findIndex(item => item.id === id), 1);

      $showToast('Информация успешно удалена', 'success', 2000);

    } catch (e) {

      if (e.response.status === 403) {

       $showToast('Доступ запрещен', 'error');

        await router.replace('/404')

      }
    }
  }
}

</script>


<style scoped lang="scss">

@media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {
  td {
    &:nth-of-type(1) {
      &:before {
        content: "Должность (рус)";
      }
    }

    &:nth-of-type(2) {
      &:before {
        content: "Должность (укр)";
      }
    }

    &:nth-of-type(3) {
      &:before {
        content: "Должность (англ)";
      }
    }

    &:nth-of-type(4) {
      &:before {
        content: "Описание (рус)";
      }
    }

    &:nth-of-type(5) {
      &:before {
        content: "Описание (укр)";
      }
    }

    &:nth-of-type(6) {
      &:before {
        content: "Описание (англ)";
      }
    }

    &:nth-of-type(7) {
      &:before {
        content: "Год";
      }
    }

    &:nth-of-type(8) {
      &:before {
        content: "Опубликовано";
      }
    }

    &:nth-of-type(9) {
      &:before {
        content: "Действия";
      }
    }
  }
}

</style>