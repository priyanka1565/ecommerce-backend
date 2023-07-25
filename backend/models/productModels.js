const mongoose = require("mongoose");
// product models 
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter name of the product"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "please enter name of the product"],
  },
  price: {
    type: Number,
    required: [true, "please enter price of the product"],
    maxlength: [8, "price of the product below 8 fig"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      image_url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "please enter category of the product"],
  },
  stock: {
    type: Number,
    required: [true, "please enter stock of the product"],
    maxlength: [4, "price of the product below 4 fig"],
    default: 1,
  },
  numberofReviews: {
    type: Number,
    default: 1,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// export product model schema to controllers 

module.exports = mongoose.model("products", productSchema);