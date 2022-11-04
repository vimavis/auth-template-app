import { StatusCodes as HTTP_CODE } from 'http-status-codes';
import emailValidator from "email-validator";
import PasswordValidator from "password-validator";

import { createUser, findUserByEmail } from "./user.controller.js";

function validEmail(email) {
  return emailValidator.validate(email);
}

function validPassword(password) {
  const schema = new PasswordValidator();
  schema
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces();
  const isValidPassword = schema.validate(password, { details: true });
  return isValidPassword;
}

async function registerParametersErrors(name, email, password) {
  const result = {
    status: HTTP_CODE.OK,
    errors: []
  };

  if (!name || !email || !password) {
    result.errors.push('All fields are required');
    !name && result.errors.push('Name is required');
    !email && result.errors.push('Email is required');
    !password && result.errors.push('Password is required');
    result.status = HTTP_CODE.BAD_REQUEST;
    return result;
  }

  const passwordErrors = validPassword(password);
  if (password && passwordErrors.length > 0) {
    result.errors.push('Invalid password');
    passwordErrors.forEach(error => {
      result.errors.push(error.message);
    });
    result.status = HTTP_CODE.BAD_REQUEST;
    return result;
  }

  if (email && !validEmail(email)) {
    result.errors.push('Invalid email');
    result.status = HTTP_CODE.BAD_REQUEST;
    return result;
  }

  const user = await findUserByEmail(email);
  if (user) {
    result.errors.push('Email already exists');
    result.status = HTTP_CODE.BAD_REQUEST;
    return result;
  }

  return result;
}

export async function registerUser(name, email, password, isAdmin = false) {
  const validInput = await registerParametersErrors(name, email, password);
  if (validInput.status !== HTTP_CODE.OK) {
    throw validInput;
  }
  const userSaved = await createUser({ name, email, password, isAdmin });
  return userSaved;
}

export async function registerRequest(req, res) {
  const { name, email, password } = req.body;
  try {
    const userSaved = await registerUser(name, email, password);
    const token = userSaved.generateToken();
    return res.status(HTTP_CODE.CREATED).json({ token });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ errors: error.errors });
    }
    return res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error
    });
  }
}

async function loginParametersErrors(email, password) {
  const result = {
    status: HTTP_CODE.OK,
    errors: []
  };

  if (!email || !password) {
    result.errors.push('All fields are required');
    !email && result.errors.push('Email is required');
    !password && result.errors.push('Password is required');
    result.status = HTTP_CODE.BAD_REQUEST;
    return result;
  }

  if (email && !validEmail(email)) {
    result.errors.push('Invalid email');
    result.status = HTTP_CODE.BAD_REQUEST;
    return result;
  }

  return result;
}

async function loginUser(email, password) {
  const validInput = await loginParametersErrors(email, password);
  if (validInput.status !== HTTP_CODE.OK) {
    throw validInput;
  }
  const user = await findUserByEmail(email);
  if (!user) {
    validInput.status = HTTP_CODE.NOT_FOUND;
    validInput.errors.push('User not found');
    throw validInput;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    validInput.status = HTTP_CODE.FORBIDDEN;
    validInput.errors.push('Wrong password');
    throw validInput;
  }
  return user;
}

export async function loginRequest(req, res) {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    const token = user.generateToken();
    return res.status(HTTP_CODE.OK).json({ token });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ errors: error.errors });
    }
    return res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error
    });
  }
};
