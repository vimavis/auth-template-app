import app from "./app.js";
import { connect } from "./utils/database.js";
import logger from "./utils/logger.js";
import initialSetup from "./utils/initialSetup.js";

async function __main() {
  await connect();
  await initialSetup();
  const PORT = app.get('port');
  app.listen(PORT, () => {
    logger.info(`App is listening on http://localhost:${PORT}`);
  });
}

__main();
