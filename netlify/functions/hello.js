exports.handler = async (event, context) => {
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}&tag=funny&rating=g`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "An error occurred" })
      }
    });
}