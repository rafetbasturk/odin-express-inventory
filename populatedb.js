#! /usr/bin/env node

console.log('This script populates some products and categories to the database.');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const Product = require('./models/productModel')
const Category = require('./models/categoryModel')


const mongoose = require('mongoose');
const dbURI = userArgs[0];
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products = []
var categories = []

function productCreate(title, description, price, rating, brand, stock, category, image, cb) {
  productDetail = {
    title,
    description,
    price,
    rating,
    brand, 
    stock,
    category,
    image
  }

  const product = new Product(productDetail);

  product.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New product: ' + product);
    products.push(product)
    cb(null, product)
  });
}

function categoryCreate(title, description, cb) {
  const category = new Category({ title, description });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  });
}

function createCategories(cb) {
  async.series([
    function (callback) {
      categoryCreate('smartphones', "Consectetur adipisicing elit.", callback);
    },
    function (callback) {
      categoryCreate('laptops', "Voluptas laboriosam esse molestias quos!", callback);
    },
    function (callback) {
      categoryCreate('fragrances', "Maiores placeat consequuntur possimus quidem.", callback);
    },
    function (callback) {
      categoryCreate('skincare', "Sit amet consectetur adipisicing elit", callback);
    },
    function (callback) {
      categoryCreate('groceries', "Possimus quidem reprehenderit aperiam voluptas laboriosam.", callback);
    },
    function (callback) {
      categoryCreate('home-decoration', "Lorem ipsum dolor sit amet", callback);
    }
  ], cb);
}

function createProducts(cb) {
  async.parallel([
    function (callback) {
      productCreate('iPhone 9', 'An apple mobile which is nothing like apple', 549, 4.69, 'Apple', 94, [categories[0]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/1/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('iPhone X', 'SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...', 899, 4.44, 'Apple', 34, [categories[0]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/2/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Samsung Universe 9', "Samsung's new variant which goes beyond Galaxy to the Universe", 1249, 4.09, 'Samsung', 36, [categories[0]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/3/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('OPPOF19', 'OPPO F19 is officially announced on April 2021.', 280, 4.3, 'OPPO', 123, [categories[0]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/4/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Huawei P30', 'Huawei’s re-badged P30 Pro New Edition was officially unveiled yesterday in Germany and now the device has made its way to the UK.', 499, 4.09, 'Huawei', 32, [categories[0]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/5/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('MacBook Pro', 'MacBook Pro 2021 with mini-LED display may launch between September, November', 1749, 4.57, 'Apple', 83, [categories[1]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/6/thumbnail.png'}, callback)
    },
    function (callback) {
      productCreate('Samsung Galaxy Book', 'Samsung Galaxy Book S (2020) Laptop With Intel Lakefield Chip, 8GB of RAM Launched', 1499, 4.25, 'Samsung', 50, [categories[1]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/7/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Microsoft Surface Laptop 4', 'Style and speed. Stand out on HD video calls backed by Studio Mics. Capture ideas on the vibrant touchscreen.', 1499, 4.43, 'Microsoft Surface', 68, [categories[1]],{data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/8/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Infinix INBOOK', 'Infinix Inbook X1 Ci3 10th 8GB 256GB 14 Win10 Grey – 1 Year Warranty', 1099, 4.54, 'Infinix', 96, [categories[1]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/9/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('HP Pavilion 15-DK1056WM', 'HP Pavilion 15-DK1056WM Gaming Laptop 10th Gen Core i5, 8GB, 256GB SSD, GTX 1650 4GB, Windows 10', 1099, 4.43, 'HP Pavilion', 89, [categories[1]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/10/thumbnail.jpeg'}, callback)
    },
    function (callback) {
      productCreate('Perfume Oil', 'Mega Discount, Impression of Acqua Di Gio by GiorgioArmani concentrated attar perfume Oil', 13, 4.26, 'Impression of Acqua Di Gio', 65, [categories[2]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/11/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Brown Perfume', 'Royal_Mirage Sport Brown Perfume for Men & Women - 120ml', 40, 4, 'Royal_Mirage', 52, [categories[2]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/12/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Fog Scent Xpressio Perfume', 'Product details of Best Fog Scent Xpressio Perfume 100ml For Men cool long lasting perfumes for Men', 13, 4.59, 'Fog Scent Xpressio', 61, [categories[2]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/13/thumbnail.webp'}, callback)
    },
    function (callback) {
      productCreate('Non-Alcoholic Concentrated Perfume Oil', 'Original Al Munakh® by Mahal Al Musk | Our Impression of Climate | 6ml Non-Alcoholic Concentrated Perfume Oil', 120, 4.21, 'Al Munakh', 114, [categories[2]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/14/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Eau De Perfume Spray', 'Genuine Al-Rehab spray perfume from UAE/Saudi Arabia/Yemen High Quality', 30, 4.7, 'Lord - Al-Rehab', 105, [categories[2]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/15/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Hyaluronic Acid Serum', "L'OrÃ©al Paris introduces Hyaluron Expert Replumping Serum formulated with 1.5% Hyaluronic Acid", 19, 4.83, "L'Oreal Paris", 110, [categories[3]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/16/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Tree Oil 30ml', 'Tea tree oil contains a number of compounds, including terpinen-4-ol, that have been shown to kill certain bacteria,', 12, 4.52, 'Hemani Tea', 78, [categories[3]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/17/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Oil Free Moisturizer 100ml', 'Dermive Oil Free Moisturizer with SPF 20 is specifically formulated with ceramides, hyaluronic acid & sunscreen.', 40, 4.56, 'Dermive', 88, [categories[3]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/18/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Skin Beauty Serum', 'Product name: rorec collagen hyaluronic acid white face serum riceNet weight: 15 m', 46, 4.42, 'ROREC White Rice', 54, [categories[3]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/19/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Freckle Treatment Cream- 15gm', "Fair & Clear is Pakistan's only pure Freckle cream which helpsfade Freckles, Darkspots and pigments. Mercury level is 0%, so there are no side effects.", 70, 4.06, 'Fair & Clear', 140, [categories[3]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/20/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Daal Masoor 500 grams', 'Fine quality Branded Product Keep in a cool and dry place', 20, 4.44, 'Saaf & Khaas', 133, [categories[4]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/21/thumbnail.png'}, callback)
    },
    function (callback) {
      productCreate('Elbow Macaroni - 400 gm', 'Product details of Bake Parlor Big Elbow Macaroni - 400 gm', 14, 4.57, 'Bake Parlor Big', 146, [categories[4]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/22/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Orange Essence Food Flavour', 'Specifications of Orange Essence Food Flavour For Cakes and Baking Food Item', 14, 4.85, 'Baking Food Items', 26, [categories[4]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/23/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Cereals muesli fruit nuts', 'Original fauji cereal muesli 250gm box pack original fauji cereals muesli fruit nuts flakes breakfast cereal break fast faujicereals cerels cerel foji fouji', 46, 4.94, 'Fauji', 113, [categories[4]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/24/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Gulab Powder 50 Gram', 'Dry Rose Flower Powder Gulab Powder 50 Gram • Treats Wounds', 70, 4.87, 'Dry Rose', 47, [categories[4]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/25/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Plant Hanger For Home', 'Boho Decor Plant Hanger For Home Wall Decoration Macrame Wall Hanging Shelf', 41, 4.08, 'Boho Decor', 131, [categories[5]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/26/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Flying Wooden Bird', 'Package Include 6 Birds with Adhesive Tape Shape: 3D Shaped Wooden Birds Material: Wooden MDF, Laminated 3.5mm', 51, 4.41, 'Flying Wooden', 17, [categories[5]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/27/thumbnail.webp'}, callback)
    },
    function (callback) {
      productCreate('3D Embellishment Art Lamp', '3D led lamp sticker Wall sticker 3d wall art light on/off button  cell operated (included)', 20, 4.82, 'LED Lights', 54, [categories[5]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/28/thumbnail.jpg'}, callback)
    },
    function (callback) {
      productCreate('Handcraft Chinese style', 'Handcraft Chinese style art luxury palace hotel villa mansion home decor ceramic vase with brass fruit plate', 60, 4.44, 'Luxury Palace', 7, [categories[5]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/29/thumbnail.webp'}, callback)
    },
    function (callback) {
      productCreate('Key Holder', 'Attractive DesignMetallic materialFour key hooksReliable & DurablePremium Quality', 30, 4.92, 'Golden', 54, [categories[5]], {data: "", path: "", contentType: "", url: 'https://dummyjson.com/image/i/products/30/thumbnail.jpg'}, callback)
    }
  ], cb);
}

async.series([
  createCategories,
  createProducts
], function (err, results) {
  if (err) {
    console.log('FINAL ERR: ' + err);
  }
  else {
    console.log('Products: ' + products);
  }
  // All done, disconnect from database
  mongoose.connection.close();
});