export default function HomepageController() {
  // document.addEventListener('DOMContentLoaded', () => {
  //   // Obtén el formulario usando su ID
  //   const form = document.getElementById('myForm');
  
  //   // Añade un event listener para el evento 'submit'
  //   form.addEventListener('submit', function(event) {
  //     // Previene el comportamiento por defecto del formulario
  //     event.preventDefault();
  
  //     // Crea un objeto FormData a partir del formulario
  //     var formData = new FormData(form);
  
  //     // Convierte los datos del formulario a JSON
  //     var data = {};
  //     formData.forEach(function(value, key){
  //       data[key] = value;
  //     });
  
  //     // Prepara los datos para enviar a la API de HubSpot
  //     var json_value = {
  //       "fields": data,
  //       "skipValidation": false
  //     };
  
  //     // Crea una solicitud HTTP
  //     var xhr = new XMLHttpRequest();
  //     xhr.open('POST', 'https://api.hubapi.com/contacts/v1/contact/', true);
  //     xhr.setRequestHeader('Content-Type', 'application/json');
  
  //     // Envía la solicitud
  //     xhr.send(JSON.stringify(json_value));
  
  //     // Maneja la respuesta
  //     xhr.onload = function () {
  //       if (xhr.status >= 200 && xhr.status < 300) {
  //         // La solicitud fue exitosa
  //         console.log('La solicitud fue exitosa: ', xhr.responseText);
  //       } else {
  //         // Hubo un error
  //         console.log('Hubo un error: ', xhr.responseText);
  //       }
  //     };
  //   });
  // })
}