import {defineNuxtPlugin, defineNuxtComponent} from '#app';
import {QuillEditor/*, Quill*/} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import htmlEditButton from "quill-html-edit-button";
import ImageUploader from "quill-image-uploader";
//import BlotFormatter from 'quill-blot-formatter';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';


//import customQuillModule from 'customQuillModule'
//Quill.register('modules/customQuillModule' /*,customQuillModule*/)

export default defineNuxtPlugin(nuxtApp => {

    /*let BackgroundClass = Quill.import('attributors/class/background');
    let ColorClass = Quill.import('attributors/class/color');
    let SizeStyle = Quill.import('attributors/style/size');
    Quill.register(BackgroundClass, true);
    Quill.register(ColorClass, true);
   Quill.register(SizeStyle, true);*/

    const globalOptions = {
        debug: 'error',
    }

    QuillEditor.props.globalOptions.default = () => globalOptions

    QuillEditor.props.modules.default = [
        {
            name: 'htmlEditButton',
            module: htmlEditButton,
            options: {debug: false}
        },
        {
            name: 'ImageUploader',
            module: ImageUploader,
            options: {
                upload: (file) => {
                    return new Promise(async (resolve, reject) => {
                        const formData = new FormData();
                        formData.append("contentImg", file);
                        try {
                            const {url} = await $fetch('/api/admin/blog/upload', {
                                method: 'POST',
                                body: formData,
                            })

                            resolve(
                                url
                            );

                        } catch (error) {
                            console.log(error.name + ': ' + error.message);
                        }
                    });
                },
            }
        },
        {
            name: 'blotFormatter',
            module: BlotFormatter,
            options: {/* options */}
        },
    ]

    nuxtApp.vueApp.component('QuillEditor', QuillEditor)

})



