const express = require("express");

const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    findProductDetails,
    createProductReview,
    getProductReviews,
    deleteReview,
    getAdminProducts
      } = require("../controllers/productcontroller");
const { isuserAuth, authoriseRole } = require("../midddleware/auth");

const router = express();

// get request
router.route("/products").get(getAllProducts);

// post request admin route 
router
  .route("/admin/products/new")
  .post(isuserAuth, authoriseRole("admin"), createProduct);

router
  .route("/admin/products")
  .get(isuserAuth, authoriseRole("admin"), getAdminProducts);
// update request admin route same route so use delete findetails samne here aswell 

router
  .route("/products/:id")
  .put(isuserAuth, authoriseRole("admin"), updateProduct)
  .delete(isuserAuth, authoriseRole("admin"), deleteProduct)
  .get(findProductDetails);

  // create review
router.route("/review").put(isuserAuth, createProductReview);
// get all review and delete review

router.route("/reviewes")
  .get(getProductReviews)
  .delete(isuserAuth, deleteReview)


module.exports = router;
