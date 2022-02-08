<template>
  <main class="withFooter">

    <AdminModalWrap @closeDlg="closeModal" :showDlg="showDlg">
      <div class="form-group">
        <img v-if="postToUpdate.images" class="form-img" :src="postToUpdate.images.thumbnail">
        <label for="image">Изображение</label>
        <input class="mr-1" ref="file" type="file" id="image" @change="onFileChange"/>
      </div>
      <div class="form-group">
        <label for="ua_name">Название (укр)</label>
        <input type="text" v-model.trim="postToUpdate.ua_title" class="form-control " id="ua_name">
      </div>
      <div class="form-group">
        <label for="ru_name">Название (рус)</label>
        <input type="text" v-model.trim="postToUpdate.ru_title" class="form-control " id="ru_name">
      </div>
      <div class="form-group">
        <label for="en_name">Название (англ)</label>
        <input type="text" v-model.trim="postToUpdate.en_title" class="form-control " id="en_name">
      </div>
      <div class="form-group">
        <label for="ua_details">Описание (укр)</label>
        <input type="text" v-model.trim="postToUpdate.ua_subtitle" class="form-control " id="ua_details">
      </div>
      <div class="form-group">
        <label for="ru_details">Описание (рус)</label>
        <input type="text" v-model.trim="postToUpdate.ru_subtitle" class="form-control " id="ru_details">
      </div>
      <div class="form-group">
        <label for="en_details">Описание (англ)</label>
        <input type="text" v-model.trim="postToUpdate.en_subtitle" class="form-control " id="en_details">
      </div>
      <div class="form-group">
        <label>Категории</label>
        <select v-model="postToUpdate.categories" multiple class="w100" id="categories">
          <option v-for="(category, i) in data.categories" :key="i" :value="category.slug">{{ category.ru_name }}
          </option>
        </select>
      </div>
      <ClientOnly>
        <div class="form-group">
          <label>Теги</label>
          <tag-input v-model=postToUpdate.tags>
          </tag-input>
        </div>
        <AdminTheEditor v-if="!finalEdit" @bodyUpd="bodyUpd" :content="postToUpdate.body" contentType="html"
                        theme="snow" toolbar="full"/>
      </ClientOnly>
      <div class="form-group">
        <textarea v-model="postToUpdate.body" v-if="finalEdit" class="w100 htmlText"></textarea>
      </div>
      <div class="right">
        <button class="htmlTextBtn" @click="finalEdit = !finalEdit">
          {{ finalEdit ? 'Показать редактор' : 'Показать HTML' }}
        </button>
      </div>
      <div class="form-group">
        <label for="author">Автор</label>
        <input type="text" v-model="postToUpdate.author" class="form-control " id="author">
      </div>
      <div class="form-group">
        <label for="source">Источник</label>
        <input type="text" v-model="postToUpdate.source" class="form-control " id="source">
      </div>
      <div class="right">
        <label for="status">Опубликовано</label>
        <input type="checkbox" v-model="postToUpdate.status" id="status">
      </div>

      <button
          type="button"
          class="btn btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
    </AdminModalWrap>

    <div>
      <h2 class="mt-1">Блог</h2>
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
          <th>Автор</th>
          <th>Опубликовано</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="post in data.posts">
          <td><img width="100" :src="post.images.thumbnail"></td>
          <td>{{ post.ru_title }}</td>
          <td>{{ post.ua_title }}</td>
          <td>{{ post.en_title }}</td>
          <td>{{ post.ru_subtitle }}</td>
          <td>{{ post.ua_subtitle }}</td>
          <td>{{ post.en_subtitle }}</td>
          <td>{{ post.author }}</td>
          <td>{{ post.status ? 'Да' : 'Нет' }}</td>
          <td>
            <button @click="updateItem(post)" class="btn-dark"><i class="far fa-edit"></i></button>
            <button @click="removeItem(post)" class="btn-dark"><i class="fas fa-trash-alt"></i></button>
          </td>
        </tr>
        </tbody>
      </table>
    </AdminTheTable>

  </main>

</template>

<script setup>
import slugify from "slugify";
import {ref} from "vue";

const {$i18n, $showToast} = useNuxtApp();
const {t} = $i18n().global;
import {useRouter} from 'vue-router';

definePageMeta({
  layout: 'admin'
})

const router = useRouter();
useNuxtApp().vueApp.config.compilerOptions.isCustomElement = tag => tag.startsWith('tag-') || tag.startsWith('QuillEditor')

const {data, error} = await useAsyncData('posts', () => $fetch('/api/admin/blog/index'))

const content = ref('');
const postToUpdate = ref({categories: [], tags: [], body: '', status: false, author: 'admin'});
const showDlg = ref(false);
const mode = ref(null);
const file = ref(null);
const selectedFile = ref(null);
const finalEdit = ref(false);

function bodyUpd(content) {
  postToUpdate.value.body = content;
}

function closeModal() {
  showDlg.value = false;
  finalEdit.value = false;
  mode.value = null;
  postToUpdate.value = {categories: [], tags: [], body: '', author: 'admin'};
  selectedFile.value = null;
}

function updateItem(post) {
  mode.value = 'edit';
  postToUpdate.value = {...post}
  showDlg.value = true;
}

function addItem() {
  mode.value = 'add';
  showDlg.value = true;
}

function onFileChange(e) {
  selectedFile.value = file.value.files[0];
}

async function storeItem() {

  if (postToUpdate.value.tags) {
    postToUpdate.value.tags = postToUpdate.value.tags.map((tag) => ({
      name: tag,
      slug: slugify(tag).toLowerCase()
    }));
  }

  const formData = new FormData();
  formData.append('data', JSON.stringify(postToUpdate.value))
  if (selectedFile.value) {
    formData.append("image", selectedFile.value);
  }

  try {
    $showToast(t('loading'), 'info', 2000);
    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/blog/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.posts.findIndex(item => item.slug === result.slug);

      data.value.posts[ind] = result;
    }

    if (mode.value === 'add') {
      const {result} = await $fetch('/api/admin/blog/add', {
        method: 'POST',
        body: formData,
      })
      data.value.posts.unshift(result);
    }

    closeModal();

    $showToast('Информация успешно изменена', 'success', 2000);

  } catch (e) {
    if (postToUpdate.value.tags) {
      postToUpdate.value.tags = postToUpdate.value.tags.map((tag) => tag.name)
    }

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


async function removeItem(post) {

  if (confirm('Are you sure?')) {

    try {

      const formData = new FormData();

      formData.append('data', JSON.stringify({slug: post.slug, images: post.images}))

      $showToast(t('loading'), 'info', 2000);

      const {slug} = await $fetch('/api/admin/blog/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.posts.splice(data.value.posts.findIndex(item => item.slug === slug), 1);

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

<script>
export default {
  head: {
    title: 'Blog Admin',
  },
}
</script>

<style scoped lang="scss">

.htmlText {
  height: 800px;
  resize: none;
}

.htmlTextBtn {
  color: black;
  padding: 0;
  margin: 0
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
        content: "Автор";
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



