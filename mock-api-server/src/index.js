const app = require("./app");
const { PORT = 8080 } = process.env;

app.listen(
  PORT,
  () =>
    console.log("************************************************************"),
  console.log(`Mock-API listening started on port ${PORT}`),
  console.log("************************************************************")
); // eslint-disable-line no-console
