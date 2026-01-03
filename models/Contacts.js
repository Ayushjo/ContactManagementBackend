import mongoose from "mongoose";
import validator from "validator";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: "Please enter a valid email address",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      validate: {
        validator: function (v) {
          // Remove all non-digit characters
          const cleaned = v.replace(/\D/g, "");
          // Check if it's exactly 10 digits (Indian format)
          return /^[6-9]\d{9}$/.test(cleaned);
        },
        message:
          "Please enter a valid 10-digit Indian phone number starting with 6-9",
      },
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Contact = mongoose.model("Contact", contactSchema);
