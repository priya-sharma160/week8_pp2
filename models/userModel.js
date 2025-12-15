const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    phone_number: {
      type: String,
      required: [true, "Please add a phone number"],
      match: [/^\d{10,}$/, "Phone number must be at least 10 digits"],
    },
    gender: {
      type: String,
      required: [true, "Please specify gender"],
      enum: ["Male", "Female", "Other"],
    },
    date_of_birth: {
      type: Date,
      required: [true, "Please provide date of birth"],
    },
    membership_status: {
      type: String,
      required: [true, "Please provide membership status"],
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// static signup method
userSchema.statics.signup = async function (
  name,
  email,
  password,
  phone_number,
  gender,
  date_of_birth,
  membership_status = "Active"
) {
  // Validation
  if (!name || !email || !password || !phone_number || !gender || !date_of_birth) {
    throw new Error("Please add all fields");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Email not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password not strong enough");
  }

  if (!/^\d{10,}$/.test(phone_number)) {
    throw new Error("Phone number must be at least 10 digits");
  }

  if (!["Male", "Female", "Other"].includes(gender)) {
    throw new Error("Gender must be Male, Female, or Other");
  }

  const dob = new Date(date_of_birth);
  if (isNaN(dob.getTime())) {
    throw new Error("Invalid date of birth");
  }

  if (!["Active", "Inactive", "Suspended"].includes(membership_status)) {
    throw new Error("Membership status must be Active, Inactive, or Suspended");
  }

  const userExists = await this.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hashedPassword,
    phone_number,
    gender,
    date_of_birth: dob,
    membership_status,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema)