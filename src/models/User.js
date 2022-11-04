import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";
import { Schema, model } from "mongoose";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false,
});

UserSchema.methods.comparePassword = async function (password) {
  return await bycrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
  this.lastLogin = Date.now();
  return token;
};

UserSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bycrypt.hash(this.password, 10);
  }
  next();
});

export default model("User", UserSchema);
