const Category = require("../models/categoryModel")
const Product = require("../models/productModel")
const async = require("async");
const { body, validationResult } = require("express-validator");

const category_index = (req, res, next) => {
  Category.find()
    .sort({ title: 1 })
    .exec((err, list) => {
      if (err) {
        return next(err)
      }
      res.render("categories/index", { title: `Categories`, categories: list, active: "categories" })
    })
}

const category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback)
      },
      category_products(callback) {
        Product.find({ category: req.params.id }).exec(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("categories/detail", {
        title: `Categories`,
        category: results.category,
        products: results.category_products,
        active: ""
      });
    }
  )
}

const category_create_get = (req, res) => {
  res.render("categories/create", { title: "Add new category", active: "", errors: [], category: {} })
}

const category_create_post = [
  body("title", "Title is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const newCategory = new Category(req.body)
    if (!errors.isEmpty()) {
      res.render("categories/create", {
        title: "Add new category",
        active: "",
        category: {},
        errors: errors.array(),
      });
      return;
    } else {
      Category.findOne({ title: req.body.title }).exec((err, found) => {
        if (err) {
          return next(err);
        }
        if (found) {
          res.redirect(found.url);
        } else {
          newCategory.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(newCategory.url);
          });
        }
      })
    }
  }
]

const category_update_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id)
          .exec(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("categories/create", {
        title: "Update category",
        category: results.category,
        active: "",
        errors: []
      })
    }
  )
};

const category_update_post = [
  body("title", "Title is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      ...req.body,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });
    if (!errors.isEmpty()) {
      res.render("categories/create", {
        title: "Update category",
        active: "",
        category: {},
        errors: errors.array(),
      });
      return;
    } else {
      Category.findByIdAndUpdate(req.params.id, category, {}, (err, theCategory) => {
        if (err) {
          return next(err);
        }
        // Successful: redirect to book detail page.
        res.redirect(theCategory.url);
      });
    }
  },
];

const category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_products(callback) {
        Product.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("categories/delete", {
        title: "Delete Category",
        active: "",
        category: results.category,
        products: results.category_products
      });
    }
  );
};

const category_delete_post = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_products(callback) {
        Product.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.category_products.length > 0) {
        res.render("categories/delete", {
          title: "Delete Categories",
          active: "",
          category: results.category,
          products: results.category_products
        });
        return;
      }
      // Author has no books. Delete object and redirect to the list of authors.
      Category.findByIdAndRemove(req.body.categoryId, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect("/categories");
      });
    }
  );
};

module.exports = {
  category_index,
  category_detail,
  category_create_get,
  category_create_post,
  category_update_get,
  category_update_post,
  category_delete_get,
  category_delete_post
}