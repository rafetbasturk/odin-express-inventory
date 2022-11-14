const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number },
  rating: { type: Number },
  stock: { type: Number, required: true },
  brand: { type: String },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  image: {
    data: Buffer,
    contentType: String,
    path: String,
    url: String
  }
}, { timestamps: true });

// Virtual for book's URL
ProductSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/products/${this._id}`;
});

ProductSchema.virtual("imgUrl").get(function () {
  // "data:image/image/png;base64,<%=product.image.data.toString('base64')%>"
  return this.image.url === "" ? `data:image/${this.image.contentType};base64,${this.image.data.toString('base64')}` : this.image.url
})

// Export model
module.exports = mongoose.model("Product", ProductSchema);