import { ADMIN } from "../config.js";
import { registerUser } from "../controllers/auth.controller.js";
import { findUserByEmail } from "../controllers/user.controller.js";
import logger from "./logger.js";

export default async () => {
  console.info("----------------------------------------");
  let user;
  try {
    logger.info("### -> Creating admin user...");
    user = await registerUser(ADMIN.NAME, ADMIN.EMAIL, ADMIN.PASSWORD, true);
    logger.info("### -> Admin user created!");
  } catch (error) {
    logger.info("### -> User already exists! Checking if account is admin");
    user = await findUserByEmail(ADMIN.EMAIL);
    if (user.isAdmin === false) {
      user.isAdmin = true;
      await user.save();
      logger.info("### -> User updated! now is admin");
    } else {
      logger.info("### -> User is already admin!");
    }
  }
  logger.info(`Administrator user email: ${ADMIN.EMAIL}`);
  console.info("----------------------------------------");
};