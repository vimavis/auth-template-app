import mongoose from "mongoose";
import { MONGO } from "../config.js";
import logger from "./logger.js";

export const connect = async () => {
  const LOGIN = MONGO.USER ? `${MONGO.USER}:${MONGO.PASSWORD}@` : "";
  const URI = `mongodb://${LOGIN}${MONGO.HOST}:${MONGO.PORT}/${MONGO.DB}`;
  try {
    const URIlog = MONGO.PASSWORD ? URI.replace(MONGO.PASSWORD, "********") : URI;
    logger.info(`Connecting to ${URIlog} ... `);
    await mongoose.connect(URI);
    logger.info("Database is connected");
  } catch (error) {
    logger.error(error);
    throw new Error('Error connecting to database');
  }
};

export const disconnect = async () => {
  try {
    await mongoose.connection.close();
    logger.info("Database is disconnected");
  } catch (error) {
    logger.error(error);
    throw new Error('Error disconnecting to database');
  }
};