const express = require("express");

const {
    newOrder,
    getSingleOrder,
    myOrders, 
    getAllOrders,
    updateOrder,
    deleteOrders} =
    require("../controllers/orderController");

const router = express.Router();

const { isuserAuth, authoriseRole } = require("../midddleware/auth");

/// craete order  
router.route("/order/new").post(isuserAuth, newOrder);

//  get user orders 
router.route("/order/:id")
    .get(isuserAuth,getSingleOrder);

// my orders 
router.route("/orders/me").get(isuserAuth, myOrders);

// admin route get all orders 
router.route("/admin/orders")
    .get(isuserAuth, authoriseRole("admin"), getAllOrders);

// admin can only update order and delete order 

router
  .route("/admin/order/:id")
  .put(isuserAuth, authoriseRole("admin"), updateOrder)
  .delete(isuserAuth, authoriseRole("admin"), deleteOrders);
  

module.exports = router;