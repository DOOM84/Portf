import formidable from "formidable";
//import SibApiV3Sdk from 'sib-api-v3-sdk'
import nodemailer from 'nodemailer';
import * as yup from 'yup';
import { firstValues } from 'formidable/src/helpers/firstValues.js';

const schema = yup.object({
        name: yup.string('error_login').trim('error_login')
            .min(3, 'error_login')
            .max(100, 'error_login')
            .matches(/^[0-9A-Za-zа-яёА-ЯЁ ]*$/, 'error_login')
            .required('error_login'),
        email: yup.string('error_email').email('error_email').required('error_email'),
        message: yup.string('error_msg')
            .test(
                'line_breaks',
                'error_text',
                (value) => value.indexOf('\n\n') < 0
            )
            .min(10, 'error_msg').max(2000, 'error_msg').required('error_msg'),
});

export default async (req, res) => {

    if (req.originalUrl === '/api/email' && req.method.toLowerCase() === 'post') {
        const form = formidable();

        const {name, email, message} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                const fieldsSingle = firstValues(form, fields);
               // console.log(fieldsSingle)
                resolve(fieldsSingle)
            });
        })

        try {

            await schema.validate({
                name, email, message
            });


            /* SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

             new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
                 {
                     'subject':'Hello from the Node SDK!',
                     //'sender' : {'email':'api@sendinblue.com', 'name':'Sendinblue'},
                     'sender' : {"name": "From name", "email":"d00m7@ukr.net"},
                     'replyTo' : {'email':'d00m7@ukr.net', 'name':'Sendinblue'},
                     'to' : [{'name': name, 'email': email}],
                     'htmlContent' : '<html><body><h1>+"message"+</h1></body></html>',
                     'params' : {'bodyMessage':'Made just for you!'}
                 }
             ).then(function(data) {
                 console.log(data);
             }, function(error) {
                 console.error(error);
             });*/

            /*let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: '', // generated ethereal user
                    pass: '', // generated ethereal password
                },
            });*/


            let transporter = nodemailer.createTransport({
                host: "smtp-relay.sendinblue.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: '', // generated ethereal user
                    pass: '', // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"' + name + '" <' + email + '>', // sender address
                to: "d00m7@ukr.net", // list of receivers
                subject: "Сообщение с сайта", // Subject line
                //text: "Hello world?", // plain text body
                html: "<!DOCTYPE html>\n" +
                    "<html lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"utf-8\"> <!-- utf-8 works for most cases -->\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width\"> <!-- Forcing initial-scale shouldn't be necessary -->\n" +
                    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <!-- Use the latest (edge) version of IE rendering engine -->\n" +
                    "    <meta name=\"x-apple-disable-message-reformatting\">  <!-- Disable auto-scale in iOS 10 Mail entirely -->\n" +
                    "    <meta name=\"format-detection\" content=\"telephone=no,address=no,email=no,date=no,url=no\"> <!-- Tell iOS not to automatically link certain text strings. -->\n" +
                    "    <meta name=\"color-scheme\" content=\"light\">\n" +
                    "    <meta name=\"supported-color-schemes\" content=\"light\">\n" +
                    "    <title></title> " +
                    "    <style>\n" +
                    "\n" +
                    "        :root {\n" +
                    "          color-scheme: light;\n" +
                    "          supported-color-schemes: light;\n" +
                    "        }\n" +
                    "\n" +
                    "        html,\n" +
                    "        body {\n" +
                    "            margin: 0 auto !important;\n" +
                    "            padding: 0 !important;\n" +
                    "            height: 100% !important;\n" +
                    "            width: 100% !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        * {\n" +
                    "            -ms-text-size-adjust: 100%;\n" +
                    "            -webkit-text-size-adjust: 100%;\n" +
                    "        }\n" +
                    "\n" +
                    "        div[style*=\"margin: 16px 0\"] {\n" +
                    "            margin: 0 !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        #MessageViewBody, #MessageWebViewDiv{\n" +
                    "            width: 100% !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        table,\n" +
                    "        td {\n" +
                    "            mso-table-lspace: 0pt !important;\n" +
                    "            mso-table-rspace: 0pt !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        table {\n" +
                    "            border-spacing: 0 !important;\n" +
                    "            border-collapse: collapse !important;\n" +
                    "            table-layout: fixed !important;\n" +
                    "            margin: 0 auto !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        img {\n" +
                    "            -ms-interpolation-mode:bicubic;\n" +
                    "        }\n" +
                    "\n" +
                    "        a {\n" +
                    "            text-decoration: none;\n" +
                    "        }\n" +
                    "\n" +
                    "        a[x-apple-data-detectors],  /* iOS */\n" +
                    "        .unstyle-auto-detected-links a,\n" +
                    "        .aBn {\n" +
                    "            border-bottom: 0 !important;\n" +
                    "            cursor: default !important;\n" +
                    "            color: inherit !important;\n" +
                    "            text-decoration: none !important;\n" +
                    "            font-size: inherit !important;\n" +
                    "            font-family: inherit !important;\n" +
                    "            font-weight: inherit !important;\n" +
                    "            line-height: inherit !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        .a6S {\n" +
                    "            display: none !important;\n" +
                    "            opacity: 0.01 !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        .im {\n" +
                    "            color: inherit !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        img.g-img + div {\n" +
                    "            display: none !important;\n" +
                    "        }\n" +
                    "        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {\n" +
                    "            u ~ div .email-container {\n" +
                    "                min-width: 320px !important;\n" +
                    "            }\n" +
                    "        }\n" +
                    "        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {\n" +
                    "            u ~ div .email-container {\n" +
                    "                min-width: 375px !important;\n" +
                    "            }\n" +
                    "        }\n" +
                    "        @media only screen and (min-device-width: 414px) {\n" +
                    "            u ~ div .email-container {\n" +
                    "                min-width: 414px !important;\n" +
                    "            }\n" +
                    "        }\n" +
                    "\n" +
                    "    </style>\n" +
                    "\n" +
                    "    <style>\n" +
                    "\n" +
                    "\t    .button-td,\n" +
                    "\t    .button-a {\n" +
                    "\t        transition: all 100ms ease-in;\n" +
                    "\t    }\n" +
                    "\t    .button-td-primary:hover,\n" +
                    "\t    .button-a-primary:hover {\n" +
                    "\t        background: #555555 !important;\n" +
                    "\t        border-color: #555555 !important;\n" +
                    "\t    }\n" +
                    "\n" +
                    "\t    @media screen and (max-width: 600px) {\n" +
                    "\n" +
                    "\t        .email-container p {\n" +
                    "\t            font-size: 17px !important;\n" +
                    "\t        }\n" +
                    "\n" +
                    "\t    }\n" +
                    "\n" +
                    "    </style>\n" +
                    "\n" +
                    "</head>\n" +
                    "<body width=\"100%\" style=\"margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;\">\n" +
                    "\t<center role=\"article\" aria-roledescription=\"email\" lang=\"en\" style=\"width: 100%; background-color: #222222;\">\n" +
                    "        <div style=\"display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;\">\n" +
                    "\t        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;\n" +
                    "        </div>\n" +
                    "        <div style=\"max-width: 600px; margin: 0 auto;\" class=\"email-container\">\n" +
                    "\t        <table align=\"center\" role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"margin: auto;\">\n" +
                    "\n" +
                    "                <tr>\n" +
                    "                    <td style=\"background-color: #ffffff;\">\n" +
                    "                        <img src=\"https://designs.network/img/email-back.png\" width=\"600\" height=\"\" alt=\"alt_text\" border=\"0\" style=\"width: 100%; max-width: 600px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555; margin: auto; display: block;\" class=\"g-img\">\n" +
                    "                    </td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td style=\"background-color: #ffffff;\">\n" +
                    "                        <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\n" +
                    "                            <tr>\n" +
                    "                                <td style=\"padding: 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;\">\n" +
                    "                                    <h1 style=\"margin: 0 0 10px 0; font-family: sans-serif; font-size: 20px; line-height: 30px; color: #333333; font-weight: normal;\">Вам пришло сообщение с сайта от " + name + ":</h1>\n" +
                    "                                    <p style=\"margin: 0;\">" + message + "</p>\n" +
                    "                                </td>\n" +
                    "                            </tr>\n" +
                    "                            <tr>\n" +
                    "                                <td style=\"padding: 0 20px;\">\n" +
                    "                                    <table align=\"center\" role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"margin: auto;\">\n" +
                    "                                        <tr>\n" +
                    "                                            <td class=\"button-td button-td-primary\" style=\"border-radius: 4px; background: #222222;\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</td>\n" +
                    "                                        </tr>\n" +
                    "                                    </table>\n" +
                    "                                </td>\n" +
                    "                            </tr>\n" +
                    "                            <tr>\n" +
                    "                                <td style=\"padding: 20px; text-align: center; font-family: sans-serif; font-size: 18px; line-height: 20px; color: #555555;\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t     <a class=\"button-a button-a-primary\" href=\"mailto:" + email + "\" style=\"background: #222222; border: 1px solid #000000; font-family: sans-serif; font-size: 18px; line-height: 15px; text-decoration: none; padding: 13px 17px; color: #ffffff; display: block; border-radius: 4px;\">Ответить</a>\n" +
                    "                                </td>\n" +
                    "                            </tr>\n" +
                    "                        </table>\n" +
                    "                    </td>\n" +
                    "                </tr>\n" +
                    "\n" +
                    "            </table>\n" +
                    "\t        <table align=\"center\" role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"margin: auto;\">\n" +
                    "                <tr>\n" +
                    "                    <td style=\"padding: 20px; font-family: sans-serif; font-size: 12px; line-height: 15px; text-align: center; color: #ffffff;\">\n" +
                    "                        <a style=\"color: #ffffff; text-decoration: underline; font-weight: bold;\" href='https://designs.network'>Персональный сайт А.Тищенко</a>\n" +
                    "                        <br><br>\n" +
                    "                    </td>\n" +
                    "                </tr>\n" +
                    "            </table>\n" +
                    "        </div>\n" +
                    "    </center>\n" +
                    "</body>\n" +
                    "</html>",
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({msg: 'Success'}));
        } catch (e) {
            //console.log(e);
            if(e.path){
                res.statusCode = 422;
                res.end(JSON.stringify({
                    msg: e.errors[0]
                }));
            }else{
                res.statusCode = 403;
                res.end(e.code);
            }
        }

    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}