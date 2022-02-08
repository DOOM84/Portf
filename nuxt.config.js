import {defineNuxtConfig} from 'nuxt3'

export default defineNuxtConfig({

    //vite: false,

    meta: {
        title: 'Vue.js, Laravel, PHP, Nuxt.js, Back-end, Front-end розробка — Ласкаво просимо!',
        meta: [
            {
                name: 'keywords',
                content: 'Vue.js, Laravel, PHP, Nuxt.js, Back-end, Front-end, development, создание сайтов, разработка'
            },
            {
                hid: 'description',
                name: 'description',
                content: 'Vue.js, Laravel, PHP, Nuxt.js, Back-end, Front-end, development'
            }
        ],
        link: [
            {
                rel: 'stylesheet',
                href: 'https://use.fontawesome.com/releases/v5.2.0/css/all.css'
            },
            {rel: 'icon', type: "image/x-icon", href: '/favicon.png'},
        ],
       /* script: [
            {
                defer: true,
                async: true,
                src: 'https://platform.twitter.com/widgets.js',
            },
           /!* {
                src: '@/node_modules/@ckeditor/ckeditor5-vue/dist/ckeditor.js',
            }*!/

        ]*/
    },

    css: ["@/assets/scss/main.scss"],

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    //additionalData: '@import "@/assets/scss/main.scss";',
                    charset: false,
                },
            },
        },
    },


    buildModules: [
        '~/modules/errorPage',
        // '@intlify/nuxt3'
        //'~/modules/vuei18n',
    ],


})
