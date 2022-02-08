import {
    defineNuxtModule
} from '@nuxt/kit';

export default defineNuxtModule({
    name: 'error-module',
    setup(options, nuxt) {
        nuxt.options.router.extendRoutes = (routes, resolve) => {
            routes.push({
                name: 'error',
                path: '*',
                component: resolve(__dirname, 'pages/404.vue'),
                error: 404
            })
        }
    }
});