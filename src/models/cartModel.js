import mongoose from 'mongoose';
const { Schema } = mongoose;

const cartSchema = Schema({
  _id: Schema.Types.ObjectId,
  products: [{ quantity: Number, type: Schema.Types.ObjectId, ref: 'products' }]
});

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;