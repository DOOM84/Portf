<template>
  <main class="withFooter">

    <AdminModalWrap @closeDlg="closeModal" :showDlg="showDlg">
      <div class="form-group">
        <img v-if="projectToUpdate.images" class="form-img" :src="projectToUpdate.images.thumbnail">
        <label for="image">Изображение</label>
        <input class="mr-1" ref="file" type="file" id="image" @change="onFileChange"/>
      </div>
      <div class="form-group">
        <label for="ua_name">Название (укр)</label>
        <input type="text" v-model="projectToUpdate.ua_name" class="form-control " id="ua_name">
      </div>
      <div class="form-group">
        <label for="ru_name">Название (рус)</label>
        <input type="text" v-model="projectToUpdate.ru_name" class="form-control " id="ru_name">
      </div>
      <div class="form-group">
        <label for="en_name">Название (англ)</label>
        <input type="text" v-model="projectToUpdate.en_name" class="form-control " id="en_name">
      </div>
      <div class="form-group">
        <label for="ua_details">Описание (укр)</label>
        <input type="text" v-model="projectToUpdate.ua_details" class="form-control " id="ua_details">
      </div>
      <div class="form-group">
        <label for="ru_details">Описание (рус)</label>
        <input type="text" v-model="projectToUpdate.ru_details" class="form-control " id="ru_details">
      </div>
      <div class="form-group">
        <label for="en_details">Описание (англ)</label>
        <input type="text" v-model="projectToUpdate.en_details" class="form-control " id="en_details">
      </div>
      <div class="form-group">
        <label for="link">Ссылка</label>
        <input type="text" v-model="projectToUpdate.link" class="form-control " id="link">
      </div>
      <div class="right">
        <label for="status">Опубликовано</label>
        <input type="checkbox" v-model="projectToUpdate.status" id="status">
      </div>

      <button
          type="button"
          class="btn btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
    </AdminModalWrap>

    <div>
      <h2 class="mt-1">Проекты</h2>
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
          <th>Изображение</th>
          <th>Название (рус)</th>
          <th>Название (укр)</th>
          <th>Название (англ)</th>
          <th>Описание (рус)</th>
          <th>Описание (укр)</th>
          <th>Описание (англ)</th>
          <th>Ссылка</th>
          <th>Опубликовано</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="project in data.projects">
          <td><img width="100" :src="project.images.thumbnail"></td>
          <td>{{ project.ru_name }}</td>
          <td>{{ project.ua_name }}</td>
          <td>{{ project.en_name }}</td>
          <td>{{ project.ru_details }}</td>
          <td>{{ project.ua_details }}</td>
          <td>{{ project.en_details }}</td>
          <td>{{ project.link }}</td>
          <td>{{ project.status ? 'Да' : 'Нет' }}</td>
          <td>
            <button @click="updateItem(project)" class="btn-dark"><i class="far fa-edit"></i></button>
            <button @click="removeItem(project)" class="btn-dark"><i class="fas fa-trash-alt"></i></button>
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

const {data, error} = await useAsyncData('projects', () => $fetch('/api/admin/projects'))

const projectToUpdate = ref({status: false});
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
  projectToUpdate.value = {status: false};
  selectedFile.value = null;
}

function updateItem(project) {
  mode.value = 'edit';
  projectToUpdate.value = {...project}
  showDlg.value = true;
}

function addItem() {
  mode.value = 'add';
  showDlg.value = true;
}

async function storeItem() {

  if (mode.value === 'add' && !selectedFile.value) {
    $showToast('Отсутствует изображение', 'error', 2000);
    return
  }

  const formData = new FormData();
  formData.append('data', JSON.stringify(projectToUpdate.value))
  if (selectedFile.value) {
    formData.append("image", selectedFile.value);
  }

  try {
    $showToast(t('loading'), 'info', 2000);
    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/projects/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.projects.findIndex(item => item.id === result.id);
      data.value.projects[ind] = result;
    }

    if (mode.value === 'add') {
      const {result} = await $fetch('/api/admin/projects/add', {
        method: 'POST',
        body: formData,
      })
      data.value.projects.unshift(result);
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

async function removeItem(project) {

  if (confirm('Are you sure?')) {

    try {

      const formData = new FormData();

      formData.append('data', JSON.stringify({id: project.id, images: project.images}))

      $showToast(t('loading'), 'info', 2000);

      const {id} = await $fetch('/api/admin/projects/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.projects.splice(data.value.projects.findIndex(item => item.id === id), 1);

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
        content: "Изображение";
      }
    }

    &:nth-of-type(2) {
      &:before {
        content: "Название (рус)";
      }
    }

    &:nth-of-type(3) {
      &:before {
        content: "Название (укр)";
      }
    }

    &:nth-of-type(4) {
      &:before {
        content: "Название (англ)";
      }
    }

    &:nth-of-type(5) {
      &:before {
        content: "Описание (рус)";
      }
    }

    &:nth-of-type(6) {
      &:before {
        content: "Описание (укр)";
      }
    }

    &:nth-of-type(7) {
      &:before {
        content: "Описание (англ)";
      }
    }

    &:nth-of-type(8) {
      &:before {
        content: "Ссылка";
      }
    }

    &:nth-of-type(9) {
      &:before {
        content: "Опубликовано";
      }
    }

    &:nth-of-type(10) {
      &:before {
        content: "Действия";
      }
    }
  }
}

</style>