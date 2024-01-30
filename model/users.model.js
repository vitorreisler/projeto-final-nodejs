const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
      first: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
      },
      middle: {
        type: String,
        minlength: 2,
        maxlength: 255,
      },
      last: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
      },
    },
    isBusiness: {
      type: Boolean,
      default: false,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Number,
      minlength: 10,
      required: true,
    },
    email: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 255,
      required: true,
    },
    address: {
      type: Object,
      required: true,
      country: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
      },
      state: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
      },
      city: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
      },
      street: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
      },
      houseNumber: {
        type: Number,
        minlength: 2,
        required: true,
      },
    },
    image: {
      type: Object,
      required: true,
      url: {
        type: String,
        minlength: 11,
        maxlength: 1024,
        required: true,
      },
      alt: {
        type: String,
        minlength: 2,
        maxlength: 255,
        default: "User profile image",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    methods: {
      generateAuthToken() {
        return jwt.sign(
          {
            _id: this._id,
            isBusiness: this.isBusiness,
            isAdmin: this.isAdmin,
          },
          process.env.JWT_SECRET,
        );
      },
    },
  }
);

const User = mongoose.model("User", userSchema, "users");

function validateUser(user) {
  const schema = Joi.object({
    first: Joi.string().min(2).max(255).required(),
    middle: Joi.string().min(2).max(255).allow(""),
    last: Joi.string().min(2).max(255).required(),
    isBusiness: Joi.boolean().required(),
    phone: Joi.number().min(10).required(),
    url: Joi.string().min(11).max(1024).allow(""),
    alt: Joi.string().min(2).max(255).allow(""),
    email: Joi.string()
      .min(6)
      .max(255)
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().min(8).max(255).required(),
    country: Joi.string().min(2).max(255).required(),
    state: Joi.string().min(2).max(255).required(),
    city: Joi.string().min(2).max(255).required(),
    street: Joi.string().min(2).max(255).required(),
    houseNumber: Joi.number().min(2).required(),
  }).required();

  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .max(255)
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().min(8).max(255).required(),
  }).required();
  return schema.validate(user);
}

module.exports = {
  User,
  validateUser,
  validateLogin,
};
