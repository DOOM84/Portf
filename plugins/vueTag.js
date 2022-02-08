import {defineNuxtPlugin} from '#app';
import TagInput from '@mayank1513/vue-tag-input'
import '@mayank1513/vue-tag-input/dist/TagInput.css'


export default defineNuxtPlugin(nuxtApp => {

    nuxtApp.vueApp.component('TagInput', TagInput)

})



