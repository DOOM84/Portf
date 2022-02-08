import {defineNuxtPlugin} from '#app'
import VueScrollTo from 'vue-scrollto'

export default defineNuxtPlugin((nuxtApp) => {
    /*nuxtApp.vueApp.use(VueScrollTo, {
        container: "body",
        duration: 500,
        easing: "ease",
        offset: 0,
        force: true,
        cancelable: true,
        onStart: false,
        onDone: false,
        onCancel: false,
        x: false,
        y: true
    });*/

    nuxtApp.provide('scrollTo', (element, duration, options) => VueScrollTo.scrollTo(element, duration, options))
});