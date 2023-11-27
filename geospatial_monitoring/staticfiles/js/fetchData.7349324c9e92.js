var endpointUrl = '/get-sensor-data';

// Get the CSRF token from the cookie
var csrfToken = getCookie('csrftoken');
var data = [];
// Make a POST request with the CSRF token in the headers
fetch(endpointUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  },
  // Other options, like body for the request payload
})
  .then(response => response.json())
  .then(data => {
    // Handle the retrieved data
    data = data;
    console.log(data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
  });

// Function to get a cookie value by name
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

