import {defineNuxtPlugin} from "#app";
import {addBackToTop} from 'vanilla-back-to-top';

export default defineNuxtPlugin((nuxtApp) => {
    addBackToTop({
        diameter: 40,
        cornerOffset: 20,
        scrollDuration: 500,
        backgroundColor: 'rgb(62,119,170)',
        textColor: '#fff',
        zIndex: 1000,
        innerHTML: '<svg viewBox="0 0 512 512" > <g><polygon style="fill:#fff;" points="468.631,212.631 435.369,245.901 256.01,66.524 76.631,245.901 43.369,212.631 256.01,0 \t\n' +
            '\t\t"/><polygon style="fill:#fff;" points="468.631,345.679 435.369,378.949 256.01,199.58 76.631,378.949 43.369,345.679 \n' +
            '\t\t256.01,133.051 \t"/><polygon style="fill:#fff;" points="468.631,478.735 435.369,512 256.01,332.631 76.631,512 43.369,478.735 256.01,266.099 \t"/>',
    })
});

