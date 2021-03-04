
const app2 = require('./server');
const db = require("../models/index");
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    console.log("Running migrations");
    //await db.migrate.latest();
    app2.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
  } catch {
    process.exit(-1);
  }
})();
