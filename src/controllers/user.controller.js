import User from "../models/User.js";
import logger from "../utils/logger.js";

export async function createUser(data) {
  try {
    const newUser = new User(data);
    const userSaved = await newUser.save();
    return userSaved;
  } catch (error) {
    logger.error(error);
    throw 'Error creating user';
  }
}

export async function findUserById(id) {
  try {
    return await User.findById(id);
  } catch (error) {
    logger.error(error);
    throw 'User not found';
  }
}

export async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    logger.error(error);
    throw 'User not found';
  }
}
