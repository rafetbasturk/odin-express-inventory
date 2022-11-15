var express = require('express');
var router = express.Router();
const {
  product_index,
  product_detail,
  product_create_get,
  upload,
  product_create_post,
  product_delete_get,
  product_delete_post,
  product_update_get,
  product_update_post
} = require("../controllers/productController")

/* GET home page. */
router.get('/', product_index);

router.route("/create")
.get(product_create_get)
.post(upload, product_create_post)

router.route("/:id/update")
.get(product_update_get)
.post(upload, product_update_post)

router.route("/:id/delete")
.get(product_delete_get)
.post(product_delete_post)

router.get('/:id', product_detail);

module.exports = router;
