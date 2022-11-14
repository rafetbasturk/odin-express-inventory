var express = require('express');
var router = express.Router();
const {
  category_index,
  category_detail,
  category_create_get,
  category_create_post,
  category_update_get,
  category_update_post,
  category_delete_get,
  category_delete_post
} = require("../controllers/categoryController")

router.route("/")
  .get(category_index)

router.route("/create")
  .get(category_create_get)
  .post(category_create_post)

router.route("/:id/update")
  .get(category_update_get)
  .post(category_update_post)

router.route("/:id/delete")
  .get(category_delete_get)
  .post(category_delete_post)

router.route("/:id")
  .get(category_detail)

module.exports = router;
