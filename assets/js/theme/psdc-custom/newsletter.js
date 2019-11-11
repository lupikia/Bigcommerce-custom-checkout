
/*eslint-disable*/
import nod from '../common/nod';
import validation from '../common/form-validation';
import forms from '../common/models/forms';
import { classifyForm, Validators } from '../common/form-utils';

export default function () {

    function registerSubscribeValidation($subscribeForm, $errorMSG) {
        const subscribeModel = forms;

        const subscribeValidator = nod({
            submit: 'form[action="/subscribe.php"] input[type="submit"]',
        });

        subscribeValidator.add([
            {
                selector: 'form[action="/subscribe.php"] input[type="email"]',
                validate: (cb, val) => {
                    const result = subscribeModel.email(val);
                    if (!result) {
                        setTimeout(function(){
                        $('form[action="/subscribe.php"] .form-field-custom').removeClass('form-field--error');
                        $('form[action="/subscribe.php"] .form-inlineMessage').detach().insertAfter('.subscribeFormContent');
                        $('form[action="/subscribe.php"] .form-field-custom').addClass('form-field--error');
                    },100);
                    }
                    cb(result);
                },
                errorMessage: $errorMSG
            },

        ]);

        $subscribeForm.submit((event) => {
            subscribeValidator.performCheck();

            if (subscribeValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    const $subscribeForm = classifyForm('form[action="/subscribe.php"]');
    let $errorMSG = 'Please enter correct email';
    if ($subscribeForm.length) {
        if ($subscribeForm.data('error-message') != undefined && $subscribeForm.data('error-message') != '') {
            $errorMSG = $subscribeForm.data('error-message');
        }
        registerSubscribeValidation($subscribeForm, $errorMSG);
    }
}
/*eslint-enable*/
