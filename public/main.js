document.addEventListener('DOMContentLoaded', () => {
  const newDiv = document.createElement("div");

  fetch(`${document.location}.netlify/functions/hello`)
    .then(response => response.json())
    .then(data => {
      const width = data.data.data.images.original.width;
      const height = data.data.data.images.original.height;
      const url = data.data.data.images.original.url;
      const alt = data.data.data.title;
      newDiv.innerHTML = `
        <center><img width="${width}" height="${height}" src="${url}" alt="${alt}"></center>
      `;
      document.body.appendChild(newDiv);
    })
    .catch(error => console.error('Error:', error));
});