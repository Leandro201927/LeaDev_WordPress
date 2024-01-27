import { DialogController } from "../../../../global/controllers/dialog-controller";
import axios from 'axios';

export default function HomepageController() {
  /**
   * 1. Key
   * 
   * @description Obtener el ID del key generado desde PHP extrayendo el src="" único de este script invocado.
   */
  const srcScript = new URL(document.currentScript.src); // import.meta.url equivalent when using module scripts. (<script type="module">)
  const queryParams = new URLSearchParams(srcScript.search);
  const uniqueId = queryParams.get('key');
  const templateUrl = queryParams.get('templateUrl');
  const componentName = queryParams.get('componentName');

  /**
   * 2. Global (component-scope) variables
   * 
   * @description Crear controles y lógica sólo para el contenedor con el id único
   */
  const parentEl = document.getElementById(uniqueId)

  /**
   * 
   * @param {HTMLFormElement} formEl 
   * @param {'error'|'success'} type 
   * @param {string} message
   */
  function printFormState(formEl, type, message) {
    const spanStatusEl = formEl.querySelector('.status-send-form')
    if(type === 'error') spanStatusEl.style.color = '#ff5555'
    else spanStatusEl.style.color = 'var(--main-color)';
      
    spanStatusEl.style.display = 'block'
    spanStatusEl.innerHTML = message
  }
  function resetFormState(formEl) {
    const spanStatusEl = formEl.querySelector('.status-send-form')
    spanStatusEl.style.display = 'none'
    spanStatusEl.innerHTML = ''
  }

  function isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function isPhone(phone) {
    const phoneRegex = /^([+]\d{2})?\d{10}$/;
    return phoneRegex.test(phone);
  }

  /**
   * HubSpot logic (creates an instance while it is created)
   */
  const onOpenHubSpotDialog = () => {
    // Obtén el formulario usando su ID
    const form = document.getElementById('myForm');
    const sendBtn = document.getElementById('send-hubspot-button')

    if(form && sendBtn) {
      // Añade un event listener para el evento 'submit'
      form.addEventListener('submit', function(event) {

        // Previene el comportamiento por defecto del formulario
        event.preventDefault();
        event.stopPropagation();

        /**
         * -------- HubSpot sumbit --------
         */
        // Crea un objeto FormData a partir del formulario
        let formData = new FormData(form);
        
        // Convierte los datos del formulario a JSON y hacer la verificación
        let data = {};
        let canSendForm = true;

        // Validacion de campos
        // Validacion checkbox de politica y privacidad
        const privacyCheckbox = form.querySelector('#privacy');
        if (!privacyCheckbox.checked) {
          // El checkbox de privacidad NO está marcado
          printFormState(form, 'error', 'Debes estar de acuerdo con nuestras políticas de privacidad para poder enviar este formulario.')
          canSendForm = false;
        }
        for (let [key, value] of formData) {
          if(key === 'firstname') {
            if (!value || value.length < 3) {
              canSendForm = false;
              printFormState(form, 'error', 'Por favor ingresa un nombre válido.');
              break;
            }
          } else if(key === 'email') {
            if (!isEmail(value)) {
              printFormState(form, 'error', 'Por favor ingresa un correo electrónico válido.');
              canSendForm = false;
              break;
            }
          } else if(key === 'phone') {
            if (!isPhone(value)) {
              printFormState(form, 'error', 'Por favor ingresa un teléfono válido.');
              canSendForm = false;
              break;
            }
          }
          data[key] = value;
        }

        if(canSendForm) {
          sendBtn.value = 'Enviando...'
          sendBtn.disabled = true
          resetFormState(form)

          grecaptcha.ready(function() {
            grecaptcha.execute('6LdI3VwpAAAAACB6gDxDmPzz8SHlQA8tO5soMHwf', { action: 'submit' }).then(function(token) {
              // Realiza una solicitud AJAX al backend
              const options = {
                url: 'https://dum7n8gccb.execute-api.us-east-1.amazonaws.com/dev/sendForm',
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json;charset=UTF-8'
                },
                data: {
                  formData: data,
                  token: token
                }
              };
              try {
                axios(options).then(response => {
                  if(response.status !== 200) {
                    printFormState(form, 'error', 'Ocurrió un error durante el envío del formulario, inténtalo otra vez o contáctanos por WhatsApp.')
                    sendBtn.value = 'Enviar'
                    sendBtn.disabled = false
                    setTimeout(() => resetFormState(form), 5000)
                  } else {
                    printFormState(form, 'success', 'Tus datos se enviaron correctamente. Nos contactaremos contigo pronto.')
                    sendBtn.value = 'Enviar'
                    sendBtn.disabled = true
                  }
                });
              } catch(e) {
                printFormState(form, 'error', 'Ocurrió un error durante el envío del formulario, inténtalo otra vez o contáctanos por WhatsApp.')
                sendBtn.value = 'Enviar'
                sendBtn.disabled = false
                setTimeout(() => resetFormState(form), 5000)
              }
            });
          });
        }
      });
    } 
  }

  /**
   * ------------------ Dialog Logic -------------------
   */
  // Contact Us (HubSpot form + WhatsApp CTA)
  const dialogContactUsContainer = document.createElement('div')
  dialogContactUsContainer.className = 'dialog-supercontainer-render'
  dialogContactUsContainer.id = 'dialog-form-hubspot'
  dialogContactUsContainer.innerHTML = `
    <div class="dialog-container-render">
      <div class="close-header">
        <svg id="close" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
      </div>
      <h2> ¿Listo para el cambio? <br> <span class="gradient-green-blue"> Solo un clic te separa. </span> </h2>
      <div class="form-content-container">
        <form id="myForm" method="POST" name="Form">
          <div class="input-container">
            <label for="firstname">Nombre completo*</label><br>
            <input type="text" id="firstname" name="firstname" placeholder="Tu nombre completo"><br>
          </div>
          <div class="input-container">
            <label for="email">Correo electrónico*</label><br>
            <input type="email" id="email" name="email" placeholder="someone@example.com"><br>
          </div>
          <div class="input-container">
            <label for="phone">Numero de teléfono*</label><br>
            <input type="tel" id="phone" name="phone" placeholder="+57 321 987 6543"><br>
          </div>
          <div class="input-container" style="display: none">
            <input type="text" id="origen" name="origen" value="contact_us">
          </div>
          <div class="privacy-agreement">
            <input type="checkbox" id="privacy" name="privacy" value="1">
            <label for="privacy"> He leído y acepto la <a href="#" rel="nofollow"> <span class="green"> política de privacidad. </span> </a> </label>
          </div>
          <span class="status-send-form"></span>
          <input id="send-hubspot-button" type="submit" class="fill primary" data-sitekey="6LdI3VwpAAAAACB6gDxDmPzz8SHlQA8tO5soMHwf" value="Enviar">
          <span class="recaptcha-advertisement">
            This site is protected by reCAPTCHA and the Google
            <a rel="nofollow" target="_blank" href="https://policies.google.com/privacy">Privacy Policy</a> and
            <a rel="nofollow" target="_blank" href="https://policies.google.com/terms">Terms of Service</a> apply.
          </span>
        </form>
        <div class="preferred-channel">
          <h3> ¿Prefieres contactarnos? </h3>
          <p> Ac proin neque ut feugiat adipiscing in at ullamcorper integer commodo nisl enim risus mollis mattis nascetur ornare scelerisque ut. </p>
          <a target="_blank" rel="nofollow" href="https://wa.me/573052933256" class="fill primary"> 
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M15.8818 11.9912L12.9316 10.5161C12.8155 10.4582 12.6862 10.432 12.5567 10.4401C12.4272 10.4482 12.3021 10.4903 12.1941 10.5622L10.8398 11.4657C10.2181 11.1239 9.70647 10.6123 9.3647 9.99057L10.2682 8.63626C10.3401 8.52824 10.3822 8.40317 10.3903 8.27368C10.3984 8.14418 10.3722 8.01484 10.3143 7.89872L8.8392 4.94855C8.77806 4.82508 8.68356 4.7212 8.5664 4.64869C8.44924 4.57618 8.31412 4.53794 8.17634 4.53829C7.1983 4.53829 6.26031 4.92682 5.56873 5.6184C4.87715 6.30998 4.48863 7.24796 4.48863 8.226C4.49107 10.3769 5.34661 12.4391 6.86755 13.96C8.3885 15.481 10.4506 16.3365 12.6016 16.339C13.0859 16.339 13.5654 16.2436 14.0128 16.0583C14.4602 15.8729 14.8668 15.6013 15.2092 15.2589C15.5516 14.9164 15.8233 14.5099 16.0086 14.0625C16.1939 13.6151 16.2893 13.1355 16.2893 12.6513C16.2894 12.5142 16.2513 12.3799 16.1793 12.2633C16.1074 12.1467 16.0043 12.0525 15.8818 11.9912ZM12.6016 14.8639C10.8417 14.8619 9.15448 14.162 7.91006 12.9175C6.66564 11.6731 5.96566 9.98588 5.96371 8.226C5.96357 7.71444 6.14069 7.21864 6.46493 6.82296C6.78917 6.42728 7.2405 6.15618 7.74211 6.05579L8.80048 8.17622L7.89976 9.5167C7.83245 9.61766 7.79109 9.73368 7.77935 9.85445C7.76761 9.97522 7.78585 10.097 7.83246 10.2091C8.36016 11.4632 9.35789 12.461 10.6121 12.9887C10.7244 13.0373 10.8472 13.0573 10.9692 13.0467C11.0912 13.036 11.2086 12.9952 11.3109 12.9278L12.6578 12.0299L14.7783 13.0882C14.6771 13.5904 14.4048 14.042 14.0078 14.3658C13.6109 14.6896 13.1139 14.8656 12.6016 14.8639ZM10.389 0.850586C8.73361 0.850225 7.10636 1.27844 5.66561 2.09355C4.22485 2.90867 3.01967 4.08291 2.16738 5.50198C1.31508 6.92106 0.844695 8.53662 0.802016 10.1914C0.759337 11.8462 1.14581 13.4839 1.92383 14.945L0.877441 18.0842C0.790766 18.3441 0.778187 18.623 0.841115 18.8896C0.904043 19.1563 1.03999 19.4001 1.23372 19.5939C1.42745 19.7876 1.67131 19.9235 1.93796 19.9865C2.20461 20.0494 2.48352 20.0368 2.74342 19.9501L5.88258 18.9038C7.16846 19.5877 8.59325 19.9697 10.0488 20.0208C11.5043 20.0718 12.9524 19.7906 14.2831 19.1985C15.6137 18.6064 16.792 17.7189 17.7284 16.6034C18.6649 15.488 19.3349 14.1738 19.6876 12.7607C20.0404 11.3476 20.0665 9.87275 19.7642 8.44804C19.4618 7.02332 18.8388 5.68622 17.9425 4.53822C17.0462 3.39021 15.9002 2.46149 14.5914 1.82253C13.2826 1.18358 11.8454 0.851184 10.389 0.850586ZM10.389 18.5516C8.96272 18.5526 7.5615 18.177 6.32695 17.4628C6.23656 17.4104 6.13607 17.3778 6.03212 17.3671C5.92817 17.3565 5.82315 17.368 5.72401 17.401L2.276 18.5516L3.42565 15.1036C3.45879 15.0045 3.4705 14.8995 3.46001 14.7956C3.44952 14.6916 3.41707 14.5911 3.3648 14.5006C2.4705 12.9545 2.11145 11.1564 2.34333 9.38538C2.57522 7.61434 3.38508 5.96933 4.64728 4.70552C5.90949 3.44172 7.55348 2.62979 9.32422 2.39566C11.095 2.16154 12.8935 2.51833 14.4408 3.41067C15.988 4.30301 17.1976 5.68103 17.8818 7.33095C18.566 8.98087 18.6866 10.8105 18.2248 12.5359C17.7631 14.2614 16.7448 15.7862 15.328 16.8739C13.9113 17.9616 12.1751 18.5513 10.389 18.5516Z" fill="black"/> </svg>
            <span> Contáctanos por WhatsApp </span>
          </a>
        </div>
      </div>
    </div>
  `
  const buttonsContactUsTrigger = document.querySelectorAll('#dialog-form-hubspot-trigger')
  const dialogContactUsController = new DialogController(dialogContactUsContainer, buttonsContactUsTrigger, onOpenHubSpotDialog)

  // Under Construction
  const onOpenUnderConstructionDialog = () => {
    // Obtén el formulario usando su ID
    const form = document.getElementById('under-construction-form');
    const sendBtn = document.getElementById('send-underconstruction-button')

    if(form && sendBtn) {
      // Añade un event listener para el evento 'submit'
      form.addEventListener('submit', function(event) {

        // Previene el comportamiento por defecto del formulario
        event.preventDefault();
        event.stopPropagation();

        /**
         * -------- HubSpot sumbit --------
         */
        // Crea un objeto FormData a partir del formulario
        let formData = new FormData(form);
        
        // Convierte los datos del formulario a JSON y hacer la verificación
        let data = {};
        let canSendForm = true;

        // Validacion de campos
        // Validacion checkbox de politica y privacidad
        const privacyCheckbox = form.querySelector('#privacy2');
        if (!privacyCheckbox.checked) {
          // El checkbox de privacidad NO está marcado
          printFormState(form, 'error', 'Debes estar de acuerdo con nuestras políticas de privacidad para poder enviar este formulario.')
          canSendForm = false;
        }
        for (let [key, value] of formData) {
          if(key === 'email') {
            if (!isEmail(value)) {
              printFormState(form, 'error', 'Por favor ingresa un correo electrónico válido.');
              canSendForm = false;
              break;
            }
          }
          data[key] = value;
        }

        if(canSendForm) {
          sendBtn.value = 'Enviando...'
          sendBtn.disabled = true
          resetFormState(form)

          grecaptcha.ready(function() {
            grecaptcha.execute('6LdI3VwpAAAAACB6gDxDmPzz8SHlQA8tO5soMHwf', { action: 'submit' }).then(function(token) {
              // Realiza una solicitud AJAX al backend
              const options = {
                url: 'https://dum7n8gccb.execute-api.us-east-1.amazonaws.com/dev/sendForm',
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json;charset=UTF-8'
                },
                data: {
                  formData: data,
                  token: token
                }
              };
              axios(options).then(response => {
                if(response.status !== 200) {
                  printFormState(form, 'error', 'Ocurrió un error durante el envío del formulario, inténtalo otra vez o <a href="#" rel="nofollow"> contáctanos por WhatsApp. </a>')
                  sendBtn.value = 'Enviar'
                  sendBtn.disabled = false
                  setTimeout(() => resetFormState(form), 5000)
                } else {
                  printFormState(form, 'success', 'Tus datos se enviaron correctamente. Nos contactaremos contigo pronto.')
                  sendBtn.value = 'Enviar'
                  sendBtn.disabled = true
                }
              }).catch(e => {
                printFormState(form, 'error', 'Ocurrió un error durante el envío del formulario, inténtalo otra vez o <a href="#" rel="nofollow"> contáctanos por WhatsApp. </a>')
                sendBtn.value = 'Enviar'
                sendBtn.disabled = false
                setTimeout(() => resetFormState(form), 5000)
              })
            });
          });
        }
      });
    }
  }
  
  const dialogUnderConstructionContainer = document.createElement('div')
  dialogUnderConstructionContainer.className = 'dialog-supercontainer-render'
  dialogUnderConstructionContainer.id = 'dialog-form-underconstruction'
  dialogUnderConstructionContainer.innerHTML = `
    <div class="dialog-container-render" style="display: flex; opacity: 1">
      <div class="close-header">
        <svg id="close" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
      </div>
      <div class="form-content-container">
        <div class="image-container">
          <img src="${templateUrl}/assets/img/homepage/gear.webp"/>
        </div>
        <form id="under-construction-form" method="POST" name="Form">
          <h2> ¡Próximamente! </h2>
          <p class="description"> Suscríbete y <span class="green"> serás de los primeros </span> en saber en cuanto este servicio esté disponible para ti. </p>
          <div class="row-container">
            <div class="input-container">
              <label for="email">Correo electrónico*</label><br>
              <input type="email" id="email" name="email" placeholder="someone@example.com"><br>
            </div>
            <input id="send-underconstruction-button" type="submit" class="fill primary" data-sitekey="6LdI3VwpAAAAACB6gDxDmPzz8SHlQA8tO5soMHwf" value="Enviar">
          </div>
          <div class="input-container" style="display: none">
            <input type="text" id="origen" name="origen" value="subscribe_under_maintenance">
          </div>
          <div class="privacy-agreement">
            <input type="checkbox" id="privacy2" name="privacy2" value="1">
            <label for="privacy2"> He leído y acepto la <a href="#" rel="nofollow"> <span class="green"> política de privacidad. </span> </a> </label>
          </div>
          <span class="status-send-form"></span>
          <span class="recaptcha-advertisement">
            This site is protected by reCAPTCHA and the Google
            <a rel="nofollow" target="_blank" href="https://policies.google.com/privacy">Privacy Policy</a> and
            <a rel="nofollow" target="_blank" href="https://policies.google.com/terms">Terms of Service</a> apply.
          </span>
        </form>
      </div>
    </div>
  `
  const buttonsUnderConstructionTrigger = document.querySelectorAll('#dialog-form-underconstruction-trigger')
  const dialogUnderConstructionController = new DialogController(dialogUnderConstructionContainer, buttonsUnderConstructionTrigger, onOpenUnderConstructionDialog)
}