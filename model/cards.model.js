const mongoose = require("mongoose");
const Joi = require("joi");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  subtitle: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  phone: {
    type: Number,
    min: 2,
    required: true,
  },
  email: {
    type: String,
    minlength: 6,
    maxlength: 255,
    required: true,
  },
  web: {
    type: Number,
    minlength: 6,
    maxlength: 1024,
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
    zip: {
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
  createdAt:{
    type: Date,
    default: Date.now,
  },
 
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Card = mongoose.model("Card", cardSchema, "cards");

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    subtitle: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(255).required(),
    url: Joi.string().min(11).max(1024).allow(""),
    alt: Joi.string().min(2).max(255).allow(""),
    phone: Joi.number().min(10).required(),
    email: Joi.string()
      .min(6)
      .max(255)
      .email({ tlds: { allow: true } })
      .required(),
    web: Joi.string().min(6).max(1024),
    country: Joi.string().min(2).max(255).required(),
    state: Joi.string().min(2).max(255).required(),
    city: Joi.string().min(2).max(255).required(),
    street: Joi.string().min(2).max(255).required(),
    houseNumber: Joi.number().min(2).required(),
    zip: Joi.number().min(2).required(),
  }).required();

  return schema.validate(card);
}

module.exports = {
  Card,
  validateCard,
};
