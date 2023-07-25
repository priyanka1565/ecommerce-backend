const { param } = require("express/lib/request");
const Product = require("../models/productModels");
const ErorroHandler = require("../utils/errorHandller");
const catchAsyncErrors = require("../midddleware/catchAsyncerror");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
// create product admin 
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

let images = [];

if (typeof req.body.images === "string") {
  images.push(req.body.images);
} else {
  images = req.body.images;
}

const imagesLinks = [];

for (let i = 0; i < images.length; i++) {
  const result = await cloudinary.v2.uploader.upload(images[i], {
    folder: "products",
  });

  imagesLinks.push({
    public_id: result.public_id,
    image_url: result.secure_url,
  });
}

req.body.images = imagesLinks;
req.body.user = req.user.id;

  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(200).json({
    sucsess: true,
    product,
  });
});

// import in router get all product use find method cacthasyncerror function coming
// from middle ware to handle try catch block

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  // export apifeatures class here
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apifeatures = new ApiFeatures(Product.find(), req.query)
    .Search()
    .Filter()
    .pagination(resultPerPage);
  // search product with advance searh operation
  console.log(productsCount);
  const products = await apifeatures.query;
  return res.status(200).json({
    succsess: true,
    products,
    productsCount,
    resultPerPage,
  });
});

// find product by admin
exports.getAdminProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find();

  return res.status(200).json({
    succsess: true,
    products,
  });
});

exports.findProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  // if product not found
  if (!product) {
    return next(new ErorroHandler("product not found ", 404));
  }

  res.status(200).json({
    sucsess: true,
    product,
  });
});

// update route ---admin route  export this function to the route cacthasyncerror function coming
// from middle ware to handle try catch block
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req.params.id);

  // if product not found
  if (!product) {
    return next(new ErorroHandler("product not found ", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        image_url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  // if product found

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // send sucsess status

  res.status(200).json({
    sucsess: true,
    product,
  });
});

// delete product route export route cacthasyncerror function coming
// from middle ware to handle try catch block
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  // if product not found
  if (!product) {
    return next(new ErorroHandler("product not found ", 404));
  }

 // delete product image from cloudinary
  for (let i = 0; i < product.images.length; i++){
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(200).json({
    sucsess: true,
    message: "Product Deleted Succsessfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numberofReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErorroHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErorroHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
