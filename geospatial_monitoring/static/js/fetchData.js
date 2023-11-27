var endpointUrl = '/get-sensor-data';
var csrfToken = getCookie('csrftoken');
var endpointUrl = '/get-sensor-data';

fetch(endpointUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  },
})
  .then(response => response.json())
  .then(data => {
    handleInitialSensorData(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }