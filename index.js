// require your server and launch it
const server = require("./api/server");

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
