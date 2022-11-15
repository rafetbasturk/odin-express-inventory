const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const async = require("async");
const { body, validationResult } = require("express-validator");
const multer = require('multer')

// multer functions
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage }).single("image")


// controller functions
const product_index = (req, res, next) => {
  async.parallel(
    {
      products(callback) {
        Product.find().sort({ createdAt: -1 }).exec(callback)
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("products/index", {
        title: "All Products",
        active: "products",
        products: results.products,
        categories: results.categories
      });
    }
  );
}

const product_detail = (req, res) => {
  Product.findById(req.params.id)
    .populate("category")
    .then(result => {
      res.render("products/detail", {
        title: "Product details",
        active: "",
        product: result
      })
    })
    .catch(error => {
      res.status(error.status || 500);
      res.render("error", {
        title: "Product not found",
        active: "",
        error,
      })
    })
}

const product_create_get = (req, res, next) => {
  async.parallel(
    {
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("products/create", {
        title: "Add new product",
        active: "",
        errors: [],
        product: { category: [{ _id: "" }] },
        categories: results.categories
      })
    }
  );
}

const product_create_post = [
  body("title", "Product title required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Product description required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("stock", "Product stock required and should be numeric")
    .trim()
    .isNumeric()
    .escape(),
  body("category.*").escape(),
  body("image")
    .custom((value, { req }) => {
      if (!req.file) throw new Error("Image required");
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("products/create", {
            title: "Add new product",
            active: "",
            product: { category: [{ _id: "" }] },
            categories: results.categories,
            errors: errors.array()
          });
        }
      );
      return;
    }
    const newProduct = new Product({
      ...req.body,
      category: typeof req.body.category === "undefined" ? [] : req.body.category,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        path: req.file.path,
        url: ""
      }
    })
    newProduct.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(newProduct.url);
    });
  }
]

const product_update_get = (req, res, next) => {
  async.parallel(
    {
      product(cb) {
        Product.findById(req.params.id)
          .populate("category")
          .exec(cb)
      },
      categories(cb) {
        Category.find(cb)
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
      }
      res.render("products/create", {
        title: "Update Product",
        active: "",
        product: results.product,
        categories: results.categories,
        errors: []
      });
    }
  )
}

const product_update_post = [
  body("title", "Product title required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Product description required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("stock", "Product stock required and should be numeric")
    .trim()
    .isNumeric()
    .escape(),
  body("category.*").escape(),
  body("image")
    .custom((value, { req }) => {
      if (!req.file) throw new Error("Image required");
      return true;
    }),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped/trimmed data and old id.
    const newProduct = new Product({
      ...req.body,
      category: typeof req.body.category === "undefined" ? [] : req.body.category,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        path: req.file.path,
        url: ""
      },
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("products/create", {
            title: "Update Book",
            active: "",
            product: newProduct,
            genres: results.genres,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Product.findByIdAndUpdate(req.params.id, newProduct, {}, (err, theProduct) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to product detail page.
      res.redirect(theProduct.url);
    });
  },
];

const product_delete_get = (req, res, next) => {
  async.parallel(
    {
      product(callback) {
        Product.findById(req.params.id).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        res.redirect("/products");
      }
      // Successful, so render.
      res.render("products/delete", {
        title: "Delete Product",
        active: "",
        product: results.product,
      });
    }
  );
};

const product_delete_post = (req, res, next) => {
  if (req.body.password === process.env.ADMIN) {
    Product.findByIdAndRemove(req.body.productId, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/products");
    });
  }
  else {
    res.render("error", {
      title: "Error",
      active: "",
      error: {
        reason: "Wrong password"
      }
    })
  }
};

module.exports = {
  product_index,
  product_detail,
  product_create_get,
  upload,
  product_create_post,
  product_delete_get,
  product_delete_post,
  product_update_get,
  product_update_post
}