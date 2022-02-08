<template>
  <main class="withFooter">

    <AdminModalWrap @closeDlg="closeModal" :showDlg="showDlg">
      <div class="form-group">
        <label for="ru_name">Название (рус)</label>
        <input type="text" v-model.trim="categoryToUpdate.ru_name" class="form-control " id="ru_name">
      </div>
      <div class="form-group">
        <label for="ua_name">Название (укр)</label>
        <input type="text" v-model.trim="categoryToUpdate.ua_name" class="form-control " id="ua_name">
      </div>
      <div class="form-group">
        <label for="en_name">Название (англ)</label>
        <input type="text" v-model.trim="categoryToUpdate.en_name" class="form-control " id="en_name">
      </div>

      <div class="right">
        <label for="status">Опубликовано</label>
        <input type="checkbox" v-model="categoryToUpdate.status" id="status">
      </div>

      <button
          type="button"
          class="btn btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
    </AdminModalWrap>

    <div>
      <h2 class="mt-1">Категории</h2>
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
          <th>Название (рус)</th>
          <th>Название (укр)</th>
          <th>Название (англ)</th>
          <th>Опубликовано</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="category in data.categories">
          <td>{{ category.ru_name }}</td>
          <td>{{ category.ua_name }}</td>
          <td>{{ category.en_name }}</td>
          <td>{{ category.status ? 'Да' : 'Нет' }}</td>
          <td>
            <button @click="updateItem(category)" class="btn-dark"><i class="far fa-edit"></i></button>
            <button @click="removeItem(category.slug)" class="btn-dark"><i class="fas fa-trash-alt"></i></button>
          </td>
        </tr>
        </tbody>
      </table>
    </AdminTheTable>

  </main>
</template>

<script setup>
const {data, error} = await useAsyncData('categories', () => $fetch('/api/admin/categories/index'))
import {ref} from "vue";
const {$i18n, $showToast} = useNuxtApp();
const  {t} = $i18n().global;
import {useRouter} from 'vue-router';
const router = useRouter();

const categoryToUpdate = ref({status: false})
const showDlg = ref(false);
const mode = ref(null);

definePageMeta({
  layout: 'admin'
})

function closeModal() {
  showDlg.value = false;
  mode.value = null;
  categoryToUpdate.value = {status: false}
}

function updateItem(category) {
  mode.value = 'edit';
  categoryToUpdate.value = {...category}
  showDlg.value = true;
}

function addItem() {
  mode.value = 'add';
  showDlg.value = true;
  categoryToUpdate.value.status = false;
}

async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(categoryToUpdate.value))
  try {
    $showToast(t('loading'), 'info', 2000);
    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/categories/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.categories.findIndex(item => item.slug === result.slug);
      data.value.categories[ind] = result;
    }

    if (mode.value === 'add') {
      const {result} = await $fetch('/api/admin/categories/add', {
        method: 'POST',
        body: formData,
      })
      data.value.categories.unshift(result);
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

async function removeItem(catSlug) {
  if (confirm('Are you sure?')) {
    try {

      const formData = new FormData();
      formData.append('slug', catSlug);

      $showToast(t('loading'), 'info', 2000);

      const {slug} = await $fetch('/api/admin/categories/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.categories.splice(data.value.categories.findIndex(item => item.slug === slug), 1);

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
        content: "Название (рус)";
      }
    }

    &:nth-of-type(2) {
      &:before {
        content: "Название (укр)";
      }
    }

    &:nth-of-type(3) {
      &:before {
        content: "Название (англ)";
      }
    }

    &:nth-of-type(4) {
      &:before {
        content: "Опубликовано";
      }
    }

    &:nth-of-type(8) {
      &:before {
        content: "Действия";
      }
    }
  }
}

</style>