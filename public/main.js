fetch('https://jamesbrattin.dev/.netlify/functions/hello')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));